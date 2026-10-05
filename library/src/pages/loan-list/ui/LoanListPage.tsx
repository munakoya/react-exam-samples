import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useSearchParams } from "react-router";
import { getLoanStatus, useLoanStore, type Loan } from "@/entities/loan";
import { todayString } from "@/shared/lib";
import { PageHeader } from "@/shared/ui";
import { LoanTable } from "@/widgets/loan-table";

/**
 * 貸出一覧ページ（/loans?tab=overdue） ── pages/loan-list/ui
 *
 * タブで「貸出中・期限切れ・返却済み・すべて」を切り替える。
 * 選んでいるタブは URL の ?tab= に持つ（ダッシュボードの「期限切れ」から直接開けるように）。
 */

const tabs = ["active", "overdue", "returned", "all"] as const;
type LoanTab = (typeof tabs)[number];

const tabLabels: Record<LoanTab, string> = {
  active: "貸出中",
  overdue: "期限切れ",
  returned: "返却済み",
  all: "すべて",
};

// URL の値は手で書き換えられるので、タブのどれかでなければ "active" にする
const parseTab = (value: string | null): LoanTab => tabs.find((tab) => tab === value) ?? "active";

/** タブに合う貸出を、見やすい順に並べて返す */
const loansForTab = (loans: Loan[], tab: LoanTab, today: string) => {
  const byDueDate = (a: Loan, b: Loan) => a.dueDate.localeCompare(b.dueDate); // 期限が近い順
  switch (tab) {
    case "active": // 期限切れも「まだ返していない」ので含める
      return loans.filter((loan) => getLoanStatus(loan, today) !== "returned").toSorted(byDueDate);
    case "overdue":
      return loans.filter((loan) => getLoanStatus(loan, today) === "overdue").toSorted(byDueDate);
    case "returned": // 返却日が新しい順
      return loans
        .filter((loan) => getLoanStatus(loan, today) === "returned")
        .toSorted((a, b) => b.returnedAt.localeCompare(a.returnedAt));
    case "all": // 貸出日が新しい順
      return loans.toSorted((a, b) => b.loanedAt.localeCompare(a.loanedAt));
  }
};

export const LoanListPage = () => {
  const loans = useLoanStore((state) => state.loans);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));
  const today = todayString();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="貸出一覧" description={`全${loans.length}件の貸出の記録`} />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {/*
            Tabs の value と、各 Tab の value が一致したタブが選ばれる。
            variant="scrollable"：狭い画面ではタブを横にスクロールできるようにする
          */}
          <Tabs
            value={tab}
            onChange={(_event, value: LoanTab) =>
              setSearchParams(value === "active" ? {} : { tab: value }, { replace: true })
            }
            variant="scrollable"
            aria-label="貸出の状態"
          >
            {tabs.map((value) => (
              <Tab key={value} value={value} label={`${tabLabels[value]}（${loansForTab(loans, value, today).length}）`} />
            ))}
          </Tabs>
        </Box>

        <LoanTable
          loans={loansForTab(loans, tab, today)}
          today={today}
          emptyMessage={`${tabLabels[tab]}の貸出はありません`}
        />
      </Stack>
    </Container>
  );
};
