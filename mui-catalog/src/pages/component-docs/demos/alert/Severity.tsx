import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

// severity で色とアイコンが決まる。variant で塗り方を変える
export default function AlertSeverity() {
  return (
    <Stack spacing={1.5}>
      <Alert severity="success">保存しました</Alert>
      <Alert severity="info">メンテナンスのお知らせがあります</Alert>
      <Alert severity="warning">在庫が残りわずかです</Alert>
      <Alert severity="error">読み込みに失敗しました</Alert>
      <Alert severity="success" variant="outlined">
        variant="outlined"
      </Alert>
      <Alert severity="error" variant="filled">
        variant="filled"
      </Alert>
    </Stack>
  );
}
