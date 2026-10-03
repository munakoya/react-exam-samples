import { useState } from "react";
import { Alert, Button } from "@/shared/ui";

// onClose を渡すと × ボタンが出る。メッセージは state に持ち、空文字で消す
export default function AlertClosable() {
  const [message, setMessage] = useState("保存しました");

  if (!message) {
    return <Button onClick={() => setMessage("保存しました")}>もう一度表示する</Button>;
  }

  return (
    <Alert tone="success" onClose={() => setMessage("")}>
      {message}
    </Alert>
  );
}
