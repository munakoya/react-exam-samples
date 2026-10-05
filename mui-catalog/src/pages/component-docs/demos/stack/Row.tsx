import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// direction="row" で横に並べる。
// v9 では alignItems・justifyContent を props に直接書けないので、sx に書く
export default function StackRow() {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
      <Typography variant="h6" component="h2">
        商品一覧
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined">CSV 出力</Button>
        <Button variant="contained">新規登録</Button>
      </Stack>
    </Stack>
  );
}
