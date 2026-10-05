import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useState } from "react";

type Member = { id: number; name: string; age: number; joinedAt: string };
type SortKey = "name" | "age" | "joinedAt";
type Order = "asc" | "desc";

const members: Member[] = [
  { id: 1, name: "佐藤", age: 34, joinedAt: "2021-04-01" },
  { id: 2, name: "鈴木", age: 28, joinedAt: "2023-10-01" },
  { id: 3, name: "高橋", age: 41, joinedAt: "2019-07-15" },
  { id: 4, name: "田中", age: 25, joinedAt: "2024-04-01" },
];

const columns: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "name", label: "名前" },
  { key: "age", label: "年齢", numeric: true },
  { key: "joinedAt", label: "入社日" },
];

// 見出しを押すと並び替える。TableSortLabel は矢印を出すだけなので、並び替えは自分で書く
export default function TableSort() {
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [order, setOrder] = useState<Order>("asc");

  const handleSort = (key: SortKey) => {
    // 同じ列なら昇順・降順を入れ替え、別の列なら昇順から
    setOrder(sortKey === key && order === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  // toSorted は元の配列を変えずに、並び替えた新しい配列を返す
  const sortedMembers = members.toSorted((a, b) => {
    const result = a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
    return order === "asc" ? result : -result;
  });

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="メンバー一覧">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.numeric ? "right" : "left"}
                // 並び替えている列には aria-sort を付ける（読み上げで伝わる）
                sortDirection={sortKey === column.key ? order : false}
              >
                <TableSortLabel
                  active={sortKey === column.key}
                  direction={sortKey === column.key ? order : "asc"}
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell align="right">{member.age}</TableCell>
              <TableCell>{member.joinedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
