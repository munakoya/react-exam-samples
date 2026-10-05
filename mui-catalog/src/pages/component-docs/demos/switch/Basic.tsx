import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import { useState } from "react";

// オン・オフの切り替え。使い方は Checkbox と同じ（checked と event.target.checked）。
// 押した瞬間に反映される設定に向く（「同意する」のような送信前提の項目は Checkbox）
export default function SwitchBasic() {
  const [notify, setNotify] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch checked={notify} onChange={(event) => setNotify(event.target.checked)} />}
        label={`通知を受け取る（${notify ? "オン" : "オフ"}）`}
      />
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} color="secondary" />}
        label="ダークモード"
      />
      <FormControlLabel control={<Switch disabled />} label="押せない" />
    </FormGroup>
  );
}
