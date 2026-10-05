import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Outlet } from "react-router";
import { AppShell, SamplesTopLink, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドメニュー） ── app/layouts
 *
 * App.tsx の「レイアウトルート」（path のない <Route element={<RootLayout />}>）に使う。
 * 子のルートのページが、<Outlet /> の位置に表示される。
 *
 *   ┌──────────────────────────┐
 *   │ ☰ 蔵書管理        （AppBar）  │
 *   ├────────┬─────────────────┤
 *   │ Drawer │ <Outlet />        │ ← /books なら BookListPage が入る
 *   └────────┴─────────────────┘
 */

const navItems: AppShellNavItem[] = [
  // end: true … その URL のときだけ選択中にする（付けないと /books/new でも「本の一覧」が選択中になる）
  { to: "/", label: "ダッシュボード", icon: <DashboardOutlinedIcon />, end: true },
  { to: "/books", label: "本の一覧", icon: <LibraryBooksOutlinedIcon />, end: true },
  { to: "/books/new", label: "本を登録", icon: <LibraryAddOutlinedIcon /> },
  { to: "/loans", label: "貸出一覧", icon: <SwapHorizIcon /> },
];

export const RootLayout = () => {
  return (
    // headerRight：公開ページだけに出る「← サンプル集」
    <AppShell title="蔵書管理" navItems={navItems} headerRight={<SamplesTopLink />}>
      <Outlet />
    </AppShell>
  );
};
