import { z } from "zod";
import { categories, isCategoryOf, transactionTypes, type Transaction, type TransactionType } from "@/entities/transaction";

/**
 * 収支の記録フォームの入力チェック ── features/transaction-form/model
 *
 *   amount   … 入力中は文字列（"1200"）→ チェック後は数値（1200）
 *   category … 入力中は未選択の "" もある → チェック後は "food" など。
 *              さらに「選んだ種類（収入・支出）のカテゴリか」を、項目同士を比べるチェック（superRefine）で確かめる
 */

export const MAX_AMOUNT = 9_999_999; // 数字の _ は読みやすくするための区切り（9999999 と同じ）

export const transactionFormSchema = z
  .object({
    date: z.iso.date({ error: "日付を入力してください" }),
    type: z.enum(transactionTypes),
    category: z.string().pipe(z.enum(categories, { error: "カテゴリを選択してください" })),
    amount: z
      .string()
      .min(1, "金額を入力してください")
      .regex(/^\d+$/, "金額は数字だけで入力してください")
      .transform(Number) // 文字列 → 数値
      .pipe(
        z
          .number()
          .min(1, "1円以上で入力してください")
          .max(MAX_AMOUNT, `${MAX_AMOUNT.toLocaleString()}円以下で入力してください`),
      ),
    memo: z.string().trim().max(50, "50文字以内で入力してください"),
  })
  /*
   * superRefine：複数の項目を見比べるチェック。各項目のチェックがすべて通った後に動く。
   * path でエラーを出す項目を決めると、その入力欄の下にエラーが出る。
   */
  .superRefine((values, ctx) => {
    if (!isCategoryOf(values.type, values.category)) {
      ctx.addIssue({ code: "custom", message: "種類に合うカテゴリを選択してください", path: ["category"] });
    }
  });

export type TransactionFormInput = z.input<typeof transactionFormSchema>;
export type TransactionFormValues = z.output<typeof transactionFormSchema>;

/**
 * フォームの初期値
 *
 *   toFormInput(undefined, "2026-10-05")  … 新規：日付だけ入れておく
 *   toFormInput(transaction)              … 編集：今の値（数値は文字列に）
 */
export const toFormInput = (transaction?: Transaction, defaultDate = ""): TransactionFormInput => ({
  date: transaction?.date ?? defaultDate,
  type: transaction?.type ?? ("expense" satisfies TransactionType),
  category: transaction?.category ?? "",
  amount: transaction ? String(transaction.amount) : "",
  memo: transaction?.memo ?? "",
});
