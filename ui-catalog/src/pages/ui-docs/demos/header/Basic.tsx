import { Avatar, Button, Header, Stack } from "@/shared/ui";

// right に置いた要素は右端に寄る。homeTo を渡すとアプリ名がリンクになる。
// onMenuClick を渡すと ☰ ボタンができる（AppShell の中で、幅が狭いときだけ表示される）
export default function HeaderBasic() {
  return (
    <Header
      title="在庫管理"
      homeTo="/"
      right={
        <Stack direction="row" gap={2} align="center">
          <Avatar name="山田 太郎" size="sm" />
          <Button size="sm" variant="ghost">
            ログアウト
          </Button>
        </Stack>
      }
    />
  );
}
