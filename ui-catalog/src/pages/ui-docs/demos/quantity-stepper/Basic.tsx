import { useState } from "react";
import { QuantityStepper, Stack } from "@/shared/ui";

const PRICE = 180;
const STOCK = 5;

// 在庫数（max）より多くは増やせない。合計は数量から計算する（state にしない）
export default function QuantityStepperBasic() {
  const [quantity, setQuantity] = useState(1);

  return (
    <Stack direction="row" gap={4} align="center">
      <span>りんご（在庫 {STOCK}点）</span>
      <QuantityStepper
        label="りんごの数量"
        value={quantity}
        min={1}
        max={STOCK}
        onChange={setQuantity}
      />
      <strong>¥{PRICE * quantity}</strong>
    </Stack>
  );
}
