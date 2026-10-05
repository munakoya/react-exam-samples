import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const tags = ["React", "TypeScript", "MUI", "React Router", "React Hook Form", "zod", "Vite", "TanStack Query"];

// 折り返すときは useFlexGap と flexWrap: "wrap" を一緒に使う
// （useFlexGap がないと、折り返した行の間に隙間ができない）
export default function StackWrap() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} />
      ))}
    </Stack>
  );
}
