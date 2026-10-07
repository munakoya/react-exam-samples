import { Route, Routes } from "react-router";
import { ComponentDocPage, OverviewPage, PatternPage, ThemePage } from "@/pages/component-docs";
import { NotFoundPage } from "@/pages/not-found";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /         → はじめに（部品を探す・使い始め方・v9 の注意点）
 *   /theme    → テーマと sx
 *   /patterns/add-dialog → 画面パターン（CRUD）1つ分のページ
 *   /button   → 部品1つ分のページ（:slug = "button"）
 *   /a/b など → 404
 *
 * "theme" のような決まった path は、:slug より優先される。
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="/theme" element={<ThemePage />} />
        <Route path="/patterns/:slug" element={<PatternPage />} />
        <Route path="/:slug" element={<ComponentDocPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
