import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { isInMonth, transactionTypes, useTransactionStore, type TransactionType } from "@/entities/transaction";
import { LoadSampleDataButton } from "@/features/load-sample-data";
import { MonthSwitcher, useSelectedMonth } from "@/features/select-month";
import { TransactionFormDialog, useTransactionFormDialog } from "@/features/transaction-form";
import { formatMonth, thisMonthString, todayString } from "@/shared/lib";
import { EmptyState, PageHeader } from "@/shared/ui";
import { MonthlySummary } from "@/widgets/monthly-summary";
import { TransactionTable } from "@/widgets/transaction-table";

/**
 * 家計簿のページ（/?month=2026-10） ── pages/budget-book/ui
 *
 *   ┌ 家計簿                          [＋ 記録する] ┐
 *   │ ‹ 2026年10月 ›                              │ ← 月（URL の ?month）
 *   │ [収入][支出][収支]                          │ ← まとめ（widgets/monthly-summary）
 *   │ [予算 ████░░]  [カテゴリ別の支出]           │
 *   │ [すべて|支出|収入]                          │ ← 種類の絞り込み（このページの useState）
 *   │ ┌ 日付 │ 種類 │ カテゴリ │ 金額 │ 操作 ┐   │ ← 記録の表（widgets/transaction-table）
 *   └──────────────────────────────┘
 *
 * 表示する記録・合計は、すべて store の記録と月から計算する。
 */

type TypeFilter = "all" | TransactionType;

export const BudgetBookPage = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const { month, setMonth } = useSelectedMonth();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const dialog = useTransactionFormDialog();

  // ----- 計算で求める値 -----
  // その月の記録（合計はこれで計算する。種類の絞り込みは表だけに効かせる）
  const monthTransactions = transactions.filter((t) => isInMonth(t, month));
  // 表に出す記録：種類で絞り込み、日付の新しい順（同じ日なら登録が新しい順）
  const visibleTransactions = monthTransactions
    .filter((t) => typeFilter === "all" || t.type === typeFilter)
    .toSorted((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  // 新しく記録するときの日付の初期値：今月なら今日、それ以外の月ならその月の 1 日
  const defaultDate = month === thisMonthString() ? todayString() : `${month}-01`;

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>
      記録する
    </Button>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="家計簿" description="収入と支出を記録し、月ごとに確認する" action={addButton} />

        {transactions.length === 0 ? (
          // ----- 1件もないとき -----
          <EmptyState
            title="まだ記録がありません"
            description="「記録する」から収入・支出を入れてください。動作を確かめるだけなら、サンプルデータも入れられます。"
            action={
              <Stack direction="row" spacing={1}>
                {addButton}
                <LoadSampleDataButton />
              </Stack>
            }
          />
        ) : (
          <>
            <MonthSwitcher month={month} onChange={setMonth} />
            <MonthlySummary transactions={monthTransactions} />

            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h6" component="h2">
                記録（{visibleTransactions.length}件）
              </Typography>
              {/* exclusive：1つだけ選べる。選択中をもう一度押すと null が届くので無視する */}
              <ToggleButtonGroup
                exclusive
                size="small"
                value={typeFilter}
                onChange={(_event, value: string | null) => {
                  if (value === "all") setTypeFilter("all");
                  const next = transactionTypes.find((t) => t === value);
                  if (next) setTypeFilter(next);
                }}
                aria-label="種類で絞り込む"
              >
                <ToggleButton value="all">すべて</ToggleButton>
                <ToggleButton value="expense">支出</ToggleButton>
                <ToggleButton value="income">収入</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {visibleTransactions.length === 0 ? (
              <EmptyState title={`${formatMonth(month)}の記録はありません`} action={addButton} />
            ) : (
              <TransactionTable transactions={visibleTransactions} onEdit={dialog.openEdit} />
            )}
          </>
        )}
      </Stack>

      <TransactionFormDialog
        open={dialog.open}
        transaction={dialog.transaction}
        defaultDate={defaultDate}
        onClose={dialog.close}
      />
    </Container>
  );
};
