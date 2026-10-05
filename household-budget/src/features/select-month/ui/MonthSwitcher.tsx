import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { addMonths, formatMonth, thisMonthString } from "@/shared/lib";

/**
 * 表示する月の切り替え（‹ 2026年10月 › ［今月］） ── features/select-month/ui
 *
 *   const { month, setMonth } = useSelectedMonth();
 *   <MonthSwitcher month={month} onChange={setMonth} />
 */

type MonthSwitcherProps = {
  month: string;
  onChange: (month: string) => void;
};

export const MonthSwitcher = ({ month, onChange }: MonthSwitcherProps) => {
  const isThisMonth = month === thisMonthString();

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <IconButton aria-label="前の月" onClick={() => onChange(addMonths(month, -1))}>
        <ChevronLeftIcon />
      </IconButton>
      {/* aria-live：月が変わったことを読み上げで伝える */}
      <Typography variant="h6" component="p" aria-live="polite" sx={{ minWidth: 130, textAlign: "center", fontWeight: 700 }}>
        {formatMonth(month)}
      </Typography>
      <IconButton aria-label="次の月" onClick={() => onChange(addMonths(month, 1))}>
        <ChevronRightIcon />
      </IconButton>
      {!isThisMonth && (
        <Button size="small" onClick={() => onChange(thisMonthString())}>
          今月
        </Button>
      )}
    </Stack>
  );
};
