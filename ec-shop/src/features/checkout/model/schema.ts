import { z } from "zod";
import { paymentMethods } from "@/entities/order";

/**
 * 購入手続きフォームの入力チェック ── features/checkout/model
 *
 * よく出る形式チェックの書き方をまとめている。
 *   - メール   … 空欄なら「入力してください」、形式が違えば「形式が正しくありません」と出し分ける（pipe）
 *   - 電話番号 … 正規表現（regex）
 *   - 郵便番号 … 正規表現。ハイフンはあってもなくてもよい
 *   - 同意     … チェックが true のときだけ通す（refine）
 */
export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "お名前を入力してください")
    .max(30, "30文字以内で入力してください"),

  // pipe：前のチェックが通ったら、次のチェックへ渡す。前で止まれば、後ろのエラーは出ない
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .pipe(z.email("メールアドレスの形式が正しくありません")),

  // ^ と $ で「全体が」この形かを確かめる（ないと、一部が一致するだけで通ってしまう）
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9,10}$/, "ハイフンなしの10〜11桁で入力してください（例：09012345678）"),

  postalCode: z
    .string()
    .trim()
    .regex(/^\d{3}-?\d{4}$/, "7桁で入力してください（例：123-4567）"),

  address: z
    .string()
    .trim()
    .min(1, "住所を入力してください")
    .max(100, "100文字以内で入力してください"),

  paymentMethod: z.enum(paymentMethods, { error: "支払い方法を選択してください" }),

  // z.literal(true) だと初期値の false が型エラーになるので、boolean で受けて true だけ通す
  agreed: z.boolean().refine((value) => value, { error: "利用規約への同意が必要です" }),
});

export type CheckoutFormInput = z.input<typeof checkoutSchema>;
export type CheckoutFormValues = z.output<typeof checkoutSchema>;

export const checkoutDefaultValues: CheckoutFormInput = {
  name: "",
  email: "",
  phone: "",
  postalCode: "",
  address: "",
  paymentMethod: "card",
  agreed: false,
};
