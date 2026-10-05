import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// variant で文字の大きさ・太さを選ぶ。値は theme の typography で決まる
export default function TypographyVariants() {
  return (
    <Stack spacing={1}>
      <Typography variant="h4">h4 見出し</Typography>
      <Typography variant="h5">h5 見出し</Typography>
      <Typography variant="h6">h6 見出し</Typography>
      <Typography variant="subtitle1">subtitle1 小見出し</Typography>
      <Typography variant="body1">body1 本文（初期値）</Typography>
      <Typography variant="body2">body2 少し小さい本文</Typography>
      <Typography variant="caption">caption 注釈</Typography>
      <Typography variant="overline">overline ラベル</Typography>
    </Stack>
  );
}
