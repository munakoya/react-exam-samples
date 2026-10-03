import { useState } from "react";
import { Outlet } from "react-router";
import { AppShell, Header, Sidebar, type SidebarNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドバー） ── app/layouts
 *
 * App.tsx の「レイアウトルート」（path のない <Route element={<RootLayout />}>）に使う。
 * 子のルートのページが、<Outlet /> の位置に表示される。
 *
 *   ┌──────────────────────┐
 *   │ ☰ 在庫管理    （Header）   │
 *   ├──────┬───────────────┤
 *   │Sidebar │ <Outlet />       │ ← /items なら ItemListPage が入る
 *   └──────┴───────────────┘
 */

const navItems: SidebarNavItem[] = [
  // end: true … /items のときだけ選択中にする（付けないと /items/new でも選択中になる）
  { to: "/items", label: "商品一覧", end: true },
  { to: "/items/new", label: "新規登録" },
];

export const RootLayout = () => {
  // 狭い幅で ☰ を押したときに開くメニューの状態。
  // Header（☰ ボタン）と Sidebar（メニュー）の両方で使うので、共通の親であるここで持つ
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppShell
      header={
        <Header
          title="在庫管理"
          homeTo="/"
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((prev) => !prev)}
        />
      }
      sidebar={<Sidebar navItems={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />}
    >
      <Outlet />
    </AppShell>
  );
};
