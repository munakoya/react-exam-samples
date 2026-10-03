import { useState } from "react";
import { TextField } from "@/shared/ui";

// value と onChange で入力値を state に持つ（制御コンポーネント）
export default function TextFieldBasic() {
  const [name, setName] = useState("");

  return (
    <TextField
      label="名前"
      placeholder="山田 太郎"
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
