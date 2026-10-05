import { z } from "zod";

/**
 * 本（蔵書）の型 ── entities/book/model
 *
 * entities には「扱う対象」そのものの 型・状態（store）・表示 を置く。
 * 型は zod のスキーマから作る（z.infer）。こうすると
 *   - TypeScript の型
 *   - localStorage から読み込んだデータが正しい形かのチェック
 * を1つの定義で済ませられる。
 *
 * 「貸出中かどうか」は本の情報ではなく貸出（entities/loan）の情報なので、ここには持たない。
 */

// ---------- ジャンル（選択肢） ----------
// 選択肢は「値の配列」「表示名」「{ value, label } の配列」の3点セットで作る

// as const：string[] ではなく、値そのものの型（"novel" | "business" | …）として扱う
export const bookGenres = ["novel", "business", "tech", "design", "hobby", "other"] as const;

export type BookGenre = (typeof bookGenres)[number];

// Record<BookGenre, string>：ジャンルを増やしたときに、表示名の書き忘れを型エラーで気付ける
export const bookGenreLabels: Record<BookGenre, string> = {
  novel: "小説",
  business: "ビジネス",
  tech: "技術書",
  design: "デザイン",
  hobby: "趣味・実用",
  other: "その他",
};

// セレクト（MenuItem）・ToggleButton に並べる { value, label } の配列
export const bookGenreOptions = bookGenres.map((value) => ({
  value,
  label: bookGenreLabels[value],
}));

// ---------- 本 ----------

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  genre: z.enum(bookGenres),
  isbn: z.string(), // 任意。未入力は ""
  publishedYear: z.number().int().nullable(), // 任意。未入力は null（数値なので "" にできない）
  rating: z.number().int().min(0).max(5), // 0 は「未評価」
  tags: z.array(z.string()),
  memo: z.string(),
  createdAt: z.string(), // ISO 形式の日時。Date 型は JSON に保存できないので文字列で持つ
  updatedAt: z.string(),
});

export type Book = z.infer<typeof bookSchema>;

/**
 * 登録・更新のときにフォームから受け取る値
 *
 * id・日時は store で付けるので、フォームからは受け取らない（Omit で除く）。
 */
export type BookInput = Omit<Book, "id" | "createdAt" | "updatedAt">;
