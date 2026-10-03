import { Badge, Button, Stack } from "@/shared/ui";

// 横に並べ、上下中央（align="center"）にそろえる
export default function StackRow() {
  return (
    <Stack direction="row" gap={2} align="center">
      <Button>保存</Button>
      <Button variant="secondary">キャンセル</Button>
      <Badge tone="success">保存済み</Badge>
    </Stack>
  );
}
