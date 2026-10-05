import { z } from "zod";

/**
 * 貸出の記録1件の型 ── entities/loan/model
 *
 * 「どの本を・誰が・いつ借りて・いつまでに返すか・いつ返したか」を記録する。
 * 本とは bookId（本の id）でつなぐ。本のデータを丸ごとコピーして持たないのは、
 * 本のタイトルを直したときに、貸出の記録まで直す手間をなくすため。
 *
 * entities 同士は import し合わないので、ここでは Book 型を使わない（bookId の文字列だけ）。
 */

export const loanSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  borrower: z.string(), // 借りた人の名前
  loanedAt: z.string(), // 貸出日 "YYYY-MM-DD"
  dueDate: z.string(), // 返却期限 "YYYY-MM-DD"
  returnedAt: z.string(), // 返却日 "YYYY-MM-DD"。まだ返していなければ ""
});

export type Loan = z.infer<typeof loanSchema>;

/** 貸し出すときにフォームから受け取る値（id と返却日は store で付ける） */
export type LoanInput = Omit<Loan, "id" | "returnedAt">;

// ---------- 貸出の状態 ----------
// 保存はせず、返却日と期限から毎回計算する（保存すると、日付が変わったときに更新し忘れる）

export const loanStatuses = ["active", "overdue", "returned"] as const;
export type LoanStatus = (typeof loanStatuses)[number];

export const loanStatusLabels: Record<LoanStatus, string> = {
  active: "貸出中",
  overdue: "期限切れ",
  returned: "返却済み",
};

/** まだ返却されていないか */
export const isActiveLoan = (loan: Loan) => loan.returnedAt === "";

/**
 * 貸出の状態を求める
 *
 * today を引数で受け取るのは、テストしやすくするため・1回の描画で「今日」をそろえるため。
 * "YYYY-MM-DD" は文字列のまま大小を比べられる。
 */
export const getLoanStatus = (loan: Loan, today: string): LoanStatus => {
  if (!isActiveLoan(loan)) return "returned";
  if (loan.dueDate < today) return "overdue";
  return "active";
};

// ---------- 本から見た状態（貸出可・貸出中・期限切れ） ----------

export const availabilities = ["available", "onLoan", "overdue"] as const;
export type Availability = (typeof availabilities)[number];

export const availabilityLabels: Record<Availability, string> = {
  available: "貸出可",
  onLoan: "貸出中",
  overdue: "期限切れ",
};

export const availabilityOptions = availabilities.map((value) => ({
  value,
  label: availabilityLabels[value],
}));

/** 今の貸出（なければ undefined）から、本の状態を求める */
export const getAvailability = (currentLoan: Loan | undefined, today: string): Availability => {
  if (!currentLoan) return "available";
  return currentLoan.dueDate < today ? "overdue" : "onLoan";
};

/**
 * 本の id → 今の貸出（返却されていないもの） の Map を作る
 *
 * 一覧で本ごとに loans.find(…) すると、本の数 × 貸出の数 だけ探すことになる。
 * 先に Map にしておくと、map.get(book.id) ですぐ取り出せる。
 */
export const getCurrentLoanMap = (loans: Loan[]) =>
  new Map(loans.filter(isActiveLoan).map((loan) => [loan.bookId, loan]));
