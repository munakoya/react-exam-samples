import { useState } from "react";
import { Outlet } from "react-router";
import { AppShell, Header, SamplesTopLink, Sidebar, type SidebarNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ サイドバー） ── app/layouts
 *
 * App.tsx のレイアウトルートに使い、子のページを <Outlet /> の位置に表示する。
 */

const navItems: SidebarNavItem[] = [
  { to: "/tasks", label: "タスク一覧" },
  { to: "/board", label: "ボード" },
];

export const RootLayout = () => {
  // ☰ で開閉するメニューの状態。Header と Sidebar の両方で使うので、ここで持つ
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppShell
      header={
        <Header
          title="タスク管理"
          homeTo="/"
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((prev) => !prev)}
          right={<SamplesTopLink />} // 公開ページだけに出る「← サンプル集」
        />
      }
      sidebar={<Sidebar navItems={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />}
    >
      <Outlet />
    </AppShell>
  );
};
