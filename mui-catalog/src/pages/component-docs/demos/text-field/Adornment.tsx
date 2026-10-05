import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

// 入力欄の中の左右に、アイコンや単位を置ける（InputAdornment）。
// v9 では slotProps.input に書く（古い記事の InputProps は使えない）
export default function TextFieldAdornment() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 360 }}>
      <TextField
        label="検索"
        type="search"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        label="価格"
        type="number"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">¥</InputAdornment>,
            endAdornment: <InputAdornment position="end">（税込）</InputAdornment>,
          },
          htmlInput: { min: 0 },
        }}
      />
    </Stack>
  );
}
