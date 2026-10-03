import { Badge, Stack, Tabs } from "@/shared/ui";

// ← → キーでもタブを移動できる
export default function TabsBasic() {
  return (
    <Tabs
      label="商品の情報"
      items={[
        {
          id: "detail",
          label: "詳細",
          content: <p>青森県産のりんごです。甘みと酸味のバランスが良く、そのまま食べられます。</p>,
        },
        {
          id: "spec",
          label: "仕様",
          content: (
            <Stack direction="row" gap={2}>
              <Badge>産地：青森</Badge>
              <Badge>重さ：約300g</Badge>
            </Stack>
          ),
        },
        {
          id: "review",
          label: "レビュー（2）",
          content: <p>★★★★☆ とても甘くておいしかったです。</p>,
        },
      ]}
    />
  );
}
