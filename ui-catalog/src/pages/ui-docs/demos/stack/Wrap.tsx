import { Badge, Stack } from "@/shared/ui";

const tags = [
  "React",
  "TypeScript",
  "CSS Modules",
  "React Hook Form",
  "zod",
  "React Router",
  "TanStack Query",
];

// wrap：入りきらない要素を次の行へ折り返す（タグの一覧など）
export default function StackWrap() {
  return (
    <Stack direction="row" gap={2} wrap>
      {tags.map((tag) => (
        <Badge key={tag}>{tag}</Badge>
      ))}
    </Stack>
  );
}
