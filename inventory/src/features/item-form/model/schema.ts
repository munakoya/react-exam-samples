import { z } from "zod";
import { itemCategories, type Item } from "@/entities/item";

/**
 * 商品の登録・編集フォームの入力チェック（zod） ── features/item-form/model
 *
 * フォームの値は「入力中の値（input）」と「チェック後の値（output）」で型が違うことがある。
 *   例）category：入力中は未選択の "" もありうる（string）→ チェック後は "food" | "daily" | "other"
 * z.input / z.output で、それぞれの型を取り出せる。
 */

// 0以上の整数。在庫数と発注点で使い回す
const count = (label: string) =>
  z
    .number({ error: `${label}を入力してください` }) // 空欄なら NaN が届き、この文言になる
    .int("整数で入力してください")
    .min(0, "0以上で入力してください")
    .max(9999, "9999以下で入力してください");

export const itemFormSchema = z.object({
  // ----- 文字列（必須） -----
  // trim()：前後の空白を取り除いてからチェックする（空白だけの入力をはじく）
  name: z
    .string()
    .trim()
    .min(1, "商品名を入力してください")
    .max(30, "30文字以内で入力してください"),

  // ----- セレクト -----
  // 文字列で受け取ってから、選択肢のどれかかを確かめる（初期値を未選択の "" にできるように）
  category: z.string().pipe(z.enum(itemCategories, { error: "カテゴリを選択してください" })),

  // ----- 数値 -----
  // フォーム側で register("quantity", { valueAsNumber: true }) にすると number で届く
  quantity: count("在庫数"),
  minQuantity: count("発注点"),

  // ----- 文字列（任意） -----
  memo: z.string().trim().max(200, "200文字以内で入力してください"),

  // ----- チェックボックス -----
  favorite: z.boolean(),
});

/** 入力中の値（useForm の defaultValues の型） */
export type ItemFormInput = z.input<typeof itemFormSchema>;
/** チェックを通った後の値（onSubmit で受け取る型）。entities の ItemInput と同じ形になる */
export type ItemFormValues = z.output<typeof itemFormSchema>;

/**
 * フォームの初期値を作る
 *
 *   toFormInput()      … 新規登録：空欄
 *   toFormInput(item)  … 編集：今の値を入れておく
 */
export const toFormInput = (item?: Item): ItemFormInput => ({
  name: item?.name ?? "",
  category: item?.category ?? "",
  quantity: item?.quantity ?? 0,
  minQuantity: item?.minQuantity ?? 3,
  memo: item?.memo ?? "",
  favorite: item?.favorite ?? false,
});
