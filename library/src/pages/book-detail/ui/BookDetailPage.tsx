import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { BookAvatar, bookGenreLabels, useBook } from "@/entities/book";
import {
  AvailabilityChip,
  getAvailability,
  isActiveLoan,
  LoanHistoryTable,
  useLoanStore,
} from "@/entities/loan";
import { DeleteBookButton } from "@/features/delete-book";
import { LendBookButton } from "@/features/lend-book";
import { ReturnBookButton } from "@/features/return-book";
import { diffDays, formatDate, formatDateTime, todayString } from "@/shared/lib";
import { DescriptionList, EmptyState, PageHeader } from "@/shared/ui";

/**
 * 本の詳細ページ（/books/:bookId） ── pages/book-detail/ui
 *
 * useParams で URL の :bookId の部分を取り出し、store から1冊を探して表示する。
 *   /books/abc-123  →  useParams() は { bookId: "abc-123" }
 */
export const BookDetailPage = () => {
  const navigate = useNavigate();
  // <Route path="/books/:bookId"> の :bookId と同じ名前で取り出す
  const { bookId } = useParams<{ bookId: string }>();
  const book = useBook(bookId);
  // 貸出は全部の配列を選び、この本の分だけを下で取り出す（セレクターの中で filter しない）
  const loans = useLoanStore((state) => state.loans);
  const today = todayString();

  // URL の id の本がない（削除済み・打ち間違い）ときの表示
  if (!book) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="本が見つかりません"
          description="削除されたか、URL が間違っている可能性があります。"
          action={
            <Button component={RouterLink} to="/books">
              本の一覧へ戻る
            </Button>
          }
        />
      </Container>
    );
  }

  // この本の貸出の記録（新しい順）と、今の貸出
  const bookLoans = loans
    .filter((loan) => loan.bookId === book.id)
    .toSorted((a, b) => b.loanedAt.localeCompare(a.loanedAt));
  const currentLoan = bookLoans.find(isActiveLoan);
  const availability = getAvailability(currentLoan, today);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title={book.title}
          description={book.author}
          breadcrumbs={[{ label: "本の一覧", to: "/books" }, { label: book.title }]}
          action={
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {currentLoan ? (
                <ReturnBookButton loan={currentLoan} bookTitle={book.title} />
              ) : (
                <LendBookButton book={book} />
              )}
              {/* ページを移動するだけなので、onClick ＋ navigate ではなくリンクにする（新しいタブでも開ける） */}
              <Button
                component={RouterLink}
                to={`/books/${book.id}/edit`}
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
              >
                編集
              </Button>
              {/* 削除したら一覧へ。replace：「戻る」で削除済みのページに戻らないように */}
              <DeleteBookButton book={book} onDeleted={() => navigate("/books", { replace: true })} />
            </Stack>
          }
        />

        {/* ----- 今の貸出の状況 ----- */}
        {currentLoan &&
          (availability === "overdue" ? (
            <Alert severity="error">
              {currentLoan.borrower}さんに貸出中。返却期限（{formatDate(currentLoan.dueDate)}）を
              {-diffDays(today, currentLoan.dueDate)}日過ぎています。
            </Alert>
          ) : (
            <Alert severity="info">
              {currentLoan.borrower}さんに貸出中（返却期限：{formatDate(currentLoan.dueDate)}）
            </Alert>
          ))}

        {/* ----- 本の情報 ----- */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
              <BookAvatar book={book} size={56} />
              <Stack direction="row" spacing={1}>
                <Chip label={bookGenreLabels[book.genre]} size="small" variant="outlined" />
                <AvailabilityChip availability={availability} />
              </Stack>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <DescriptionList
              items={[
                { term: "著者", description: book.author },
                { term: "ISBN", description: book.isbn || "—" },
                { term: "出版年", description: book.publishedYear ? `${book.publishedYear}年` : "—" },
                {
                  term: "評価",
                  description:
                    book.rating === 0 ? "未評価" : <Rating value={book.rating} readOnly size="small" aria-label={`評価 ${book.rating}`} />,
                },
                {
                  term: "タグ",
                  description:
                    book.tags.length === 0 ? (
                      "—"
                    ) : (
                      <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                        {book.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Stack>
                    ),
                },
                { term: "メモ", description: book.memo || "—", multiline: true },
                { term: "登録日時", description: formatDateTime(book.createdAt) },
                { term: "更新日時", description: formatDateTime(book.updatedAt) },
              ]}
            />
          </CardContent>
        </Card>

        {/* ----- 貸出の履歴 ----- */}
        <Stack component="section" spacing={1.5} aria-labelledby="loan-history-title">
          <Typography id="loan-history-title" variant="h6" component="h2">
            貸出の履歴（{bookLoans.length}件）
          </Typography>
          <LoanHistoryTable loans={bookLoans} today={today} />
        </Stack>
      </Stack>
    </Container>
  );
};
