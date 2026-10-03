import { Badge, DescriptionList, Stack } from "@/shared/ui";

// 詳細ページの「項目名：値」。description には文字だけでなく部品も渡せる。
// multiline: true で入力した改行をそのまま表示する。置かれた場所が狭いと1列になる
export default function DescriptionListBasic() {
  return (
    <DescriptionList
      items={[
        { term: "カテゴリ", description: "食品" },
        {
          term: "在庫数",
          description: (
            <Stack direction="row" gap={2} align="center">
              2 <Badge tone="warning">在庫少</Badge>
            </Stack>
          ),
        },
        { term: "メモ", description: "冷蔵で保存\n2本まで", multiline: true },
        { term: "更新日時", description: "2026/10/03 18:05" },
      ]}
    />
  );
}
