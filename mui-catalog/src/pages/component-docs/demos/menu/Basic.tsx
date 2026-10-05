import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, type MouseEvent } from "react";

// メニューは「どの要素の下に出すか」（anchorEl）を state で持つ。null なら閉じている
export default function MenuBasic() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [lastAction, setLastAction] = useState("");
  const open = anchorEl !== null;

  // 押されたボタン（event.currentTarget）を基準にメニューを出す
  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (action: string) => {
    setLastAction(action);
    handleClose(); // 選んだら閉じる
  };

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <IconButton
        id="menu-button"
        aria-label="操作メニュー"
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose} // 外側のクリック・Esc で呼ばれる
        slotProps={{ list: { "aria-labelledby": "menu-button" } }}
      >
        <MenuItem onClick={() => handleSelect("編集")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>編集</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSelect("削除")} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>
      {lastAction && <Typography variant="body2">「{lastAction}」を選びました</Typography>}
    </Stack>
  );
}
