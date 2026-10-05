import { useState } from "react";
import { Outlet } from "react-router";
import { AppShell, Header, SamplesTopLink, Sidebar, type SidebarNavItem } from "@/shared/ui";
import { HeaderCartLink } from "@/widgets/header-cart-link";

/**
 * 全ページ共通の枠 ── app/layouts
 *
 * ヘッダーの右（right）にカートへのリンクを置き、どのページからでもカートの個数が見えるようにする。
 */

const navItems: SidebarNavItem[] = [
  { to: "/products", label: "商品一覧" },
  { to: "/cart", label: "カート" },
  { to: "/orders", label: "注文履歴" },
];

export const RootLayout = () => {
  // ☰ で開閉するメニューの状態。Header と Sidebar の両方で使うので、ここで持つ
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppShell
      header={
        <Header
          title="ECショップ"
          homeTo="/"
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((prev) => !prev)}
          right={
            <>
              <SamplesTopLink /> {/* 公開ページだけに出る「← サンプル集」 */}
              <HeaderCartLink />
            </>
          }
        />
      }
      sidebar={<Sidebar navItems={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />}
    >
      <Outlet />
    </AppShell>
  );
};
