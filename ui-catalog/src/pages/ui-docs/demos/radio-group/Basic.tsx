import { useState } from "react";
import { RadioGroup, Stack } from "@/shared/ui";

const plans = [
  { value: "free", label: "無料プラン" },
  { value: "standard", label: "スタンダード" },
  { value: "pro", label: "プロ" },
];

// value に選ばれている値を渡し、onChange で event.target.value を受け取る
export default function RadioGroupBasic() {
  const [plan, setPlan] = useState("free");

  return (
    <Stack gap={5}>
      <RadioGroup
        label="プラン"
        options={plans}
        value={plan}
        onChange={(event) => setPlan(event.target.value)}
      />
      {/* direction="row"：横に並べる */}
      <RadioGroup
        label="支払い方法"
        direction="row"
        options={[
          { value: "card", label: "クレジットカード" },
          { value: "bank", label: "銀行振込" },
        ]}
        defaultValue="card"
      />
    </Stack>
  );
}
