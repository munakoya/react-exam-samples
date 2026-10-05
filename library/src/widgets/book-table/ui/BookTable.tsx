import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router";
import { BookAvatar, bookGenreLabels, type Book } from "@/entities/book";
import { AvailabilityChip, DueDateLabel, getAvailability, type Loan } from "@/entities/loan";
import type { BookSortKey, SortOrder } from "@/features/book-filter";
import { DeleteBookButton } from "@/features/delete-book";
import { LendBookButton } from "@/features/lend-book";
import { ReturnBookButton } from "@/features/return-book";
import { formatDateTime } from "@/shared/lib";

/**
 * 本の一覧表（並び替えの見出し・ページ送り・行の操作つき） ── widgets/book-table/ui
 *
 * widgets には、entities（本・貸出の表示）と features（貸出・返却・削除の操作）を組み合わせた
 * 「大きめの UI のかたまり」を置く。features 同士は import し合えないので、ここで組み合わせる。
 *
 * 表示する本（今のページの分）・並び順・ページは外（ページ）から受け取る。
 * この部品は「見せる」と「押されたことを伝える」だけで、条件は持たない。
 */

type BookTableProps = {
  /** 今のページに表示する本（絞り込み・並び替え・切り出し済み） */
  books: Book[];
  /** 本の id → 今の貸出 */
  currentLoans: Map<string, Loan>;
  today: string;
  sort: BookSortKey;
  order: SortOrder;
  onSortChange: (sort: BookSortKey) => void;
  /** 絞り込み後の全件数（ページ送りの「全 N 件」に使う） */
  count: number;
  /** 今のページ（1 から数える） */
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
};

// 並び替えできる列の見出し
const SortableHeader = ({
  label,
  sortKey,
  sort,
  order,
  onSortChange,
  align,
}: {
  label: string;
  sortKey: BookSortKey;
  sort: BookSortKey;
  order: SortOrder;
  onSortChange: (sort: BookSortKey) => void;
  align?: "left" | "right";
}) => {
  const active = sort === sortKey;
  return (
    // sortDirection：並び替え中の列に aria-sort が付き、読み上げで伝わる
    <TableCell align={align} sortDirection={active ? order : false}>
      <TableSortLabel
        active={active}
        direction={active ? order : "asc"}
        onClick={() => onSortChange(sortKey)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};

export const BookTable = ({
  books,
  currentLoans,
  today,
  sort,
  order,
  onSortChange,
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
}: BookTableProps) => {
  const sortProps = { sort, order, onSortChange };

  return (
    <Paper variant="outlined">
      {/* TableContainer：狭い画面では表だけを横スクロールさせる */}
      <TableContainer>
        <Table size="small" aria-label="本の一覧">
          <TableHead>
            <TableRow>
              <SortableHeader label="タイトル" sortKey="title" {...sortProps} />
              <TableCell>ジャンル</TableCell>
              <SortableHeader label="評価" sortKey="rating" {...sortProps} />
              <TableCell>状態</TableCell>
              <TableCell>返却期限</TableCell>
              <SortableHeader label="登録日時" sortKey="createdAt" {...sortProps} />
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => {
              const loan = currentLoans.get(book.id);
              return (
                // hover：マウスを乗せた行の色を変える
                <TableRow key={book.id} hover>
                  {/* 行の見出しになる列は component="th" scope="row" にする */}
                  <TableCell component="th" scope="row">
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 220 }}>
                      <BookAvatar book={book} size={32} />
                      <Box sx={{ minWidth: 0 }}>
                        {/* component={RouterLink}：ページを再読み込みせずに詳細ページへ移動する */}
                        <Link component={RouterLink} to={`/books/${book.id}`} underline="hover" sx={{ fontWeight: 600 }}>
                          {book.title}
                        </Link>
                        <Typography variant="caption" color="text.secondary" component="p">
                          {book.author}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{bookGenreLabels[book.genre]}</TableCell>
                  <TableCell>
                    {book.rating === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        未評価
                      </Typography>
                    ) : (
                      // readOnly：表示だけ。aria-label で数値も伝える
                      <Rating value={book.rating} readOnly size="small" aria-label={`評価 ${book.rating}`} />
                    )}
                  </TableCell>
                  <TableCell>
                    <AvailabilityChip availability={getAvailability(loan, today)} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {loan ? <DueDateLabel loan={loan} today={today} /> : "—"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDateTime(book.createdAt)}</TableCell>
                  {/* nowrap：ボタンの文字が2行に折り返さないようにする（狭い画面は表ごと横スクロール） */}
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                      {/* 今の貸出があれば「返却」、なければ「貸し出す」 */}
                      {loan ? (
                        <ReturnBookButton loan={loan} bookTitle={book.title} size="small" />
                      ) : (
                        <LendBookButton book={book} size="small" />
                      )}
                      <Tooltip title="編集">
                        <IconButton
                          component={RouterLink}
                          to={`/books/${book.id}/edit`}
                          aria-label={`「${book.title}」を編集`}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <DeleteBookButton book={book} variant="icon" />
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/*
        TablePagination の page は 0 から数える。このアプリの page は 1 からなので ±1 する。
        文言（「1ページの行数」など）は theme に jaJP を渡しているので日本語になる
      */}
      <TablePagination
        component="div"
        count={count}
        page={page - 1}
        onPageChange={(_event, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
      />
    </Paper>
  );
};
