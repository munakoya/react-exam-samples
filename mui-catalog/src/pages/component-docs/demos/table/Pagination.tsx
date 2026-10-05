import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";

const orders = Array.from({ length: 32 }, (_, index) => ({
  id: `ORD-${String(index + 1).padStart(3, "0")}`,
  total: ((index * 37) % 10 + 1) * 1000,
}));

// 表の下のページ送り。page は 0 から数える（Pagination の 1 からとは違うので注意）
export default function TablePaginationDemo() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const visibleOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small" aria-label="注文一覧">
          <TableHead>
            <TableRow>
              <TableCell>注文番号</TableCell>
              <TableCell align="right">合計</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell align="right">{order.total.toLocaleString()}円</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={orders.length} // 全件数
        page={page}
        onPageChange={(_event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0); // 行数を変えたら最初のページへ戻す
        }}
        // 表示の文言を日本語にする（theme に jaJP を入れても変わる）
        labelRowsPerPage="表示件数"
        labelDisplayedRows={({ from, to, count }) => `${from}〜${to}件 / 全${count}件`}
      />
    </Paper>
  );
}
