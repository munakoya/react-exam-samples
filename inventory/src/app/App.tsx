import { Navigate, Route, Routes } from "react-router";
import { ItemDetailPage } from "@/pages/item-detail";
import { ItemEditPage } from "@/pages/item-edit";
import { ItemListPage } from "@/pages/item-list";
import { ItemNewPage } from "@/pages/item-new";
import { NotFoundPage } from "@/pages/not-found";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /                    → /items へ移動
 *   /items               → 一覧
 *   /items/new           → 新規登録
 *   /items/:itemId       → 詳細（:itemId はページの中で useParams() で取り出す）
 *   /items/:itemId/edit  → 編集
 *   それ以外             → 404
 *
 * "new" のような決まった文字の path は、:itemId（何でも一致）より優先される。書く順番は関係ない。
 * ページを増やしたら、ここに <Route> を足し、メニューに出すなら RootLayout.tsx の navItems にも足す。
 */
export const App = () => {
  return (
    <Routes>
      {/* path のない Route ＝「レイアウトルート」。子のページを RootLayout の <Outlet /> に表示する */}
      <Route element={<RootLayout />}>
        {/* index：親と同じ URL（/）のときに表示する。replace で、戻るボタンで / に戻らないようにする */}
        <Route index element={<Navigate to="/items" replace />} />

        <Route path="/items" element={<ItemListPage />} />
        <Route path="/items/new" element={<ItemNewPage />} />
        <Route path="/items/:itemId" element={<ItemDetailPage />} />
        <Route path="/items/:itemId/edit" element={<ItemEditPage />} />

        {/* * はどれにも一致しなかった URL。最後の受け皿 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
