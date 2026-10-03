import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { itemCategoryOptions } from "@/entities/item";
import { Button, Checkbox, SelectField, Stack, TextAreaField, TextField } from "@/shared/ui";
import { itemFormSchema, type ItemFormInput, type ItemFormValues } from "../model/schema";
import styles from "./ItemForm.module.css";

/**
 * Item の登録・編集フォーム（React Hook Form ＋ zod） ── features/item-form/ui
 *
 * 登録と編集で同じフォームを使い回す。違いは外から渡す。
 *   - defaultValues … 新規なら空欄、編集なら今の値（toFormInput で作る）
 *   - onSubmit      … 新規なら addItem、編集なら updateItem を呼ぶ
 * フォームは「入力とチェック」だけを担当し、保存（store を呼ぶ）はページ側に任せる。
 *
 * 使い方:
 *   <ItemForm
 *     defaultValues={toFormInput()}
 *     submitLabel="登録"
 *     onSubmit={(values) => addItem(values)}
 *     onCancel={() => navigate(-1)}
 *   />
 */

type ItemFormProps = {
  defaultValues: ItemFormInput;
  submitLabel: string;
  /** チェックを通った値だけが渡される */
  onSubmit: (values: ItemFormValues) => void;
  onCancel: () => void;
};

export const ItemForm = ({ defaultValues, submitLabel, onSubmit, onCancel }: ItemFormProps) => {
  const {
    register, // 入力欄と React Hook Form をつなぐ。{...register("name")} を入力欄に渡す
    handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
    formState: { errors, isSubmitting }, // errors.name?.message でエラー文を取り出す
  } = useForm<ItemFormInput, unknown, ItemFormValues>({
    resolver: zodResolver(itemFormSchema), // チェックを zod のスキーマに任せる
    defaultValues,
  });

  return (
    // noValidate：ブラウザ標準のチェック（吹き出し）を止め、zod のエラー表示にそろえる
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={4}>
        {/* 部品の中身は普通の <input> なので、register をそのまま渡せる */}
        <TextField
          label="商品名"
          placeholder="例：牛乳"
          {...register("name")}
          error={errors.name?.message}
        />

        <SelectField
          label="カテゴリ"
          options={itemCategoryOptions}
          {...register("category")}
          error={errors.category?.message}
        />

        {/* 数値の入力欄を2つ横に並べる（狭い画面では折り返す） */}
        <Stack direction="row" gap={3} align="start" wrap>
          <div className={styles.half}>
            {/* valueAsNumber：文字列ではなく number として受け取る */}
            <TextField
              label="在庫数"
              type="number"
              inputMode="numeric" // スマホで数字キーボードを出す
              min={0}
              {...register("quantity", { valueAsNumber: true })}
              error={errors.quantity?.message}
            />
          </div>
          <div className={styles.half}>
            <TextField
              label="発注点"
              type="number"
              inputMode="numeric"
              min={0}
              hint="この数以下で「在庫少」"
              {...register("minQuantity", { valueAsNumber: true })}
              error={errors.minQuantity?.message}
            />
          </div>
        </Stack>

        <TextAreaField
          label="メモ"
          hint="200文字以内（任意）"
          {...register("memo")}
          error={errors.memo?.message}
        />

        {/* チェックボックスは true / false で届く */}
        <Checkbox label="お気に入りにする" {...register("favorite")} />

        <Stack direction="row" gap={2} justify="end">
          <Button variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
