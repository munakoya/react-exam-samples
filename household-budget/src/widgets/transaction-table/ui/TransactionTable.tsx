import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { AmountText, categoryLabels, transactionTypeLabels, type Transaction } from "@/entities/transaction";
import { DeleteTransactionButton } from "@/features/delete-transaction";
import { formatDate } from "@/shared/lib";

/**
 * 収支の記録の表（編集・削除つき） ── widgets/transaction-table/ui
 *
 *   <TransactionTable transactions={visible} onEdit={dialog.openEdit} />
 *
 * 表示する記録（その月・絞り込み済み・並び替え済み）は外から受け取る。
 */

type TransactionTableProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
};

export const TransactionTable = ({ transactions, onEdit }: TransactionTableProps) => {
  return (
    // TableContainer：狭い画面では表だけを横スクロールさせる
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="収支の記録">
        <TableHead>
          <TableRow>
            <TableCell>日付</TableCell>
            <TableCell>種類</TableCell>
            <TableCell>カテゴリ</TableCell>
            <TableCell>メモ</TableCell>
            <TableCell align="right">金額</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} hover>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  variant="outlined"
                  label={transactionTypeLabels[transaction.type]}
                  color={transaction.type === "income" ? "success" : "error"}
                />
              </TableCell>
              <TableCell component="th" scope="row" sx={{ whiteSpace: "nowrap" }}>
                {categoryLabels[transaction.category]}
              </TableCell>
              <TableCell sx={{ minWidth: 120, color: "text.secondary" }}>{transaction.memo || "—"}</TableCell>
              <TableCell align="right">
                <AmountText type={transaction.type} amount={transaction.amount} />
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                <Tooltip title="編集">
                  <IconButton aria-label={`${formatDate(transaction.date)} ${categoryLabels[transaction.category]} を編集`} onClick={() => onEdit(transaction)}>
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <DeleteTransactionButton transaction={transaction} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
