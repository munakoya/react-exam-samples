import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// variant で見た目の強さを選ぶ。1つの画面で contained（主な操作）は1つにしぼると分かりやすい
//   contained：塗りつぶし（保存・登録など） / outlined：枠線（キャンセル・補助） / text：文字だけ（初期値）
export default function ButtonVariants() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
      <Button variant="contained">contained</Button>
      <Button variant="outlined">outlined</Button>
      <Button variant="text">text</Button>
    </Stack>
  );
}
