import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, Outlet } from "react-router";
import { SamplesTopLink } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダーだけ） ── app/layouts
 *
 * ページが 1 つだけなので、サイドメニュー（AppShell の Drawer）は使わず、AppBar だけにする。
 * ページが増えたら、library のように AppShell に置き換える。
 */
export const RootLayout = () => {
  return (
    <>
      {/* position="sticky"：スクロールしても上に貼り付く。下の中身を押し下げるので、空の Toolbar は要らない */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none", fontWeight: 700 }}
          >
            家計簿
          </Typography>
          <SamplesTopLink /> {/* 公開ページだけに出る「← サンプル集」 */}
        </Toolbar>
      </AppBar>
      <Box component="main">
        <Outlet />
      </Box>
    </>
  );
};
