import Alert, { type AlertColor } from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { useState, type SyntheticEvent } from "react";

type Message = { text: string; severity: AlertColor };

// 画面の端に数秒だけ出る通知。中に Alert を入れると色とアイコンが付く。
// 出す内容を state に持ち、null なら閉じている
export default function SnackbarBasic() {
  const [message, setMessage] = useState<Message | null>(null);

  const handleClose = (_event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    // 画面のほかの場所をクリックしただけでは閉じない
    if (reason === "clickaway") return;
    setMessage(null);
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => setMessage({ text: "保存しました", severity: "success" })}>
          保存する
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setMessage({ text: "保存に失敗しました", severity: "error" })}
        >
          失敗させる
        </Button>
      </Stack>
      <Snackbar
        open={message !== null}
        autoHideDuration={3000} // 3秒で onClose が呼ばれる
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={message?.severity} variant="filled" sx={{ width: "100%" }}>
          {message?.text}
        </Alert>
      </Snackbar>
    </>
  );
}
