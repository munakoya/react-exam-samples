import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

// type で入力の種類を変える。<input> 自体に付けたい属性（min・max・step など）は slotProps.htmlInput に書く
export default function TextFieldTypes() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 360 }}>
      <TextField label="数量" type="number" defaultValue={1} slotProps={{ htmlInput: { min: 0, max: 99, step: 1 } }} />
      <TextField label="パスワード" type="password" autoComplete="current-password" />
      {/* 日付は値がなくても枠の中に「年/月/日」が出るので、ラベルを常に上に置く（shrink） */}
      <TextField label="期限" type="date" slotProps={{ inputLabel: { shrink: true } }} />
      {/* multiline で複数行。minRows で最初の高さ、maxRows で伸びる上限 */}
      <TextField label="メモ" multiline minRows={3} maxRows={6} />
    </Stack>
  );
}
