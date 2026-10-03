import { useState } from "react";
import { Button, Modal, Stack, TextField } from "@/shared/ui";

// 開閉の状態（open）は親が持つ。Esc キー・背景のクリックでも onClose が呼ばれる
export default function ModalBasic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>編集する</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="プロフィールを編集"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={() => setOpen(false)}>保存</Button>
          </>
        }
      >
        <Stack gap={3}>
          <TextField label="名前" defaultValue="山田 太郎" />
          <TextField label="メールアドレス" type="email" defaultValue="yamada@example.com" />
        </Stack>
      </Modal>
    </>
  );
}
