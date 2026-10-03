import { Sidebar } from "@/shared/ui";

// navItems：見出しのないリンク / groups：見出しつきのグループ
// end: true を付けると、URL が完全に一致するときだけ選択中になる（/items と /items/new を並べるとき）
export default function SidebarGroups() {
  return (
    <div style={{ display: "flex", height: 260 }}>
      <Sidebar
        id="demo-sidebar-groups" // このページには Sidebar が2つあるので id を変える（ふだんは不要）
        navItems={[{ to: "/sidebar", label: "ダッシュボード", end: true }]}
        groups={[
          {
            title: "商品",
            items: [
              { to: "/table", label: "商品一覧" },
              { to: "/text-field", label: "新規登録" },
            ],
          },
          { title: "設定", items: [{ to: "/tabs", label: "全般" }] },
        ]}
        footer={<small>ログイン中：山田</small>}
      />
    </div>
  );
}
