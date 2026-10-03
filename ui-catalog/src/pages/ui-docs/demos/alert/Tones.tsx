import { Alert, Stack } from "@/shared/ui";

// tone="error" は表示した瞬間に読み上げる（role="alert"）。それ以外は role="status"
export default function AlertTones() {
  return (
    <Stack gap={3}>
      <Alert>お知らせのメッセージです</Alert>
      <Alert tone="success">保存しました</Alert>
      <Alert tone="error" title="読み込みに失敗しました">
        時間をおいて再度お試しください。
      </Alert>
    </Stack>
  );
}
