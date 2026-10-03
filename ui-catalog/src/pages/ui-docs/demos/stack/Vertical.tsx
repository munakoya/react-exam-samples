import { Button, Stack } from "@/shared/ui";

// 縦に並べる。gap は tokens.css の --space-1〜7 の番号（3 → 12px）
export default function StackVertical() {
  return (
    <Stack gap={3}>
      <Button variant="secondary">1つ目</Button>
      <Button variant="secondary">2つ目</Button>
      <Button variant="secondary">3つ目</Button>
    </Stack>
  );
}
