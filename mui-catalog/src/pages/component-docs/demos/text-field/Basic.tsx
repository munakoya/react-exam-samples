import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

// value と onChange で入力値を state に持つ（制御コンポーネント）。
// label が枠の上に移動するのが MUI の入力欄の特徴
export default function TextFieldBasic() {
  const [name, setName] = useState("");

  return (
    <Stack spacing={2} sx={{ maxWidth: 360 }}>
      <TextField
        label="名前"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="山田 太郎"
        required // ラベルに * が付く（チェックは自分で書く）
        fullWidth
      />
      <Typography variant="body2" color="text.secondary">
        入力中の値：{name || "（未入力）"}
      </Typography>

      {/* variant で見た目を変えられる（初期値は outlined） */}
      <TextField label="filled" variant="filled" />
      <TextField label="standard" variant="standard" />
      <TextField label="disabled" defaultValue="編集できない" disabled />
    </Stack>
  );
}
