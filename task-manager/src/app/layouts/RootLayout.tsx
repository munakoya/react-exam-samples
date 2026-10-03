import { Outlet } from "react-router";
import { AppShell, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドメニュー） ── app/layouts
 *
 * App.tsx のレイアウトルートに使い、子のページを <Outlet /> の位置に表示する。
 */

const navItems: AppShellNavItem[] = [
  { to: "/tasks", label: "タスク一覧" },
  { to: "/board", label: "ボード" },
];

export const RootLayout = () => {
  return (
    <AppShell title="タスク管理" navItems={navItems}>
      <Outlet />
    </AppShell>
  );
};
