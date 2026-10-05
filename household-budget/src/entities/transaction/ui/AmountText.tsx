import Typography, { type TypographyProps } from "@mui/material/Typography";
import { formatYen } from "@/shared/lib";
import type { TransactionType } from "../model/transaction";

/**
 * 金額の表示（収入は緑で ＋、支出は赤で −） ── entities/transaction/ui
 *
 *   <AmountText type="expense" amount={1200} />  → −￥1,200（赤）
 */

type AmountTextProps = {
  type: TransactionType;
  amount: number;
} & Pick<TypographyProps, "variant">;

export const AmountText = ({ type, amount, variant = "body2" }: AmountTextProps) => (
  <Typography
    component="span"
    variant={variant}
    sx={{
      color: type === "income" ? "success.main" : "error.main",
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums", // 数字の幅をそろえる（表で桁がずれない）
      whiteSpace: "nowrap",
    }}
  >
    {type === "income" ? "＋" : "−"}
    {formatYen(amount)}
  </Typography>
);
