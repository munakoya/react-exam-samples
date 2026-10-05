import InboxIcon from "@mui/icons-material/Inbox";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

const menuItems = [
  { label: "受信箱", icon: <InboxIcon /> },
  { label: "お気に入り", icon: <StarIcon /> },
  { label: "設定", icon: <SettingsIcon /> },
];

// 画面の端から出てくるメニュー。open と onClose（背景のクリック・Esc で呼ばれる）で開閉する
export default function DrawerTemporary() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        メニューを開く
      </Button>
      {/* anchor：出てくる向き（"left" | "right" | "top" | "bottom"） */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                {/* 項目を押したら閉じる */}
                <ListItemButton onClick={() => setOpen(false)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
