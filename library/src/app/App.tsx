import { Route, Routes } from "react-router";
import { BookDetailPage } from "@/pages/book-detail";
import { BookEditPage } from "@/pages/book-edit";
import { BookListPage } from "@/pages/book-list";
import { BookNewPage } from "@/pages/book-new";
import { DashboardPage } from "@/pages/dashboard";
import { LoanListPage } from "@/pages/loan-list";
import { NotFoundPage } from "@/pages/not-found";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /                    → ダッシュボード
 *   /books               → 本の一覧（?q=…&genre=…&status=…&sort=…&page=… で絞り込み・並び替え）
 *   /books/new           → 本を登録
 *   /books/:bookId       → 本の詳細（:bookId はページの中で useParams() で取り出す）
 *   /books/:bookId/edit  → 本を編集
 *   /loans               → 貸出一覧（?tab=overdue でタブ）
 *   それ以外             → 404
 *
 * "new" のような決まった文字の path は、:bookId（何でも一致）より優先される。書く順番は関係ない。
 * ページを増やしたら、ここに <Route> を足し、メニューに出すなら RootLayout.tsx の navItems にも足す。
 */
export const App = () => {
  return (
    <Routes>
      {/* path のない Route ＝「レイアウトルート」。子のページを RootLayout の <Outlet /> に表示する */}
      <Route element={<RootLayout />}>
        {/* index：親と同じ URL（/）のときに表示する */}
        <Route index element={<DashboardPage />} />

        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/new" element={<BookNewPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/books/:bookId/edit" element={<BookEditPage />} />
        <Route path="/loans" element={<LoanListPage />} />

        {/* * はどれにも一致しなかった URL。最後の受け皿 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
