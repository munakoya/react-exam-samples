import { useState } from "react";
import { AppShell, Button, Header, PageHeader, Sidebar, Stack } from "@/shared/ui";

const navItems = [
  { to: "/app-shell", label: "ダッシュボード" },
  { to: "/table", label: "商品一覧" },
  { to: "/tabs", label: "設定" },
];

// AppShell は「並べるだけの枠」。中身の Header・Sidebar は外から渡す。
// ☰ の開閉の state は Header（ボタン）と Sidebar（メニュー）の両方で使うので、ここで持つ。
// 枠の幅が 768px 未満になると ☰ のメニューに切り替わる（画面ではなく、この枠の幅で判定）。
// アプリで使うときは minHeight を省略すると、画面の高さいっぱいになる
export default function AppShellBasic() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppShell
      minHeight="320px"
      header={
        <Header
          title="管理画面"
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((prev) => !prev)}
          menuId="demo-sidebar" // このページには Sidebar が2つあるので id を変える（ふだんは不要）
          right={
            <Button size="sm" variant="secondary">
              ログアウト
            </Button>
          }
        />
      }
      sidebar={
        <Sidebar
          id="demo-sidebar"
          navItems={navItems}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      }
    >
      <Stack gap={4} style={{ padding: "var(--space-5)" }}>
        <PageHeader title="ダッシュボード" description="ここに各ページの中身が入る" />
      </Stack>
    </AppShell>
  );
}
