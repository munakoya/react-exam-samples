import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";

// AlertTitle で太字の見出し、onClose で × ボタン、action で右側にボタンを置ける
export default function AlertTitleAndAction() {
  const [open, setOpen] = useState(true);

  return (
    <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
      {open ? (
        <Alert severity="warning" onClose={() => setOpen(false)} sx={{ width: "100%" }}>
          <AlertTitle>入力内容を確認してください</AlertTitle>
          メールアドレスがまだ確認されていません。
        </Alert>
      ) : (
        <Button onClick={() => setOpen(true)}>もう一度表示する</Button>
      )}
      <Alert
        severity="error"
        sx={{ width: "100%" }}
        action={
          <Button color="inherit" size="small">
            再読み込み
          </Button>
        }
      >
        通信に失敗しました
      </Alert>
    </Stack>
  );
}
