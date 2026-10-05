import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { formatDate } from "@/shared/lib";
import { getLoanStatus, loanStatusLabels, type Loan } from "../model/loan";
import { DueDateLabel } from "./DueDateLabel";

/**
 * 1冊の本の貸出の履歴（表示だけ） ── entities/loan/ui
 *
 *   <LoanHistoryTable loans={loansOfThisBook} today={today} />
 *
 * 操作（返却ボタンなど）は持たない。返却は詳細ページの上の方で行う。
 */
export const LoanHistoryTable = ({ loans, today }: { loans: Loan[]; today: string }) => {
  if (loans.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        まだ貸出の記録はありません
      </Typography>
    );
  }

  return (
    // TableContainer：狭い画面では表だけを横スクロールさせる
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="貸出の履歴">
        <TableHead>
          <TableRow>
            <TableCell>借りた人</TableCell>
            <TableCell>貸出日</TableCell>
            <TableCell>返却期限</TableCell>
            <TableCell>返却日</TableCell>
            <TableCell>状態</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan) => {
            const status = getLoanStatus(loan, today);
            return (
              <TableRow key={loan.id}>
                <TableCell component="th" scope="row">
                  {loan.borrower}
                </TableCell>
                <TableCell>{formatDate(loan.loanedAt)}</TableCell>
                <TableCell>
                  <DueDateLabel loan={loan} today={today} />
                </TableCell>
                <TableCell>{loan.returnedAt ? formatDate(loan.returnedAt) : "—"}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={loanStatusLabels[status]}
                    color={status === "overdue" ? "error" : status === "active" ? "primary" : "default"}
                    variant={status === "returned" ? "outlined" : "filled"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
