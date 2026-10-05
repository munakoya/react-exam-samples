import Typography from "@mui/material/Typography";
import { diffDays, formatDate } from "@/shared/lib";
import { isActiveLoan, type Loan } from "../model/loan";

/**
 * 返却期限の表示（「2026/10/10（あと 3日）」「2026/10/01（5日超過）」） ── entities/loan/ui
 *
 *   <DueDateLabel loan={loan} today={today} />
 *
 * 返却済みなら期限だけを出す。期限切れは赤、3日以内はオレンジにする。
 */

/** 期限が近いとみなす日数 */
export const DUE_SOON_DAYS = 3;

export const DueDateLabel = ({ loan, today }: { loan: Loan; today: string }) => {
  if (!isActiveLoan(loan)) {
    return <Typography variant="body2">{formatDate(loan.dueDate)}</Typography>;
  }

  const days = diffDays(today, loan.dueDate); // 期限まであと何日（過ぎていればマイナス）
  const note = days < 0 ? `${-days}日超過` : days === 0 ? "今日まで" : `あと${days}日`;
  const color = days < 0 ? "error.main" : days <= DUE_SOON_DAYS ? "warning.main" : "text.primary";

  return (
    <Typography variant="body2" sx={{ color, fontWeight: days <= DUE_SOON_DAYS ? 700 : undefined }}>
      {formatDate(loan.dueDate)}（{note}）
    </Typography>
  );
};
