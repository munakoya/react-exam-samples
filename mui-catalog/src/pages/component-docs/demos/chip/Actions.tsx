import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const categories = ["食品", "日用品", "本", "家電"];

// onClick を渡すと押せる Chip（絞り込みなど）、onDelete を渡すと × が付く（タグの削除など）
export default function ChipActions() {
  const [selected, setSelected] = useState<string[]>(["食品"]);
  const [tags, setTags] = useState(["React", "TypeScript", "MUI"]);

  const toggle = (category: string) =>
    setSelected((prev) => (prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]));

  return (
    <Stack spacing={2}>
      <div>
        <Typography variant="body2" gutterBottom>
          絞り込み（押して切り替え）
        </Typography>
        <Stack direction="row" spacing={1}>
          {categories.map((category) => {
            const active = selected.includes(category);
            return (
              <Chip
                key={category}
                label={category}
                onClick={() => toggle(category)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                aria-pressed={active}
              />
            );
          })}
        </Stack>
      </div>
      <div>
        <Typography variant="body2" gutterBottom>
          タグ（× で削除）
        </Typography>
        <Stack direction="row" spacing={1}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} onDelete={() => setTags((prev) => prev.filter((item) => item !== tag))} />
          ))}
        </Stack>
      </div>
    </Stack>
  );
}
