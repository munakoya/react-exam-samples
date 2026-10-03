import { useState } from "react";
import {
  Alert,
  Button,
  ConfirmDialog,
  Container,
  EmptyState,
  Modal,
  PageHeader,
  Spinner,
  Stack,
  useToast,
} from "@/shared/ui";
import { DemoSection } from "@/widgets/demo-section";

/**
 * フィードバック・ダイアログの部品（/feedback）
 */
export const FeedbackPage = () => {
  const toast = useToast();
  const [showAlert, setShowAlert] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Container>
      <Stack gap={5}>
        <PageHeader title="フィードバック・ダイアログ" />

        <DemoSection name="Alert" usage="成功・エラーのメッセージ（onClose で × を出す）">
          <Stack gap={2}>
            <Alert>info：入力内容を確認してください。</Alert>
            {showAlert && (
              <Alert tone="success" onClose={() => setShowAlert(false)}>
                success：保存しました（× で閉じる）
              </Alert>
            )}
            <Alert tone="error" title="読み込みに失敗しました">
              時間をおいて再度お試しください。
            </Alert>
          </Stack>
        </DemoSection>

        <DemoSection name="Toast" usage="画面の隅に数秒出る通知。useToast().show() で出す">
          <Stack direction="row" gap={2} wrap>
            <Button onClick={() => toast.show("保存しました", "success")}>success</Button>
            <Button variant="secondary" onClick={() => toast.show("お知らせです")}>
              info
            </Button>
            <Button variant="danger" onClick={() => toast.show("保存に失敗しました", "error")}>
              error
            </Button>
          </Stack>
        </DemoSection>

        <DemoSection name="EmptyState" usage="0件・見つからないときの案内">
          <EmptyState
            title="まだデータがありません"
            description="「新規登録」から追加してください。"
            action={<Button>新規登録</Button>}
          />
        </DemoSection>

        <DemoSection name="Spinner" usage="読み込み中">
          <Spinner />
        </DemoSection>

        <DemoSection
          name="Modal / ConfirmDialog"
          usage="重ねて出す画面 / 削除などの確認。Esc・背景クリックで閉じる"
        >
          <Stack direction="row" gap={2}>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Modal を開く
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              削除（ConfirmDialog）
            </Button>
          </Stack>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Modal"
            footer={<Button onClick={() => setModalOpen(false)}>閉じる</Button>}
          >
            <p>フォームや詳細を載せる。</p>
          </Modal>
          <ConfirmDialog
            open={confirmOpen}
            title="削除しますか？"
            message="「サンプル」を削除します。"
            onConfirm={() => {
              setConfirmOpen(false);
              toast.show("削除しました", "success");
            }}
            onCancel={() => setConfirmOpen(false)}
          />
        </DemoSection>
      </Stack>
    </Container>
  );
};
