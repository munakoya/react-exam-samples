import { Rating, Stack } from "@/shared/ui";

// 表示用。小数は四捨五入する。読み上げは「5点中4点」
export default function RatingDisplay() {
  return (
    <Stack direction="row" gap={4}>
      <Rating value={1} />
      <Rating value={3} />
      <Rating value={4.6} />
    </Stack>
  );
}
