import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router";
import { useBookStore } from "@/entities/book";
import { DueDateLabel, isActiveLoan, type Loan } from "@/entities/loan";
import { ReturnBookButton } from "@/features/return-book";
import { formatDate } from "@/shared/lib";

/**
 * 貸出の一覧表（本のタイトル・返却ボタンつき） ── widgets/loan-table/ui
 *
 * 貸出の記録には本の id しかないので、本の store からタイトルを探して表示する。
 * 本（entities/book）と貸出（entities/loan）の両方を使うので widgets に置く。
 *
 *   <LoanTable loans={overdueLoans} today={today} />
 */

type LoanTableProps = {
  loans: Loan[];
  today: string;
  emptyMessage?: string;
};

export const LoanTable = ({ loans, today, emptyMessage = "該当する貸出はありません" }: LoanTableProps) => {
  const books = useBookStore((state) => state.books);
  // 本の id → 本。行ごとに books.find するより速く、書き方も短くなる
  const bookMap = new Map(books.map((book) => [book.id, book]));

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="貸出の一覧">
        <TableHead>
          <TableRow>
            <TableCell>本</TableCell>
            <TableCell>借りた人</TableCell>
            <TableCell>貸出日</TableCell>
            <TableCell>返却期限</TableCell>
            <TableCell>返却日</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.length === 0 ? (
            // 0件のときは、表の中に1行だけ案内を出す（colSpan で全列をまとめる）
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            loans.map((loan) => {
              const book = bookMap.get(loan.bookId);
              const title = book?.title ?? "（削除された本）";
              return (
                <TableRow key={loan.id} hover>
                  <TableCell component="th" scope="row" sx={{ minWidth: 160 }}>
                    {book ? (
                      <Link component={RouterLink} to={`/books/${book.id}`} underline="hover">
                        {title}
                      </Link>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {title}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{loan.borrower}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(loan.loanedAt)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <DueDateLabel loan={loan} today={today} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {loan.returnedAt ? formatDate(loan.returnedAt) : "—"}
                  </TableCell>
                  <TableCell align="right">
                    {isActiveLoan(loan) && (
                      <ReturnBookButton loan={loan} bookTitle={title} size="small" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
