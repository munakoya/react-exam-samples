import { Navigate, Route, Routes } from "react-router";
import { NotFoundPage } from "@/pages/not-found";
import { TaskBoardPage } from "@/pages/task-board";
import { TaskListPage } from "@/pages/task-list";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /        → /tasks へ移動
 *   /tasks   → 一覧（追加・編集はモーダル）
 *   /board   → かんばんボード
 *   それ以外 → 404
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/board" element={<TaskBoardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
