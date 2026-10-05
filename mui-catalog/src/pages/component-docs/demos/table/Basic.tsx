import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const items = [
  { id: "A-001", name: "ボールペン", quantity: 120, price: 110 },
  { id: "A-002", name: "ノート", quantity: 8, price: 180 },
  { id: "A-003", name: "クリップ", quantity: 0, price: 220 },
];

// HTML の表と同じ形（Table > TableHead / TableBody > TableRow > TableCell）。
// TableContainer で包むと、狭い画面では表だけが横スクロールする
export default function TableBasic() {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="在庫一覧">
        <TableHead>
          <TableRow>
            <TableCell>品番</TableCell>
            <TableCell>品名</TableCell>
            {/* 数値の列は align="right" で右寄せにする */}
            <TableCell align="right">在庫数</TableCell>
            <TableCell align="right">単価</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            // hover：マウスを乗せた行の色を変える
            <TableRow key={item.id} hover>
              <TableCell>{item.id}</TableCell>
              {/* 行の見出しになる列は component="th" scope="row" にする */}
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="right" sx={{ color: item.quantity === 0 ? "error.main" : undefined }}>
                {item.quantity}
              </TableCell>
              <TableCell align="right">{item.price.toLocaleString()}円</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
