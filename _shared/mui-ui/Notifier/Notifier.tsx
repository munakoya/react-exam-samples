import Alert from "@mui/material/Alert";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import type { SyntheticEvent } from "react";
import { useNotifierStore } from "./notifierStore";

/**
 * notify() で出した通知を表示するスナックバー ── shared/ui
 *
 * アプリに1つだけ置く（app/providers/AppProviders.tsx）。
 *
 *   <Notifier />
 *   …
 *   notify("「坊っちゃん」を登録しました");
 */
export const Notifier = () => {
  const notification = useNotifierStore((state) => state.notification);
  const open = useNotifierStore((state) => state.open);
  const close = useNotifierStore((state) => state.close);

  const handleClose = (_event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    // 画面のほかの場所をクリックしただけでは閉じない（読む前に消えないように）
    if (reason === "clickaway") return;
    close();
  };

  return (
    <Snackbar
      // key を変えると Snackbar が作り直され、続けて通知を出しても表示時間が最初から数え直される
      key={notification?.id}
      open={open}
      autoHideDuration={4000} // 4秒で onClose が呼ばれる
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={notification?.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};
