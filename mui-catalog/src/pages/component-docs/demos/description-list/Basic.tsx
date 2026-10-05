import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { DescriptionList } from "@/shared/ui";

// 値には文字だけでなく、Chip・Rating などの部品も渡せる
export default function DescriptionListBasic() {
  return (
    <Card sx={{ maxWidth: 640 }}>
      <CardContent>
        <DescriptionList
          items={[
            { term: "著者", description: "夏目漱石" },
            { term: "出版年", description: "1906年" },
            { term: "評価", description: <Rating value={4} readOnly size="small" aria-label="評価 4" /> },
            {
              term: "タグ",
              description: (
                <Stack direction="row" spacing={0.5}>
                  <Chip label="古典" size="small" />
                  <Chip label="名作" size="small" />
                </Stack>
              ),
            },
            // multiline：改行をそのまま表示する
            { term: "メモ", description: "1行目のメモ\n2行目のメモ", multiline: true },
          ]}
        />
      </CardContent>
    </Card>
  );
}
