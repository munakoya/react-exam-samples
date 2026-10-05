import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

// マウスを乗せる・フォーカスすると説明を出す。title に文言、子要素は1つだけ
export default function TooltipBasic() {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Tooltip title="削除">
        <IconButton aria-label="削除">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      {/* placement：出す位置。arrow：吹き出しの矢印 */}
      <Tooltip title="税込みの金額で入力します" placement="right" arrow>
        <InfoOutlinedIcon color="action" tabIndex={0} aria-label="入力のヒント" />
      </Tooltip>
      {/* disabled のボタンはマウスの動きを受け取らないので、<span> で包む */}
      <Tooltip title="在庫がないため購入できません">
        <span>
          <Button variant="contained" disabled>
            購入する
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );
}
