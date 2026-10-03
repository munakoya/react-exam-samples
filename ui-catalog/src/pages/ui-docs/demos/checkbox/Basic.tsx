import { useState } from "react";
import { Button, Checkbox, Stack } from "@/shared/ui";

// チェックボックスは value ではなく checked と event.target.checked を使う
export default function CheckboxBasic() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Stack gap={3} align="start">
      <Checkbox
        label="利用規約に同意する"
        checked={agreed}
        onChange={(event) => setAgreed(event.target.checked)}
      />
      <Button disabled={!agreed}>次へ</Button>
    </Stack>
  );
}
