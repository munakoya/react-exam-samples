import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const categories = [
  { value: "food", label: "食品" },
  { value: "daily", label: "日用品" },
  { value: "book", label: "本" },
];

// TextField に select を付けるとセレクトボックスになる（いちばん手軽な書き方）。
// 選択肢は MenuItem で並べ、value が state に入る。未選択は ""
export default function SelectTextFieldSelect() {
  const [category, setCategory] = useState("");

  return (
    <TextField
      select
      label="カテゴリ"
      value={category}
      onChange={(event) => setCategory(event.target.value)}
      helperText={category === "" ? "選択してください" : `選択中：${category}`}
      fullWidth
      sx={{ maxWidth: 360 }}
    >
      {categories.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
