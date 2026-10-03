import { Button, Stack } from "@/shared/ui";

// size="sm" は表の中・カードの中など、小さく置きたいときに使う
export default function ButtonSizes() {
  return (
    <Stack direction="row" gap={2} align="center">
      <Button>md（標準）</Button>
      <Button size="sm">sm</Button>
    </Stack>
  );
}
