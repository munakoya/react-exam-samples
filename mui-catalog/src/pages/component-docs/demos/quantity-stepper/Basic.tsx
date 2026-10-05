import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { QuantityStepper } from "@/shared/ui";

const PRICE = 150;
const STOCK = 5;

// 値は親（このコンポーネント）が持ち、QuantityStepper は onChange で新しい値を伝えるだけ
export default function QuantityStepperBasic() {
  const [quantity, setQuantity] = useState(1);

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Typography>りんご（在庫 {STOCK}）</Typography>
      <QuantityStepper label="りんごの数量" value={quantity} min={1} max={STOCK} onChange={setQuantity} />
      <Typography sx={{ fontWeight: "bold" }}>{(PRICE * quantity).toLocaleString()}円</Typography>
    </Stack>
  );
}
