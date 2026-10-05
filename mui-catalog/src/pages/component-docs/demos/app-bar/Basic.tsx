import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// AppBar（ヘッダーの帯）＋ Toolbar（中身を横に並べ、高さをそろえる）の組み合わせで使う。
// 見本なので position="static"。アプリでは "fixed"（画面上部に固定）や "sticky" にする
export default function AppBarBasic() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* edge="start"：左端の余白を詰める */}
        <IconButton edge="start" color="inherit" aria-label="メニューを開く" sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
        {/* flexGrow: 1 で残りの幅を使い、右のボタンを右端へ押し出す */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          在庫管理
        </Typography>
        <Button color="inherit">ログアウト</Button>
      </Toolbar>
    </AppBar>
  );
}
