import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Alert,
  Button,
  Card,
  CheckboxGroup,
  Container,
  ImageField,
  PageHeader,
  RadioGroup,
  RatingField,
  SelectField,
  Stack,
  Switch,
  TextAreaField,
  TextField,
} from "@/shared/ui";
import styles from "./FormDemoPage.module.css";

/**
 * フォームの組み立て例（/form）── 本のレビューを登録する
 *
 * React Hook Form ＋ zod で、部品ごとのつなぎ方をまとめて確かめるページ。
 *   - TextField・TextAreaField・SelectField・RadioGroup・Switch … {...register("名前")} をそのまま渡す
 *   - CheckboxGroup … register で、選んだ値の配列が届く
 *   - RatingField   … register で "4" のような文字列が届くので、zod の z.coerce.number() で数値にする
 *   - ImageField    … 値を親が持つ部品なので、Controller でつなぐ
 */

const genreOptions = [
  { value: "novel", label: "小説" },
  { value: "business", label: "ビジネス" },
  { value: "tech", label: "技術書" },
  { value: "comic", label: "漫画" },
];

const statusOptions = [
  { value: "want", label: "読みたい" },
  { value: "reading", label: "読んでいる" },
  { value: "done", label: "読み終わった" },
];

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(50, "50文字以内で入力してください"),
  format: z.string().pipe(z.enum(["paper", "ebook"], { error: "形式を選択してください" })),
  status: z.enum(["want", "reading", "done"]),
  // CheckboxGroup：選んだ value の配列。1つ以上を必須にする
  genres: z.array(z.string()).min(1, "ジャンルを1つ以上選んでください"),
  // RatingField：文字列で届くので coerce で数値にしてからチェック
  rating: z.coerce.number().int().min(1, "評価を選んでください").max(5),
  review: z.string().trim().max(200, "200文字以内で入力してください"),
  // ImageField：data URL（文字列）。未選択は ""
  cover: z.string().min(1, "表紙の画像を選んでください"),
  isPublic: z.boolean(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const defaultValues: FormInput = {
  title: "",
  format: "",
  status: "want",
  genres: [], // CheckboxGroup の初期値は配列にする
  rating: 0, // どの星にも当たらない 0 を「未選択」にする
  review: "",
  cover: "",
  isPublic: true,
};

export const FormDemoPage = () => {
  // 送信した値（確認用に画面に出す）
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    control, // Controller に渡す
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Container size="sm">
      <Stack gap={5}>
        <PageHeader
          title="フォームの組み立て例"
          description="本のレビューを登録する（React Hook Form ＋ zod）"
        />

        <Card>
          <form onSubmit={handleSubmit(setSubmitted)} noValidate>
            <Stack gap={4}>
              <TextField label="タイトル" {...register("title")} error={errors.title?.message} />

              <SelectField
                label="形式"
                options={[
                  { value: "paper", label: "紙の本" },
                  { value: "ebook", label: "電子書籍" },
                ]}
                {...register("format")}
                error={errors.format?.message}
              />

              <RadioGroup
                label="状態"
                direction="row"
                options={statusOptions}
                {...register("status")}
              />

              <CheckboxGroup
                label="ジャンル"
                direction="row"
                options={genreOptions}
                {...register("genres")}
                error={errors.genres?.message}
              />

              <RatingField label="評価" {...register("rating")} error={errors.rating?.message} />

              <TextAreaField
                label="感想"
                hint="任意・200文字以内"
                {...register("review")}
                error={errors.review?.message}
              />

              {/*
                Controller：value と onChange を自分で受け渡しする部品（ImageField など）を React Hook Form につなぐ。
                render の field に value・onChange、fieldState にエラーが入っている
              */}
              <Controller
                control={control}
                name="cover"
                render={({ field, fieldState }) => (
                  <ImageField
                    label="表紙"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Switch label="ほかの人に公開する" {...register("isPublic")} />

              <Stack direction="row" gap={2} justify="end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    reset(); // defaultValues に戻す
                    setSubmitted(null);
                  }}
                >
                  リセット
                </Button>
                <Button type="submit">登録</Button>
              </Stack>
            </Stack>
          </form>
        </Card>

        {submitted && (
          <Alert tone="success" title="送信された値（zod のチェック後）">
            <pre className={styles.json}>
              {JSON.stringify(
                // 画像の data URL は長いので、先頭だけ表示する
                { ...submitted, cover: `${submitted.cover.slice(0, 40)}…` },
                null,
                2,
              )}
            </pre>
          </Alert>
        )}
      </Stack>
    </Container>
  );
};
