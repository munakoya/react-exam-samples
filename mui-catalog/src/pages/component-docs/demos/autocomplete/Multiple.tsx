import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const skillOptions = ["React", "TypeScript", "Next.js", "Node.js", "C#", "SQL", "Docker"];

// multiple で複数選択。選んだものは Chip で並び、× で外せる。
// freeSolo を付けると、候補にない文字も Enter で追加できる（タグの入力など）
export default function AutocompleteMultiple() {
  const [skills, setSkills] = useState<string[]>(["React"]);

  return (
    <Autocomplete
      multiple
      freeSolo
      options={skillOptions}
      value={skills}
      onChange={(_event, newValue) => setSkills(newValue)}
      filterSelectedOptions // 選んだものは候補から消す
      renderInput={(params) => <TextField {...params} label="スキル" placeholder="入力して Enter" />}
      sx={{ maxWidth: 480 }}
    />
  );
}
