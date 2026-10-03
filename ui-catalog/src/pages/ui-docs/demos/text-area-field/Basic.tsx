import { useState } from "react";
import { TextAreaField } from "@/shared/ui";

const MAX_LENGTH = 200;

// 複数行の入力。hint に文字数を出す例
export default function TextAreaFieldBasic() {
  const [body, setBody] = useState("");

  return (
    <TextAreaField
      label="お問い合わせ内容"
      rows={5}
      maxLength={MAX_LENGTH}
      hint={`${body.length} / ${MAX_LENGTH}文字`}
      value={body}
      onChange={(event) => setBody(event.target.value)}
    />
  );
}
