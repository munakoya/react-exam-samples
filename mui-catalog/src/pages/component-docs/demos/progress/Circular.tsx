import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// 読み込み中の回転アイコン。value を渡さなければ回り続ける
export default function ProgressCircular() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
        <CircularProgress aria-label="読み込み中" />
        <CircularProgress size={24} color="success" aria-label="読み込み中" />
        {/* variant="determinate" と value（0〜100）で進み具合を出す */}
        <CircularProgress variant="determinate" value={70} aria-label="進み具合" />
      </Stack>

      {/* よく使う形：読み込み中は、一覧の代わりに中央に表示する */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 3 }}>
        <CircularProgress aria-label="読み込み中" />
        <Typography variant="body2" color="text.secondary">
          読み込み中…
        </Typography>
      </Box>
    </Stack>
  );
}
