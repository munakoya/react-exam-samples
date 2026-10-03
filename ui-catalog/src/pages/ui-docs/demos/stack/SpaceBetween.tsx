import { Button, Stack } from "@/shared/ui";

// justify="between"：両端に寄せる（見出しとボタン、左右のボタンなど）
export default function StackSpaceBetween() {
  return (
    <Stack direction="row" justify="between" align="center">
      <span>3件を選択中</span>
      <Button variant="danger" size="sm">
        まとめて削除
      </Button>
    </Stack>
  );
}
