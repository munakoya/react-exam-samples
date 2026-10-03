import { Route, Routes } from "react-router";
import { FormDemoPage } from "@/pages/form-demo";
import { ComponentDocPage, TokensPage, UiOverviewPage } from "@/pages/ui-docs";
import { DocsContainer, RootLayout } from "./layouts/RootLayout";

/**
 * UI 部品カタログのルーティング
 *
 *   /         部品を探す（検索・一覧・使い始め方）
 *   /tokens   デザイントークン（tokens.css の一覧）
 *   /form     React Hook Form ＋ zod で部品を組み合わせた例
 *   /:slug    部品1つ分のページ（/button など）。決まった path（tokens・form）が優先される
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/form" element={<FormDemoPage />} />
        <Route element={<DocsContainer />}>
          <Route index element={<UiOverviewPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/:slug" element={<ComponentDocPage />} />
          {/* どれにも一致しない URL（/a/b など）も「部品が見つかりません」にする */}
          <Route path="*" element={<ComponentDocPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
