import MoveToInboxOutlinedIcon from "@mui/icons-material/MoveToInboxOutlined";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useLoanStore, type Loan } from "@/entities/loan";
import { todayString } from "@/shared/lib";
import { ConfirmDialog, notify } from "@/shared/ui";

/**
 * 「返却」ボタン ＋ 確認ダイアログ ── features/return-book/ui
 *
 *   <ReturnBookButton loan={currentLoan} bookTitle={book.title} />
 *
 * 返却は「今日の日付を returnedAt に入れる」だけ。記録は消さずに残す（履歴として見せる）。
 */

type ReturnBookButtonProps = {
  loan: Loan;
  /** 確認・通知の文に使う */
  bookTitle: string;
  size?: "small" | "medium";
};

export const ReturnBookButton = ({ loan, bookTitle, size = "medium" }: ReturnBookButtonProps) => {
  const [open, setOpen] = useState(false);
  const returnLoan = useLoanStore((state) => state.returnLoan);

  const handleConfirm = () => {
    returnLoan(loan.id, todayString());
    setOpen(false);
    notify(`「${bookTitle}」の返却を記録しました`);
  };

  return (
    <>
      <Button
        variant="outlined"
        size={size}
        startIcon={<MoveToInboxOutlinedIcon />}
        onClick={() => setOpen(true)}
        aria-label={`「${bookTitle}」を返却`}
      >
        返却
      </Button>
      <ConfirmDialog
        open={open}
        title="返却を記録しますか？"
        message={`${loan.borrower}さんに貸し出している「${bookTitle}」を、今日の日付で返却済みにします。`}
        confirmLabel="返却する"
        danger={false} // 削除ではないので、実行ボタンを赤にしない
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
