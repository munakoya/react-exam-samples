import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { bookSchema, type Book, type BookInput } from "./book";

/**
 * 本の一覧を持つ store（Zustand ＋ persist ミドルウェア） ── entities/book/model
 *
 * store ＝「共有する値（state）」と「その値の変え方（action）」をまとめたもの。
 * どのコンポーネントから useBookStore を呼んでも、同じ一覧を見る。
 *
 * persist を挟むと、state が変わるたびに localStorage へ自動で保存し、
 * ページを開いたときに自動で読み込む。保存・読み込みのコードは書かなくてよい。
 *
 * ---------- 画面での使い方 ----------
 *   const books = useBookStore((state) => state.books);        // 値
 *   const addBook = useBookStore((state) => state.addBook);    // action
 *
 *   // ⚠ セレクターの中で filter / map をしない（毎回新しい配列になり、無限に再描画される）
 *   const novels = useBookStore((state) => state.books.filter(…)); // NG
 */

type BookState = {
  books: Book[];
};

type BookActions = {
  /** 追加して、作った本を返す（登録後に詳細ページへ移動するときに id を使う） */
  addBook: (input: BookInput) => Book;
  updateBook: (id: string, input: BookInput) => void;
  removeBook: (id: string) => void;
  /** まとめて追加する（サンプルデータの読み込み用） */
  addBooks: (books: Book[]) => void;
};

export const useBookStore = create<BookState & BookActions>()(
  persist(
    (set) => ({
      books: [],

      // set((state) => ({ … }))：今の state から次の state を作る。
      // 元の配列は書き換えず、新しい配列を作って返す（イミュータブルな更新）
      addBook: (input) => {
        const now = new Date().toISOString();
        const book: Book = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
        set((state) => ({ books: [book, ...state.books] })); // 先頭に追加（新しい順）
        return book;
      },

      updateBook: (id, input) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...input, updatedAt: new Date().toISOString() } : book,
          ),
        })),

      removeBook: (id) => set((state) => ({ books: state.books.filter((book) => book.id !== id) })),

      addBooks: (books) => set((state) => ({ books: [...books, ...state.books] })),
    }),
    {
      name: storageKey("books"), // localStorage のキー
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ books: state.books }), // 保存する値だけ（関数は保存できない）
      version: 1, // 保存する形を変えたら上げる
      // 読み込んだ値を zod でチェックし、形が崩れていたら初期値で始める（shared/lib/persist.ts）
      merge: mergeWithSchema(z.object({ books: z.array(bookSchema) })),
    },
  ),
);

/**
 * id から本を1件取り出す（見つからなければ undefined）
 *
 * find は配列の中の「同じオブジェクト」を返すので、セレクターで使っても無限再描画にならない。
 */
export const useBook = (id: string | undefined) =>
  useBookStore((state) => state.books.find((book) => book.id === id));
