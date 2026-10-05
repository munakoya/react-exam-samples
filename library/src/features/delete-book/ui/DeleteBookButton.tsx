import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useBookStore, type Book } from "@/entities/book";
import { useCurrentLoan, useLoanStore } from "@/entities/loan";
import { ConfirmDialog, notify } from "@/shared/ui";

/**
 * 「削除」ボタン ＋ 確認ダイアログ ── features/delete-book/ui
 *
 * features には「ユーザーの操作（〜する）」を1つずつ置く。
 * 押す → 確認 → 本と貸出の記録を消す → 通知、までをこの部品が持つので、
 * 一覧でも詳細でも <DeleteBookButton book={book} /> と書くだけで同じ動きになる。
 *
 * 本（entities/book）と貸出（entities/loan）の2つの store を動かす。
 * entities 同士は import し合えないので、両方を使う処理は features に書く。
 *
 *   <DeleteBookButton book={book} variant="icon" />                       // 一覧の行
 *   <DeleteBookButton book={book} onDeleted={() => navigate("/books")} /> // 詳細ページ
 */

type DeleteBookButtonProps = {
  book: Book;
  /** button：文字のボタン / icon：ゴミ箱のアイコンだけ */
  variant?: "button" | "icon";
  /** 削除した後に呼ばれる（詳細ページから一覧へ戻るときなど） */
  onDeleted?: () => void;
};

export const DeleteBookButton = ({ book, variant = "button", onDeleted }: DeleteBookButtonProps) => {
  // ダイアログの開閉は、このボタンの中だけで使うので useState で持つ（store に入れない）
  const [open, setOpen] = useState(false);
  const removeBook = useBookStore((state) => state.removeBook);
  const removeLoansByBook = useLoanStore((state) => state.removeLoansByBook);

  // 貸出中の本は削除させない（貸出の記録が宙に浮くため）
  const currentLoan = useCurrentLoan(book.id);
  // セレクターで数値（length）を返すのは OK（配列を返すと無限に再描画される）
  const loanCount = useLoanStore(
    (state) => state.loans.filter((loan) => loan.bookId === book.id).length,
  );
  const disabled = currentLoan !== undefined;

  const handleConfirm = () => {
    setOpen(false);
    // 先にページを移動してから消す（詳細ページで「見つかりません」が一瞬出ないように）
    onDeleted?.();
    removeBook(book.id);
    removeLoansByBook(book.id); // 本と一緒に、その本の貸出の記録も消す
    notify(`「${book.title}」を削除しました`);
  };

  const label = `「${book.title}」を削除`;

  return (
    <>
      {/*
        押せない理由を Tooltip で出す。disabled のボタンはマウスの動きを受け取らないので <span> で包む。
        title が "" のときは Tooltip は出ない
      */}
      <Tooltip title={disabled ? "貸出中の本は削除できません" : variant === "icon" ? "削除" : ""}>
        <span>
          {variant === "icon" ? (
            // アイコンだけのボタンは、aria-label で何のボタンかを伝える
            <IconButton aria-label={label} color="error" disabled={disabled} onClick={() => setOpen(true)}>
              <DeleteOutlinedIcon />
            </IconButton>
          ) : (
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlinedIcon />}
              disabled={disabled}
              onClick={() => setOpen(true)}
              aria-label={label}
            >
              削除
            </Button>
          )}
        </span>
      </Tooltip>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={
          loanCount > 0
            ? `「${book.title}」と、貸出の記録（${loanCount}件）を削除します。この操作は取り消せません。`
            : `「${book.title}」を削除します。この操作は取り消せません。`
        }
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
