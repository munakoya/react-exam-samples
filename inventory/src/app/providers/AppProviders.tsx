import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { ToastProvider } from "@/shared/ui";

/**
 * アプリ全体を包む Provider をまとめたもの ── app/providers
 *
 * main.tsx では <AppProviders><App /></AppProviders> と書くだけでよい。
 *
 *   BrowserRouter … URL とページを対応させる（useNavigate・<Link> などはこの中でしか使えない）
 *   ToastProvider … 画面の隅に出る通知の置き場所（useToast().show() はこの中でしか使えない）
 *
 * Zustand の store は Provider が要らない（どこからでも useXxxStore を呼べる）。
 */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    /*
     * useTransitions={false}：ページの移動（URL の変更）を、すぐに画面へ反映させる。
     *
     * 初期設定の React Router は、ページの移動を少し遅らせて反映する（React の startTransition）。
     * 一方 Zustand の更新はすぐに反映されるので、次のような順番のずれが起きる。
     *   navigate("/orders/1/complete"); clearCart();
     *   → カートが空になった購入ページが先に描画され、「カートが空なら /cart へ戻す」が動いてしまう
     * false にすると、移動と store の更新が同じタイミングで反映され、書いた順に動く。
     */
    <BrowserRouter useTransitions={false}>
      <ToastProvider>{children}</ToastProvider>
    </BrowserRouter>
  );
};
