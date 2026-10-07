import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { notify } from "@/shared/ui";

const products = [
  { id: "A-001", name: "ボールペン", stock: 120 },
  { id: "A-002", name: "ノート", stock: 8 },
  { id: "A-003", name: "クリップ", stock: 0 },
  { id: "A-004", name: "付箋", stock: 45 },
];

// MUI の Table と Checkbox だけで書く形（DataTable の中身もこれと同じ）。
// 選択中の id の配列を useState で持ち、「全部選んでいるか」「一部だけか」は配列の長さから計算する
export default function SelectableTablePlain() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleAll = () => setSelectedIds(allSelected ? [] : products.map((p) => p.id));
  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      {/* 選択中だけ出る帯 */}
      {selectedIds.length > 0 && (
        <Toolbar variant="dense" sx={{ bgcolor: "action.selected" }}>
          <Typography sx={{ flexGrow: 1 }}>{selectedIds.length}件選択中</Typography>
          <Button size="small" variant="contained" onClick={() => notify(`${selectedIds.join("・")} を発注しました`, "info")}>
            まとめて発注
          </Button>
        </Toolbar>
      )}
      <TableContainer>
        <Table size="small" aria-label="商品一覧">
          <TableHead>
            <TableRow>
              {/* padding="checkbox"：チェックボックス用の狭い列 */}
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected} // 一部だけ選んでいるときの「−」
                  onChange={toggleAll}
                  slotProps={{ input: { "aria-label": "すべて選択" } }}
                />
              </TableCell>
              <TableCell>品番</TableCell>
              <TableCell>品名</TableCell>
              <TableCell align="right">在庫</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const selected = selectedIds.includes(product.id);
              return (
                // selected：選んだ行の背景色を変える
                <TableRow key={product.id} hover selected={selected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected}
                      onChange={() => toggle(product.id)}
                      slotProps={{ input: { "aria-label": `${product.name} を選択` } }}
                    />
                  </TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right" sx={{ color: product.stock === 0 ? "error.main" : undefined }}>
                    {product.stock}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label={`${product.name} を編集`} onClick={() => notify(`${product.name} の編集を開く`, "info")}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
