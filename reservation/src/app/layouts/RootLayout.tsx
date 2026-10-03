import { useState } from "react";
import { Outlet } from "react-router";
import { AppShell, Header, Sidebar, type SidebarNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠 ── app/layouts
 */

const navItems: SidebarNavItem[] = [
  { to: "/schedule", label: "スケジュール" },
  // end: true … /reservations のときだけ選択中にする（付けないと /reservations/new でも選択中になる）
  { to: "/reservations", label: "予約一覧", end: true },
  { to: "/reservations/new", label: "新規予約" },
];

export const RootLayout = () => {
  // ☰ で開閉するメニューの状態。Header と Sidebar の両方で使うので、ここで持つ
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppShell
      header={
        <Header
          title="会議室予約"
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
