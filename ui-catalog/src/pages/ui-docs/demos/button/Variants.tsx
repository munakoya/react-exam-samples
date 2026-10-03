import { Button, Stack } from "@/shared/ui";

// variant で用途ごとの見た目を選ぶ
export default function ButtonVariants() {
  return (
    <Stack direction="row" gap={2} wrap>
      <Button>primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="danger">danger</Button>
      <Button variant="ghost">ghost</Button>
    </Stack>
  );
}
