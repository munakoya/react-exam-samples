import { z } from "zod";

/**
 * 収支の記録1件の型と、集計の関数 ── entities/transaction/model
 *
 * 「いつ・収入か支出か・何に・いくら」を記録する。
 * 月の合計・カテゴリ別の内訳は保存せず、記録から毎回計算する（下の summarize・sumByCategory）。
 */

// ---------- 種類（収入・支出） ----------

export const transactionTypes = ["expense", "income"] as const;
export type TransactionType = (typeof transactionTypes)[number];

export const transactionTypeLabels: Record<TransactionType, string> = {
  expense: "支出",
  income: "収入",
};

export const transactionTypeOptions = transactionTypes.map((value) => ({
  value,
  label: transactionTypeLabels[value],
}));

// ---------- カテゴリ（種類によって選択肢が変わる） ----------

const expenseCategories = [
  "food",
  "daily",
  "housing",
  "utility",
  "transport",
  "entertainment",
  "medical",
  "otherExpense",
] as const;
const incomeCategories = ["salary", "bonus", "side", "otherIncome"] as const;

/** すべてのカテゴリ（zod の enum・型に使う） */
export const categories = [...expenseCategories, ...incomeCategories] as const;
export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, string> = {
  food: "食費",
  daily: "日用品",
  housing: "住居",
  utility: "水道・光熱",
  transport: "交通",
  entertainment: "娯楽",
  medical: "医療",
  otherExpense: "その他の支出",
  salary: "給与",
  bonus: "賞与",
  side: "副収入",
  otherIncome: "その他の収入",
};

/** 種類 → その種類で選べるカテゴリ */
const categoriesByType: Record<TransactionType, readonly Category[]> = {
  expense: expenseCategories,
  income: incomeCategories,
};

/** 種類に合うカテゴリの { value, label } の配列（フォームのセレクトに使う） */
export const categoryOptionsOf = (type: TransactionType) =>
  categoriesByType[type].map((value) => ({ value, label: categoryLabels[value] }));

/** そのカテゴリが、その種類で選べるものか */
export const isCategoryOf = (type: TransactionType, category: string) =>
  categoriesByType[type].some((value) => value === category);

// ---------- 記録 ----------

export const transactionSchema = z.object({
  id: z.string(),
  date: z.string(), // "YYYY-MM-DD"
  type: z.enum(transactionTypes),
  category: z.enum(categories),
  amount: z.number().int().min(1), // 円。収入も支出もプラスの数で持ち、type で区別する
  memo: z.string(),
  createdAt: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionInput = Omit<Transaction, "id" | "createdAt">;

// ---------- 集計（保存せず、毎回計算する） ----------

/** その月（"YYYY-MM"）の記録か */
export const isInMonth = (transaction: Transaction, month: string) => transaction.date.startsWith(month);

/** 収入・支出・収支（収入 − 支出）の合計 */
export const summarize = (transactions: Transaction[]) => {
  const total = (type: TransactionType) =>
    transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
  const income = total("income");
  const expense = total("expense");
  return { income, expense, balance: income - expense };
};

/** 支出のカテゴリ別の合計（多い順） */
export const sumByCategory = (transactions: Transaction[]) => {
  const sums = new Map<Category, number>();
  for (const t of transactions) {
    if (t.type === "expense") sums.set(t.category, (sums.get(t.category) ?? 0) + t.amount);
  }
  // [["food", 32000], …] → [{ category: "food", amount: 32000 }, …] を多い順に
  return [...sums]
    .map(([category, amount]) => ({ category, amount }))
    .toSorted((a, b) => b.amount - a.amount);
};
