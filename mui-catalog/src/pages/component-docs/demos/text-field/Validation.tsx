import TextField from "@mui/material/TextField";
import { useState } from "react";

const MAX = 20;

// error={true} で赤枠、helperText で入力欄の下に説明やエラー文を出す
export default function TextFieldValidation() {
  const [title, setTitle] = useState("");
  const tooLong = title.length > MAX;

  return (
    <TextField
      label="タイトル"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      error={tooLong}
      helperText={tooLong ? `${MAX}文字以内で入力してください` : `${title.length} / ${MAX}文字`}
      fullWidth
      sx={{ maxWidth: 360 }}
    />
  );
}
