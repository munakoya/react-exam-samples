import { Outlet } from "react-router";
import { AppShell, type AppShellNavItem } from "@/shared/ui";
import { HeaderCartLink } from "@/widgets/header-cart-link";

/**
 * 全ページ共通の枠 ── app/layouts
 *
 * ヘッダーの右（headerRight）にカートへのリンクを置き、どのページからでもカートの個数が見えるようにする。
 */

const navItems: AppShellNavItem[] = [
  { to: "/products", label: "商品一覧" },
  { to: "/cart", label: "カート" },
  { to: "/orders", label: "注文履歴" },
];

export const RootLayout = () => {
  return (
    <AppShell title="ECショップ" navItems={navItems} headerRight={<HeaderCartLink />}>
      <Outlet />
    </AppShell>
  );
};
