import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router";
import { useBookStore } from "@/entities/book";
import { getCurrentLoanMap, useLoanStore } from "@/entities/loan";
import {
  BookFilterBar,
  defaultSortOrders,
  filterBooks,
  ROWS_PER_PAGE_OPTIONS,
  sortBooks,
  useBookFilter,
  type BookSortKey,
} from "@/features/book-filter";
import { todayString } from "@/shared/lib";
import { EmptyState, PageHeader } from "@/shared/ui";
import { BookTable } from "@/widgets/book-table";

/**
 * 本の一覧ページ（/books） ── pages/book-list/ui
 *
 * pages は URL 1つ分の画面。下の層を組み合わせるだけにして、細かい処理は下の層に任せる。
 *
 * 表示する本は、すべて「計算」で求める（state にしない）:
 *   全部の本 → 絞り込み（filterBooks）→ 並び替え（sortBooks）→ 今のページの分を切り出す（slice）
 * 条件は URL（?q=…&genre=…&page=…）にあり、useBookFilter で読み書きする。
 */
export const BookListPage = () => {
  // store から一覧を選ぶ。絞り込みはセレクターの中ではなく、下で行う
  const books = useBookStore((state) => state.books);
  const loans = useLoanStore((state) => state.loans);
  const { filter, updateFilter, resetFilter } = useBookFilter();
  const today = todayString();

  // ----- 表示する本を計算する -----
  const currentLoans = getCurrentLoanMap(loans); // 本の id → 今の貸出
  const filteredBooks = filterBooks(books, currentLoans, filter, today);
  const sortedBooks = sortBooks(filteredBooks, filter.sort, filter.order);

  // 本を消して件数が減ったときなど、ページが範囲外になったら最後のページにする
  const pageCount = Math.max(1, Math.ceil(sortedBooks.length / filter.perPage));
  const page = Math.min(filter.page, pageCount);
  const pageBooks = sortedBooks.slice((page - 1) * filter.perPage, page * filter.perPage);

  // 同じ列ならの向きを入れ替え、別の列ならその列の初めの向きで並べる
  const handleSortChange = (sort: BookSortKey) =>
    updateFilter({
      sort,
      order:
        sort === filter.sort ? (filter.order === "asc" ? "desc" : "asc") : defaultSortOrders[sort],
    });

  const addButton = (
    // component={RouterLink}：ボタンの見た目のリンク（押すとページを移動する）
    <Button component={RouterLink} to="/books/new" variant="contained" startIcon={<AddIcon />}>
      本を登録
    </Button>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title="本の一覧"
          description={`全${books.length}冊・貸出中${currentLoans.size}冊`}
          action={addButton}
        />

        {books.length === 0 ? (
          // ----- 1冊もないとき：一覧の代わりに案内を出す -----
          <EmptyState title="まだ本がありません" description="「本を登録」から追加してください。" action={addButton} />
        ) : (
          <>
            {/* ----- 絞り込み ----- */}
            <BookFilterBar filter={filter} onChange={updateFilter} onReset={resetFilter} />

            <Typography variant="body2" color="text.secondary" aria-live="polite">
              {filteredBooks.length}件 / 全{books.length}件
            </Typography>

            {/* ----- 一覧 ----- */}
            {filteredBooks.length === 0 ? (
              <EmptyState
                title="条件に合う本がありません"
                description="キーワードや絞り込みの条件を変えてください。"
                action={<Button onClick={resetFilter}>条件をクリア</Button>}
              />
            ) : (
              <BookTable
                books={pageBooks}
                currentLoans={currentLoans}
                today={today}
                sort={filter.sort}
                order={filter.order}
                onSortChange={handleSortChange}
                count={sortedBooks.length}
                page={page}
                rowsPerPage={filter.perPage}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                onPageChange={(nextPage) => updateFilter({ page: nextPage })}
                onRowsPerPageChange={(perPage) => updateFilter({ perPage })}
              />
            )}
          </>
        )}
      </Stack>
    </Container>
  );
};
