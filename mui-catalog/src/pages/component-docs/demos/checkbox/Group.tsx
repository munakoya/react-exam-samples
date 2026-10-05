import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";

const days = ["月", "火", "水", "木", "金"];

// 複数選ぶときは、選んだ値を配列で持つ。
// FormControl component="fieldset" ＋ FormLabel component="legend" で、グループの見出しを付ける
export default function CheckboxGroup() {
  const [selected, setSelected] = useState<string[]>(["月"]);
  const error = selected.length === 0;

  // チェックされたら足し、外されたら取り除く
  const toggle = (day: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, day] : prev.filter((item) => item !== day)));
  };

  return (
    <FormControl component="fieldset" error={error}>
      <FormLabel component="legend">出勤する曜日</FormLabel>
      {/* row で横に並べる */}
      <FormGroup row>
        {days.map((day) => (
          <FormControlLabel
            key={day}
            label={day}
            control={
              <Checkbox checked={selected.includes(day)} onChange={(event) => toggle(day, event.target.checked)} />
            }
          />
        ))}
      </FormGroup>
      <FormHelperText>{error ? "1つ以上選んでください" : `${selected.length}日選択中`}</FormHelperText>
    </FormControl>
  );
}
