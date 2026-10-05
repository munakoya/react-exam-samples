import Button from "@mui/material/Button";
import { useBudgetStore } from "@/entities/budget";
import { useTransactionStore, type Category, type Transaction, type TransactionType } from "@/entities/transaction";
import { addMonths, thisMonthString } from "@/shared/lib";
import { notify } from "@/shared/ui";

/**
 * 「サンプルデータを入れる」ボタン ── features/load-sample-data/ui
 *
 * お題の要件ではない（動作確認用）。今月と先月の記録、月の予算を入れる。試験で作るときは不要。
 */

// [何か月前, 日, 種類, カテゴリ, 金額, メモ]
const samples: [number, number, TransactionType, Category, number, string][] = [
  [0, 1, "income", "salary", 240000, "給料"],
  [0, 1, "expense", "housing", 72000, "家賃"],
  [0, 2, "expense", "food", 3200, "スーパー"],
  [0, 3, "expense", "transport", 1500, ""],
  [0, 4, "expense", "daily", 980, "洗剤"],
  [0, 4, "expense", "food", 1250, "昼ごはん"],
  [0, 5, "expense", "entertainment", 4800, "映画"],
  [0, 5, "expense", "utility", 8600, "電気"],
  [0, 5, "income", "side", 15000, "原稿料"],
  [1, 1, "income", "salary", 240000, "給料"],
  [1, 1, "expense", "housing", 72000, "家賃"],
  [1, 8, "expense", "food", 28500, ""],
  [1, 12, "expense", "utility", 9200, ""],
  [1, 20, "expense", "medical", 3400, "歯医者"],
  [1, 25, "expense", "entertainment", 12000, "旅行"],
];

export const LoadSampleDataButton = () => {
  const addTransactions = useTransactionStore((state) => state.addTransactions);
  const setMonthlyBudget = useBudgetStore((state) => state.setMonthlyBudget);

  const handleClick = () => {
    const now = new Date().toISOString();
    const transactions: Transaction[] = samples.map(([monthsAgo, day, type, category, amount, memo]) => ({
      id: crypto.randomUUID(),
      date: `${addMonths(thisMonthString(), -monthsAgo)}-${String(day).padStart(2, "0")}`,
      type,
      category,
      amount,
      memo,
      createdAt: now,
    }));
    addTransactions(transactions);
    setMonthlyBudget(150000);
    notify(`サンプルデータ（${transactions.length}件・予算 15万円）を入れました`, "info");
  };

  return <Button onClick={handleClick}>サンプルデータを入れる</Button>;
};
