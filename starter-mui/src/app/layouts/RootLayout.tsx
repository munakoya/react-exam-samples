import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Outlet } from "react-router";
import { AppShell, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドメニュー。スマホは ☰ で開閉） ── app/layouts
 *
 * App.tsx の「レイアウトルート」に使う。子のページが <Outlet /> の位置に表示される。
 *
 * TODO: title をアプリ名に、navItems をメニューにしたいページに変える。
 *   { to: "/items", label: "商品一覧", icon: <Inventory2OutlinedIcon /> }
 *   { to: "/", label: "ダッシュボード", icon: <DashboardOutlinedIcon />, end: true }  // "/" は end を付ける
 * アイコンは https://mui.com/material-ui/material-icons/ で探す（import XxxIcon from "@mui/icons-material/Xxx"）。
 */

const navItems: AppShellNavItem[] = [{ to: "/", label: "トップ", icon: <HomeOutlinedIcon />, end: true }];

export const RootLayout = () => {
  return (
    <AppShell title="アプリ名" navItems={navItems}>
      <Outlet />
    </AppShell>
  );
};
