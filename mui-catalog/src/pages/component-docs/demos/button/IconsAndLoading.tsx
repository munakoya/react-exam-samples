import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";

// startIcon / endIcon で文字の左右にアイコンを付ける。
// loading を true にすると回転アイコンが出て、押せなくなる（二重送信を防ぐ）
export default function ButtonIconsAndLoading() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 保存の代わり
    setSaving(false);
  };

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
        削除
      </Button>
      <Button variant="contained" endIcon={<SendIcon />}>
        送信
      </Button>
      {/* loadingPosition="start"：startIcon の位置に回転アイコンを出し、文字は残す */}
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        loading={saving}
        loadingPosition="start"
        onClick={handleSave}
      >
        {saving ? "保存中…" : "保存（押してみる）"}
      </Button>
      <Button variant="contained" disabled>
        disabled
      </Button>
    </Stack>
  );
}
