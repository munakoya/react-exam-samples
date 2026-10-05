import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { useState } from "react";

// ラベル付きにするときは FormControlLabel の control に Checkbox を渡す（文字を押しても切り替わる）。
// チェック系は value ではなく checked を使い、event.target.checked（true / false）で受け取る
export default function CheckboxBasic() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Stack>
      <FormControlLabel
        control={<Checkbox checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />}
        label="利用規約に同意する"
      />
      <FormControlLabel control={<Checkbox defaultChecked />} label="最初からチェック（state なし）" />
      <FormControlLabel control={<Checkbox />} label="押せない" disabled />
    </Stack>
  );
}
