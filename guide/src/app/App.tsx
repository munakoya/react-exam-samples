import { Route, Routes } from "react-router";
import { DocPage } from "@/pages/doc";
import { HomePage } from "@/pages/home";
import { SearchPage } from "@/pages/search";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /                        → トップ（検索・よく見るところ・読みものの一覧）
 *   /search?q=…              → 検索
 *   /library                 → 本の目次（README.md）
 *   /library/03-modern-js    → 章（library/docs/03-modern-js.md）
 *
 * 見つからない本・章は DocPage が「見つかりません」を出す。
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:bookId" element={<DocPage />} />
        <Route path="/:bookId/:slug" element={<DocPage />} />
        <Route path="*" element={<DocPage />} />
      </Route>
    </Routes>
  );
};
