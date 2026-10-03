import { Button, Stack, useToast } from "@/shared/ui";

// useToast().show(メッセージ, 種類) で、画面の右下に通知を出す（4秒で自動で消える）。
// アプリ全体を ToastProvider で包んでおく必要がある（このアプリでは AppProviders で包んでいる）
export default function ToastBasic() {
  const toast = useToast();

  return (
    <Stack direction="row" gap={2} wrap>
      <Button onClick={() => toast.show("保存しました")}>成功</Button>
      <Button variant="secondary" onClick={() => toast.show("新しいお知らせがあります", "info")}>
        お知らせ
      </Button>
      <Button variant="danger" onClick={() => toast.show("保存に失敗しました", "error")}>
        エラー
      </Button>
    </Stack>
  );
}
