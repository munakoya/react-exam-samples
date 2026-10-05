import Avatar from "@mui/material/Avatar";
import type { Book, BookGenre } from "../model/book";

/**
 * 本の表紙の代わりのアイコン（タイトルの1文字目 ＋ ジャンルの色） ── entities/book/ui
 *
 * entities の ui は「見せ方」だけを持ち、操作（ボタン）は持たない。
 *
 *   <BookAvatar book={book} />
 */

// ジャンルごとの背景色。theme の palette の名前で書く
// as const satisfies：全ジャンルがそろっているかを型で確かめ、値は "primary.main" などの文字列のまま残す
const genreColors = {
  novel: "primary.main",
  business: "secondary.main",
  tech: "info.main",
  design: "warning.main",
  hobby: "success.main",
  other: "grey.500",
} as const satisfies Record<BookGenre, string>;

type BookAvatarProps = {
  book: Pick<Book, "title" | "genre">; // Pick：使う項目だけを受け取る（テストやサンプルで渡しやすい）
  size?: number;
};

export const BookAvatar = ({ book, size = 40 }: BookAvatarProps) => {
  return (
    // variant="rounded"：角丸の四角（本らしく見せる）。文字は読み上げ不要なので aria-hidden
    <Avatar
      variant="rounded"
      aria-hidden
      sx={{ bgcolor: genreColors[book.genre], width: size, height: size * 1.3, fontWeight: 700 }}
    >
      {book.title.slice(0, 1)}
    </Avatar>
  );
};
