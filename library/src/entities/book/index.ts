// entities/book の窓口（Public API）
//
// 外（features・widgets・pages）からは、このファイル経由で読み込む。
//   import { useBookStore, type Book } from "@/entities/book";
// model/・ui/ の中のファイルを直接 import しない（中の構成を変えても、外に影響しないように）。
export {
  bookGenreLabels,
  bookGenreOptions,
  bookGenres,
  bookSchema,
  type Book,
  type BookGenre,
  type BookInput,
} from "./model/book";
export { useBook, useBookStore } from "./model/bookStore";
export { BookAvatar } from "./ui/BookAvatar";
