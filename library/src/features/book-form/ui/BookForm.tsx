import { zodResolver } from "@hookform/resolvers/zod";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { bookGenreOptions, useBookStore } from "@/entities/book";
import { FormTextField } from "@/shared/ui";
import {
  bookFormSchema,
  MAX_TAGS,
  type BookFormInput,
  type BookFormValues,
} from "../model/schema";

/**
 * 本の登録・編集フォーム（React Hook Form ＋ zod ＋ MUI） ── features/book-form/ui
 *
 * 登録と編集で同じフォームを使い回す。違いは外から渡す。
 *   - defaultValues … 新規なら空欄、編集なら今の値（toFormInput で作る）
 *   - onSubmit      … 新規なら addBook、編集なら updateBook を呼ぶ
 * フォームは「入力とチェック」だけを担当し、保存（store を呼ぶ）はページに任せる。
 *
 * MUI の入力欄と React Hook Form のつなぎ方:
 *   - TextField（文字・数値・セレクト） … FormTextField（shared/ui。中で useController を使う）
 *   - Rating・Autocomplete             … Controller で value と onChange を自分でつなぐ
 *
 *   <BookForm defaultValues={toFormInput()} submitLabel="登録" onSubmit={handleSubmit} onCancel={…} />
 */

type BookFormProps = {
  defaultValues: BookFormInput;
  submitLabel: string;
  /** チェックを通った値だけが渡される */
  onSubmit: (values: BookFormValues) => void;
  onCancel: () => void;
};

/** 前後の空白を消し、空と重複を取り除く（Set は同じ値を1つにまとめる） */
const normalizeTags = (tags: string[]) => [
  ...new Set(tags.map((tag) => tag.trim()).filter((tag) => tag !== "")),
];

export const BookForm = ({ defaultValues, submitLabel, onSubmit, onCancel }: BookFormProps) => {
  const {
    control,
    handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
    formState: { isSubmitting },
  } = useForm<BookFormInput, unknown, BookFormValues>({
    resolver: zodResolver(bookFormSchema), // チェックを zod のスキーマに任せる
    defaultValues,
  });

  // タグの候補：登録済みの本のタグをすべて集め、重複を除いて並べる
  // セレクターでは books をそのまま選び、加工は外で行う（セレクターの中で map すると無限に再描画される）
  const books = useBookStore((state) => state.books);
  const tagOptions = [...new Set(books.flatMap((book) => book.tags))].toSorted((a, b) =>
    a.localeCompare(b, "ja"),
  );

  return (
    // noValidate：ブラウザ標準のチェック（吹き出し）を止め、zod のエラー表示にそろえる
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Grid：12 マスの格子。size={{ xs: 12, sm: 8 }} は スマホで全幅・600px 以上で 8/12 */}
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormTextField control={control} name="title" label="タイトル" required autoFocus />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <FormTextField control={control} name="author" label="著者" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          {/* select を付けるとセレクトボックスになる。未選択は "" */}
          <FormTextField control={control} name="genre" label="ジャンル" select required>
            {bookGenreOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </FormTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <FormTextField
            control={control}
            name="isbn"
            label="ISBN"
            placeholder="978-4-00-000000-0"
            helperText="任意。13桁"
            // <input> 自体の属性は slotProps.htmlInput に書く。inputMode でスマホに数字キーボードを出す
            slotProps={{ htmlInput: { inputMode: "numeric" } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormTextField
            control={control}
            name="publishedYear"
            label="出版年"
            placeholder="2024"
            helperText="任意。西暦4桁"
            slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 4 } }}
          />
        </Grid>

        <Grid size={12}>
          {/*
            Rating は TextField ではないので、Controller で自分でつなぐ。
            Rating の値は number | null（もう一度押すと null）。保存は 0 を「未評価」として扱う
          */}
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <Box>
                <Typography component="legend" variant="body2" color="text.secondary">
                  評価
                </Typography>
                <Rating
                  name={field.name}
                  value={field.value === 0 ? null : field.value}
                  onChange={(_event, value) => field.onChange(value ?? 0)}
                  onBlur={field.onBlur}
                />
                <FormHelperText sx={{ mt: 0 }}>同じ星をもう一度押すと未評価に戻る</FormHelperText>
              </Box>
            )}
          />
        </Grid>

        <Grid size={12}>
          {/*
            Autocomplete（複数選択 ＋ 自由入力）も Controller でつなぐ。
            onChange の第2引数に、選んだ値の配列が届く
          */}
          <Controller
            control={control}
            name="tags"
            render={({ field, fieldState }) => (
              <Autocomplete
                multiple
                freeSolo // 候補にない文字も Enter で追加できる
                options={tagOptions}
                value={field.value}
                onChange={(_event, value) => field.onChange(normalizeTags(value))}
                onBlur={field.onBlur}
                filterSelectedOptions // 選んだものは候補から消す
                renderInput={(params) => (
                  <TextField
                    {...params} // params は必ず全部渡す（中の <input> の設定が入っている）
                    label="タグ"
                    placeholder="入力して Enter"
                    error={fieldState.error !== undefined}
                    helperText={fieldState.error?.message ?? `任意。${MAX_TAGS}個まで`}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <FormTextField
            control={control}
            name="memo"
            label="メモ"
            multiline
            minRows={3}
            helperText="任意。500文字以内"
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={onCancel}>キャンセル</Button>
        {/* loading：送信中は処理中の表示にして押せなくする（二重送信を防ぐ） */}
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
};
