import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/**
 * 「項目名：値」の一覧（詳細ページの情報欄） ── shared/ui
 *
 * HTML の <dl>（説明リスト）で作る。PC では2列、スマホでは項目名の下に値を出す。
 *
 *   <DescriptionList
 *     items={[
 *       { term: "著者", description: book.author },
 *       { term: "メモ", description: book.memo || "—", multiline: true },
 *     ]}
 *   />
 */

export type DescriptionItem = {
  term: string;
  description: ReactNode;
  /** true なら改行をそのまま表示する（メモなど） */
  multiline?: boolean;
};

export const DescriptionList = ({ items }: { items: DescriptionItem[] }) => {
  return (
    <Box
      component="dl"
      sx={{
        display: "grid",
        // スマホは1列、600px 以上は「項目名 160px ＋ 値」の2列
        gridTemplateColumns: { xs: "1fr", sm: "160px minmax(0, 1fr)" },
        columnGap: 3,
        rowGap: { xs: 0.5, sm: 2 },
        m: 0,
      }}
    >
      {items.map((item) => (
        // <dt>・<dd> を grid の子として並べるため、Fragment ではなく display: contents の Box で包む
        <Box key={item.term} sx={{ display: "contents" }}>
          <Typography component="dt" variant="body2" color="text.secondary" sx={{ pt: { xs: 1.5, sm: 0 } }}>
            {item.term}
          </Typography>
          <Typography
            component="dd"
            sx={{ m: 0, whiteSpace: item.multiline ? "pre-wrap" : undefined, overflowWrap: "anywhere" }}
          >
            {item.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
