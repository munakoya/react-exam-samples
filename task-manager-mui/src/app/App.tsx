import { Navigate, Route, Routes } from "react-router";
import { NotFoundPage } from "@/pages/not-found";
import { TaskBoardPage } from "@/pages/task-board";
import { TaskListPage } from "@/pages/task-list";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /        → /tasks へ移動
 *   /tasks   → 一覧（集計・絞り込み・並び替え。追加・編集はダイアログ）
 *   /board   → かんばんボード
 *   それ以外 → 404
 */
export const App = () => {
  return (
    <Routes>
      {/* path のない Route ＝「レイアウトルート」。子のページを RootLayout の <Outlet /> に表示する */}
      <Route element={<RootLayout />}>
        {/* replace：「戻る」で / に戻って、また /tasks へ飛ばされるのを防ぐ */}
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/board" element={<TaskBoardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
