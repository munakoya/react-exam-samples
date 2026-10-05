import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

// direction・spacing もオブジェクトで画面幅ごとに変えられる。
// divider を渡すと、要素の間に区切り線が入る
export default function StackResponsive() {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }} // スマホは縦、600px 以上は横
      spacing={{ xs: 1, sm: 2 }}
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
        項目 1
      </Paper>
      <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
        項目 2
      </Paper>
      <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
        項目 3
      </Paper>
    </Stack>
  );
}
