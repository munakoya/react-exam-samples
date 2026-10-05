import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { Link as RouterLink } from "react-router";

// アプリ内のページへは、component={RouterLink} と to で React Router のリンクにする。
// href のままだとページ全体を読み込み直し、state が消えてしまう。
// Button・ListItemButton・Tab なども同じ書き方でリンクにできる
export default function LinkWithRouter() {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Link component={RouterLink} to="/button">
        Button のページへ
      </Link>
      <Button component={RouterLink} to="/text-field" variant="outlined">
        TextField のページへ
      </Button>
    </Stack>
  );
}
