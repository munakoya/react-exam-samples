import AddIcon from "@mui/icons-material/Add";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";
import { BookAvatar, bookGenreLabels, useBookStore } from "@/entities/book";
import { DUE_SOON_DAYS, isActiveLoan, useLoanStore } from "@/entities/loan";
import { LoadSampleDataButton } from "@/features/load-sample-data";
import { diffDays, todayString } from "@/shared/lib";
import { EmptyState, PageHeader, StatCard } from "@/shared/ui";
import { LoanTable } from "@/widgets/loan-table";

/**
 * ダッシュボード（/） ── pages/dashboard/ui
 *
 * 集計の数字・期限切れ・期限が近い貸出・最近登録した本を1画面にまとめる。
 * 数字はすべて store の値から計算する（件数を store に保存しない）。
 */

// このページの中だけで使う見出し付きのまとまり。小さいので同じファイルに置く
const Section = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => (
  <Stack component="section" spacing={1.5}>
    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {action}
    </Stack>
    {children}
  </Stack>
);

export const DashboardPage = () => {
  const books = useBookStore((state) => state.books);
  const loans = useLoanStore((state) => state.loans);
  const today = todayString();

  // ----- 1冊もないとき：案内だけを出す -----
  if (books.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <PageHeader title="ダッシュボード" />
          <EmptyState
            title="まだ本が登録されていません"
            description="「本を登録」から追加してください。動作を確かめるだけなら、サンプルデータも入れられます。"
            action={
              <Stack direction="row" spacing={1}>
                <Button component={RouterLink} to="/books/new" variant="contained" startIcon={<AddIcon />}>
                  本を登録
                </Button>
                <LoadSampleDataButton />
              </Stack>
            }
          />
        </Stack>
      </Container>
    );
  }

  // ----- 集計（どれも計算で求める） -----
  const activeLoans = loans.filter(isActiveLoan);
  const byDueDate = (a: { dueDate: string }, b: { dueDate: string }) => a.dueDate.localeCompare(b.dueDate);
  const overdueLoans = activeLoans.filter((loan) => loan.dueDate < today).toSorted(byDueDate);
  const dueSoonLoans = activeLoans
    .filter((loan) => loan.dueDate >= today && diffDays(today, loan.dueDate) <= DUE_SOON_DAYS)
    .toSorted(byDueDate);
  const thisMonth = today.slice(0, 7); // "2026-10"
  const loanCountThisMonth = loans.filter((loan) => loan.loanedAt.startsWith(thisMonth)).length;
  // 最近登録した本：新しい順に並べて先頭の4冊（toSorted は元の配列を変えない）
  const recentBooks = books.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={4}>
        <PageHeader
          title="ダッシュボード"
          action={
            <Button component={RouterLink} to="/books/new" variant="contained" startIcon={<AddIcon />}>
              本を登録
            </Button>
          }
        />

        {/* ----- 集計の数字：スマホ 2列・PC 4列 ----- */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="蔵書" value={books.length} unit="冊" icon={<LibraryBooksOutlinedIcon />} to="/books" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="貸出中" value={activeLoans.length} unit="冊" icon={<OutboxOutlinedIcon />} color="primary" to="/loans" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              label="期限切れ"
              value={overdueLoans.length}
              unit="冊"
              icon={<ErrorOutlinedIcon />}
              // 0冊なら目立たせない
              color={overdueLoans.length > 0 ? "error" : undefined}
              to="/loans?tab=overdue"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="今月の貸出" value={loanCountThisMonth} unit="件" icon={<EventAvailableOutlinedIcon />} />
          </Grid>
        </Grid>

        <Section title="返却期限を過ぎている本">
          <LoanTable loans={overdueLoans} today={today} emptyMessage="期限切れの本はありません" />
        </Section>

        <Section title={`返却期限が近い本（${DUE_SOON_DAYS}日以内）`}>
          <LoanTable loans={dueSoonLoans} today={today} emptyMessage="期限が近い本はありません" />
        </Section>

        <Section
          title="最近登録した本"
          action={
            <Button component={RouterLink} to="/books">
              すべて見る
            </Button>
          }
        >
          {/* Grid：スマホ 1列・600px〜 2列・900px〜 4列 */}
          <Grid container spacing={2}>
            {recentBooks.map((book) => (
              <Grid key={book.id} size={{ xs: 12, sm: 6, md: 3 }}>
                {/* height: 100% で、同じ行のカードの高さをそろえる */}
                <Card sx={{ height: "100%" }}>
                  <CardActionArea component={RouterLink} to={`/books/${book.id}`} sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <BookAvatar book={book} />
                        <Stack sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700 }} noWrap>
                            {book.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {book.author}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Chip label={bookGenreLabels[book.genre]} size="small" variant="outlined" sx={{ mt: 1.5 }} />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>
      </Stack>
    </Container>
  );
};
