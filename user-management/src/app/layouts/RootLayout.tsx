import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { Outlet } from "react-router";
import { AppShell, SamplesTopLink, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドメニュー） ── app/layouts
 *
 * App.tsx の「レイアウトルート」に使う。子のページが <Outlet /> の位置に表示される。
 */

const navItems: AppShellNavItem[] = [{ to: "/users", label: "ユーザー一覧", icon: <PeopleOutlinedIcon /> }];

export const RootLayout = () => {
  return (
    // headerRight：公開ページだけに出る「← サンプル集」
    <AppShell title="ユーザー管理" navItems={navItems} homeTo="/users" headerRight={<SamplesTopLink />}>
      <Outlet />
    </AppShell>
  );
};
