import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import type { Book } from "@/entities/book";
import { LendBookForm } from "./LendBookForm";

/**
 * 「貸し出す」ボタン ＋ 貸出フォームのダイアログ ── features/lend-book/ui
 *
 *   <LendBookButton book={book} />              // 詳細ページ
 *   <LendBookButton book={book} size="small" /> // 一覧の行
 *
 * 貸出中の本には表示しない（呼ぶ側で、今の貸出がないときだけ置く）。
 */

type LendBookButtonProps = {
  book: Book;
  size?: "small" | "medium";
};

export const LendBookButton = ({ book, size = "medium" }: LendBookButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        size={size}
        startIcon={<OutboxOutlinedIcon />}
        onClick={() => setOpen(true)}
        aria-label={`「${book.title}」を貸し出す`}
      >
        貸し出す
      </Button>
      {/* onClose：Esc・背景のクリックで閉じる */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <LendBookForm book={book} onDone={() => setOpen(false)} />
      </Dialog>
    </>
  );
};
