import { Navigate, Route, Routes } from "react-router";
import { NotFoundPage } from "@/pages/not-found";
import { UserDetailPage } from "@/pages/user-detail";
import { UserListPage } from "@/pages/user-list";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /            → /users へ移動
 *   /users       → 一覧（表・カード。追加・編集はダイアログ、削除は確認ダイアログ）
 *   /users/:id   → 詳細
 *   それ以外     → 404
 */
export const App = () => {
  return (
    <Routes>
      {/* path のない Route ＝「レイアウトルート」。子のページを RootLayout の <Outlet /> に表示する */}
      <Route element={<RootLayout />}>
        {/* replace：「戻る」で / に戻って、また /users へ飛ばされるのを防ぐ */}
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
