import { useState } from "react";
import { Alert, Button, ConfirmDialog, Stack } from "@/shared/ui";

type Item = { id: string; name: string };

// 削除の対象を state に持ち、null でなければ開く（開閉フラグを別に持たなくてよい）
export default function ConfirmDialogDelete() {
  const [target, setTarget] = useState<Item | null>(null);
  const [message, setMessage] = useState("");

  const item: Item = { id: "1", name: "にんじん" };

  const handleConfirm = () => {
    if (!target) return;
    setMessage(`「${target.name}」を削除しました`); // 実際はここで削除の処理を呼ぶ
    setTarget(null);
  };

  return (
    <Stack gap={3} align="start">
      {message && <Alert tone="success">{message}</Alert>}
      <Button variant="danger" onClick={() => setTarget(item)}>
        「{item.name}」を削除
      </Button>
      <ConfirmDialog
        open={target !== null}
        title="削除しますか？"
        message={`「${target?.name ?? ""}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setTarget(null)}
      />
    </Stack>
  );
}
