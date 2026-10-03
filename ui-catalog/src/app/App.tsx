import { Route, Routes } from "react-router";
import { DisplayPage } from "@/pages/display";
import { FeedbackPage } from "@/pages/feedback";
import { FormDemoPage } from "@/pages/form-demo";
import { HomePage } from "@/pages/home";
import { InputsPage } from "@/pages/inputs";
import { NavigationPage } from "@/pages/navigation";
import { NotFoundPage } from "@/pages/not-found";
import { RootLayout } from "./layouts/RootLayout";

/**
 * UI 部品カタログのルーティング
 *
 *   /            部品の一覧（どのお題で使うか）
 *   /inputs      入力
 *   /display     表示
 *   /navigation  ナビゲーション
 *   /feedback    フィードバック・ダイアログ
 *   /form        React Hook Form ＋ zod で部品を組み合わせた例
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/inputs" element={<InputsPage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/form" element={<FormDemoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
