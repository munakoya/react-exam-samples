import { useState } from "react";
import { Outlet } from "react-router";
import { AppShell, Header, Sidebar, type SidebarNavItem } from "@/shared/ui";

/**
 * カタログ全体の枠。AppShell・Header・Sidebar の見本も兼ねている
 */

const navItems: SidebarNavItem[] = [
  { to: "/", label: "部品の一覧", end: true },
  { to: "/inputs", label: "入力" },
  { to: "/display", label: "表示" },
  { to: "/navigation", label: "ナビゲーション" },
  { to: "/feedback", label: "フィードバック・ダイアログ" },
  { to: "/form", label: "フォームの組み立て例" },
];

export const RootLayout = () => {
  // ☰ で開閉するメニューの状態。Header と Sidebar の両方で使うので、ここで持つ
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppShell
      header={
        <Header
          title="UI 部品カタログ"
          homeTo="/"
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((prev) => !prev)}
        />
      }
      sidebar={
        <Sidebar
          navItems={navItems}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          footer={<small>部品の元：samples/_shared/ui</small>}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
};
