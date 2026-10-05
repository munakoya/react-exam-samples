import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const plans = [
  { value: "free", label: "無料" },
  { value: "standard", label: "スタンダード" },
  { value: "pro", label: "プロ" },
];

// RadioGroup に value と onChange を渡すと、選ばれた Radio の value が入る。
// 各 Radio は FormControlLabel の control に渡し、value は FormControlLabel に書く
export default function RadioGroupBasic() {
  const [plan, setPlan] = useState("free");

  return (
    <FormControl>
      {/* id と aria-labelledby で、見出しとグループを結び付ける */}
      <FormLabel id="plan-label">プラン</FormLabel>
      <RadioGroup row aria-labelledby="plan-label" value={plan} onChange={(event) => setPlan(event.target.value)}>
        {plans.map((option) => (
          <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
      <Typography variant="body2" color="text.secondary">
        選択中：{plan}
      </Typography>
    </FormControl>
  );
}
