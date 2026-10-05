import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useState } from "react";

// アイコンの右上に数を出す。0 のときは自動で隠れる（showZero で 0 も表示）
export default function BadgeBasic() {
  const [count, setCount] = useState(3);

  return (
    <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
      <IconButton aria-label={`カート（${count}点）`}>
        <Badge badgeContent={count} color="primary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      {/* max を超えると「99+」と表示する */}
      <IconButton aria-label="メール（120件）">
        <Badge badgeContent={120} max={99} color="error">
          <MailIcon />
        </Badge>
      </IconButton>
      {/* variant="dot"：数を出さず、点だけ（新着ありの印） */}
      <IconButton aria-label="新しいお知らせあり">
        <Badge variant="dot" color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Button size="small" onClick={() => setCount((prev) => prev + 1)}>
        ＋1
      </Button>
      <Button size="small" onClick={() => setCount(0)}>
        0 にする
      </Button>
    </Stack>
  );
}
