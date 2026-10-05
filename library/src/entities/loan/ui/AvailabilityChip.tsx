import Chip, { type ChipProps } from "@mui/material/Chip";
import { availabilityLabels, type Availability } from "../model/loan";

/**
 * 本の状態（貸出可・貸出中・期限切れ）のラベル ── entities/loan/ui
 *
 *   <AvailabilityChip availability={getAvailability(currentLoan, today)} />
 */

// 状態ごとの色。satisfies で「全部の状態がそろっているか」を型で確かめる
const availabilityColors = {
  available: "success",
  onLoan: "primary",
  overdue: "error",
} as const satisfies Record<Availability, ChipProps["color"]>;

export const AvailabilityChip = ({ availability }: { availability: Availability }) => {
  return (
    <Chip
      label={availabilityLabels[availability]}
      color={availabilityColors[availability]}
      // 貸出可は控えめに枠線、貸出中・期限切れは塗りつぶしで目立たせる
      variant={availability === "available" ? "outlined" : "filled"}
      size="small"
    />
  );
};
