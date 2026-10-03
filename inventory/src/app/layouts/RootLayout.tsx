import { Outlet } from "react-router";
import { AppShell, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドメニュー） ── app/layouts
 *
 * App.tsx の「レイアウトルート」（path のない <Route element={<RootLayout />}>）に使う。
 * 子のルートのページが、<Outlet /> の位置に表示される。
 *
 *   ┌──────────────────────┐
 *   │ ☰ 在庫管理               │
 *   ├──────┬───────────────┤
 *   │メニュー│ <Outlet />       │ ← /items なら ItemListPage が入る
 *   └──────┴───────────────┘
 */

// 中の NavLink は、今の URL の先頭が to と一致するリンクを選択中の色にする。
// "/items" は /items/new・/items/abc でも選択中になるので、同じ機能のページは1つにまとめて載せる。
const navItems: AppShellNavItem[] = [{ to: "/items", label: "商品一覧" }];

export const RootLayout = () => {
  return (
    <AppShell title="在庫管理" navItems={navItems}>
      <Outlet />
    </AppShell>
  );
};
