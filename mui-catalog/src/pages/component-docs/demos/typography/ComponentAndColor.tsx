import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// variant は見た目、component は HTML のタグ。
// 「見た目は h5、タグは h1」のように分けて、ページの見出しの順番を正しく保つ
export default function TypographyComponentAndColor() {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        ページのタイトル（h5 の見た目の h1）
      </Typography>
      {/* color は theme の色の名前。補足は text.secondary（薄い灰色）にすることが多い */}
      <Typography color="text.secondary">最終更新：2026年10月5日</Typography>
      <Typography color="error">エラーの文字</Typography>
      {/* 太さなどは sx で変える */}
      <Typography sx={{ fontWeight: "bold" }}>太字の本文</Typography>
      {/* noWrap：1行に収まらない分を「…」で省略する（幅が決まっている要素の中で使う） */}
      <Typography noWrap sx={{ width: 240 }}>
        とても長い商品名がここに入ると、途中で省略されて最後に三点リーダーが付きます
      </Typography>
    </Box>
  );
}
