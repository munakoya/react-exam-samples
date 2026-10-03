import { Breadcrumb } from "@/shared/ui";

const item = { id: "abc", name: "牛乳" };

// 最後の項目は「今のページ」なので to を書かない（リンクにしない）
export default function BreadcrumbBasic() {
  return (
    <Breadcrumb
      items={[
        { label: "商品一覧", to: "/table" },
        { label: item.name, to: "/breadcrumb" },
        { label: "編集" },
      ]}
    />
  );
}
