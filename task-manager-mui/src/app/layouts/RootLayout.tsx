import ChecklistIcon from "@mui/icons-material/Checklist";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import { Outlet } from "react-router";
import { AppShell, SamplesTopLink, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドメニュー） ── app/layouts
 *
 * App.tsx の「レイアウトルート」に使う。子のページが <Outlet /> の位置に表示される。
 */

const navItems: AppShellNavItem[] = [
  { to: "/tasks", label: "タスク一覧", icon: <ChecklistIcon /> },
  { to: "/board", label: "ボード", icon: <ViewKanbanOutlinedIcon /> },
];

export const RootLayout = () => {
  return (
    // headerRight：公開ページだけに出る「← サンプル集」
    <AppShell title="タスク管理" navItems={navItems} homeTo="/tasks" headerRight={<SamplesTopLink />}>
      <Outlet />
    </AppShell>
  );
};
