import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

// Stack は子要素を縦に並べ、spacing で間隔をそろえる（spacing={2} → 16px）
export default function StackVertical() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 360 }}>
      <TextField label="名前" />
      <TextField label="メールアドレス" />
      <Button variant="contained">登録</Button>
    </Stack>
  );
}
