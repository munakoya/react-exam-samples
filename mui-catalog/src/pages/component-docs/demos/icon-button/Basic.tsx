import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

// アイコンだけのボタン。文字がないので、aria-label（読み上げ用の名前）を必ず付ける。
// Tooltip で包むと、マウスを乗せたときに何のボタンか表示できる
export default function IconButtonBasic() {
  const [liked, setLiked] = useState(false);

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Tooltip title="編集">
        <IconButton aria-label="編集">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="削除">
        <IconButton aria-label="削除" color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      {/* オン・オフを切り替えるボタンは aria-pressed で状態を伝える */}
      <IconButton
        aria-label="お気に入り"
        aria-pressed={liked}
        color={liked ? "error" : "default"}
        onClick={() => setLiked((prev) => !prev)}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      <IconButton aria-label="編集（小）" size="small">
        <EditIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
