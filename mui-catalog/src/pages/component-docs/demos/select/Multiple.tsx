import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

const tagOptions = ["仕事", "家事", "買い物", "趣味", "勉強"];

// 複数選ぶときは Select を直接使い、multiple を付ける。value は配列になる。
// FormControl・InputLabel・Select をセットで書き、labelId と label でラベルをつなぐ
export default function SelectMultiple() {
  const [tags, setTags] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    // ブラウザの自動入力では "a,b" のような文字列で届くことがあるので、配列にそろえる
    setTags(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl size="small" fullWidth sx={{ maxWidth: 360 }}>
      <InputLabel id="tags-label">タグ</InputLabel>
      <Select
        labelId="tags-label"
        label="タグ"
        multiple
        value={tags}
        onChange={handleChange}
        // 選んだものを Chip で表示する
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        )}
      >
        {tagOptions.map((tag) => (
          <MenuItem key={tag} value={tag}>
            {tag}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
