import { Route, Routes } from "react-router";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /        → トップ（雛形の案内。一覧ページを作ったら置き換える）
 *   それ以外 → 404
 *
 * TODO: ページを作ったらここに足す。よくある形（一覧・詳細・登録・編集）:
 *
 *   <Route index element={<Navigate to="/items" replace />} />   // トップを一覧へ飛ばす（import { Navigate }）
 *   <Route path="/items" element={<ItemListPage />} />           // 一覧（追加・編集をダイアログでやるならこれだけ）
 *   <Route path="/items/new" element={<ItemNewPage />} />        // 登録をページでやるとき
 *   <Route path="/items/:id" element={<ItemDetailPage />} />     // 詳細（useParams で id を受け取る）
 *   <Route path="/items/:id/edit" element={<ItemEditPage />} />  // 編集をページでやるとき
 *
 * "new" のような決まった path は、":id" より優先される（書く順番は関係ない）。
 */
export const App = () => {
  return (
    <Routes>
      {/* path のない Route ＝「レイアウトルート」。子のページを RootLayout の <Outlet /> に表示する */}
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
