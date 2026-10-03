import { Outlet } from "react-router";
import { AppShell, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠 ── app/layouts
 */

const navItems: AppShellNavItem[] = [
  { to: "/schedule", label: "スケジュール" },
  // /reservations/new なども「予約一覧」が選択中になる（URL の先頭が一致するため）
  { to: "/reservations", label: "予約一覧" },
];

export const RootLayout = () => {
  return (
    <AppShell title="会議室予約" navItems={navItems}>
      <Outlet />
    </AppShell>
  );
};
