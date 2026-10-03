import { useState } from "react";
import { Button, Stack } from "@/shared/ui";

// disabled：押せない / loading：処理中（押せない＋「処理中…」） / fullWidth：横幅いっぱい
export default function ButtonStates() {
  const [loading, setLoading] = useState(false);

  // 通信の代わりに1秒待つ
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2}>
        <Button disabled>disabled</Button>
        <Button loading={loading} onClick={handleSave}>
          押すと1秒 loading
        </Button>
      </Stack>
      <Button fullWidth>fullWidth</Button>
    </Stack>
  );
}
