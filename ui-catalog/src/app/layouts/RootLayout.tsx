import { useState } from "react";
import { Outlet } from "react-router";
import { categories, componentDocs } from "@/pages/ui-docs";
import {
  AppShell,
  Container,
  Header,
  Sidebar,
  type SidebarGroup,
  type SidebarNavItem,
} from "@/shared/ui";

/**
 * カタログ全体の枠（AppShell ＋ Header ＋ Sidebar の見本も兼ねている）
 *
 * サイドバーは、部品の一覧（componentDocs）から分類ごとのグループを作る。
 * 部品を componentDocs に足すと、メニューにも自動で出る。
 */

const navItems: SidebarNavItem[] = [
  { to: "/", label: "部品を探す", end: true },
  { to: "/tokens", label: "デザイントークン" },
  { to: "/form", label: "フォームの組み立て例" },
];

const groups: SidebarGroup[] = categories.map((category) => ({
  title: category,
  items: componentDocs
    .filter((doc) => doc.category === category)
    .map((doc) => ({ to: `/${doc.slug}`, label: doc.name })),
}));

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
          groups={groups}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
};

/** ドキュメントのページを、最大幅 1200px・中央寄せの枠に入れるレイアウトルート */
export const DocsContainer = () => (
  <Container size="lg">
    <Outlet />
  </Container>
);
