import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState, type ReactNode } from "react";

/**
 * 列の定義を渡すだけで作れる表（チェックボックスで選択・行の操作ボタン・並び替え・ページ送り） ── shared/ui
 *
 * どれも「渡したときだけ」出る。表示するだけなら rows・columns・ariaLabel だけでよい。
 *
 *   const [selectedIds, setSelectedIds] = useState<string[]>([]);
 *
 *   <DataTable
 *     ariaLabel="ユーザー一覧"
 *     rows={users}
 *     columns={[
 *       { key: "name", label: "名前", render: (user) => user.name, sortValue: (user) => user.name },
 *       { key: "role", label: "権限", render: (user) => <UserRoleChip role={user.role} /> },
 *     ]}
 *     getRowLabel={(user) => user.name}                  // チェックボックスの読み上げ用
 *     selectedIds={selectedIds}                          // ← 渡すとチェックボックスの列が出る
 *     onSelectedIdsChange={setSelectedIds}
 *     selectionActions={(ids) => <Button onClick={() => removeMany(ids)}>削除</Button>}  // 選択中だけ上に出る
 *     rowActions={(user) => <IconButton onClick={() => onEdit(user)}><EditIcon /></IconButton>}  // 右端の列
 *     pageSize={10}                                      // ← 渡すとページ送りが出る
 *   />
 *
 * 選択中の id は親が持つ（一括削除のボタンなど、表の外でも使うため）。並び替え・ページの位置は表の中で持つ。
 * 見出しのチェックボックスは「rows のすべて」を選ぶ（ページ送りがあっても全ページ分）。
 */

export type DataTableColumn<T> = {
  /** 列の名前（key と並び替えの目印に使う） */
  key: string;
  /** 見出しの文言 */
  label: string;
  /** セルの中身 */
  render: (row: T) => ReactNode;
  /** 数値・金額は "right" */
  align?: "left" | "center" | "right";
  /** 並び替えに使う値。渡した列だけ、見出しを押して並び替えられる */
  sortValue?: (row: T) => string | number;
  /** 列の最小幅（狭い画面で文字が縦に潰れないように） */
  minWidth?: number;
};

type Order = "asc" | "desc";

type DataTableProps<T extends { id: string }> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  /** 表の名前（読み上げ用） */
  ariaLabel: string;
  /** 行の名前（「佐藤 を選択」のようにチェックボックスの読み上げに使う） */
  getRowLabel?: (row: T) => string;
  /** 選択中の行の id。渡すと先頭にチェックボックスの列が出る */
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  /** 1件以上選んでいるとき、表の上に出す操作（一括削除など） */
  selectionActions?: (selectedIds: string[]) => ReactNode;
  /** 行の右端に出す操作（編集・削除ボタンなど） */
  rowActions?: (row: T) => ReactNode;
  /** 最初に並び替える列と向き */
  defaultSort?: { key: string; order: Order };
  /** 1ページの行数。渡すとページ送りが出る */
  pageSize?: number;
};

// 文字は日本語の辞書順（localeCompare）、数値は大小で比べる
const compare = (a: string | number, b: string | number) =>
  typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), "ja");

export const DataTable = <T extends { id: string }>({
  rows,
  columns,
  ariaLabel,
  getRowLabel = (row) => row.id,
  selectedIds,
  onSelectedIdsChange,
  selectionActions,
  rowActions,
  defaultSort,
  pageSize,
}: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState(defaultSort?.key);
  const [order, setOrder] = useState<Order>(defaultSort?.order ?? "asc");
  const [page, setPage] = useState(0);

  const selectable = selectedIds !== undefined && onSelectedIdsChange !== undefined;
  // 絞り込み・削除で消えた行の id は数えない（rows にある行だけ）
  const selectedSet = new Set(selectedIds);
  const selectedRowIds = rows.filter((row) => selectedSet.has(row.id)).map((row) => row.id);
  const allSelected = rows.length > 0 && selectedRowIds.length === rows.length;
  const someSelected = selectedRowIds.length > 0 && !allSelected;

  // ----- 並び替え（toSorted：元の配列を変えずに新しい配列を返す） -----
  const sortColumn = columns.find((column) => column.key === sortKey);
  const sortedRows = sortColumn?.sortValue
    ? rows.toSorted((a, b) => {
        const result = compare(sortColumn.sortValue!(a), sortColumn.sortValue!(b));
        return order === "asc" ? result : -result;
      })
    : rows;

  // ----- ページ送り（行が減って今のページがなくなったら、最後のページを出す） -----
  const lastPage = pageSize ? Math.max(0, Math.ceil(rows.length / pageSize) - 1) : 0;
  const currentPage = Math.min(page, lastPage);
  const visibleRows = pageSize
    ? sortedRows.slice(currentPage * pageSize, currentPage * pageSize + pageSize)
    : sortedRows;

  const handleSort = (key: string) => {
    // 同じ列なら昇順・降順を入れ替え、別の列なら昇順から
    setOrder(sortKey === key && order === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const toggleAll = () => onSelectedIdsChange?.(allSelected ? [] : rows.map((row) => row.id));

  const toggleRow = (id: string) =>
    onSelectedIdsChange?.(
      selectedSet.has(id) ? selectedRowIds.filter((selectedId) => selectedId !== id) : [...selectedRowIds, id],
    );

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      {/* ----- 選択中だけ出る帯：「3件選択中  [一括削除]」 ----- */}
      {selectable && selectedRowIds.length > 0 && (
        <Toolbar variant="dense" sx={{ gap: 1, flexWrap: "wrap", bgcolor: "action.selected" }}>
          <Typography sx={{ flexGrow: 1 }} role="status">
            {selectedRowIds.length}件選択中
          </Typography>
          <Stack direction="row" spacing={1}>
            {selectionActions?.(selectedRowIds)}
          </Stack>
        </Toolbar>
      )}

      {/* TableContainer：狭い画面では表だけが横スクロールする */}
      <TableContainer>
        <Table size="small" aria-label={ariaLabel}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  {/* indeterminate：一部だけ選んでいるときの「−」の表示 */}
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    disabled={rows.length === 0}
                    slotProps={{ input: { "aria-label": "すべて選択" } }}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={{ minWidth: column.minWidth, fontWeight: 700 }}
                  // 並び替えている列には aria-sort が付く（読み上げで伝わる）
                  sortDirection={sortKey === column.key ? order : false}
                >
                  {column.sortValue ? (
                    <TableSortLabel
                      active={sortKey === column.key}
                      direction={sortKey === column.key ? order : "asc"}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {rowActions && (
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  操作
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => {
              const selected = selectedSet.has(row.id);
              return (
                // selected：選んだ行の背景色を変える。hover：マウスを乗せた行の色を変える
                <TableRow key={row.id} hover selected={selected}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected}
                        onChange={() => toggleRow(row.id)}
                        slotProps={{ input: { "aria-label": `${getRowLabel(row)} を選択` } }}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                  {rowActions && (
                    // 操作ボタンは折り返さない
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      {rowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {pageSize && (
        <TablePagination
          component="div"
          count={rows.length}
          page={currentPage}
          onPageChange={(_event, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[]} // 行数の切り替えは出さない
        />
      )}
    </Paper>
  );
};
