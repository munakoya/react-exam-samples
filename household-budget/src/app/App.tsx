import { Route, Routes } from "react-router";
import { BudgetBookPage } from "@/pages/budget-book";
import { NotFoundPage } from "@/pages/not-found";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /                 → 家計簿（今月）
 *   /?month=2026-09   → 家計簿（その月。ページの中で useSearchParams で読む）
 *   それ以外          → 404
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<BudgetBookPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
