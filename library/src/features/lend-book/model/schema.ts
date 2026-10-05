import { z } from "zod";
import { addDays } from "@/shared/lib";

/**
 * 貸出フォームの入力チェック ── features/lend-book/model
 *
 * 「返却期限は今日以降・30日以内」のチェックは、今日の日付によって変わる。
 * そこで、今日の日付を受け取ってスキーマを作る関数（スキーマの工場）にしている。
 *
 *   const schema = createLendSchema(todayString());
 */

/** 貸出できる最長の日数 */
export const MAX_LOAN_DAYS = 30;

export const createLendSchema = (today: string) =>
  z.object({
    borrower: z
      .string()
      .trim()
      .min(1, "借りる人の名前を入力してください")
      .max(30, "30文字以内で入力してください"),
    dueDate: z
      // z.iso.date()："YYYY-MM-DD" の形か。空欄（""）もここでエラーになる
      .iso.date({ error: "返却期限を入力してください" })
      // "YYYY-MM-DD" は文字列のまま大小を比べられる
      .refine((value) => value >= today, "今日以降の日付を選んでください")
      .refine(
        (value) => value <= addDays(today, MAX_LOAN_DAYS),
        `返却期限は今日から${MAX_LOAN_DAYS}日以内にしてください`,
      ),
  });

export type LendFormValues = z.output<ReturnType<typeof createLendSchema>>;
