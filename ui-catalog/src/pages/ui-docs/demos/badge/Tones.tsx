import { Badge, Stack } from "@/shared/ui";

// tone で色を選ぶ。状態から tone を決めるときは対応表のオブジェクトを使うと分岐が増えない
const statusTone = { todo: "neutral", doing: "info", done: "success" } as const;

export default function BadgeTones() {
  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2} wrap>
        <Badge>neutral</Badge>
        <Badge tone="info">info</Badge>
        <Badge tone="success">success</Badge>
        <Badge tone="warning">warning</Badge>
        <Badge tone="danger">danger</Badge>
      </Stack>
      <Stack direction="row" gap={2}>
        <Badge tone={statusTone.todo}>未着手</Badge>
        <Badge tone={statusTone.doing}>進行中</Badge>
        <Badge tone={statusTone.done}>完了</Badge>
      </Stack>
    </Stack>
  );
}
