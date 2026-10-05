import { z } from "zod";
import { bookGenres, type Book } from "@/entities/book";

/**
 * 本の登録・編集フォームの入力チェック（zod） ── features/book-form/model
 *
 * フォームの値は「入力中の値（input）」と「チェック後の値（output）」で型が違うことがある。
 *   genre         … 入力中は未選択の "" もある（string）→ チェック後は "novel" | "business" | …
 *   publishedYear … 入力中は文字列（"2024" や ""）→ チェック後は number | null
 * z.input / z.output で、それぞれの型を取り出せる。
 */

const currentYear = new Date().getFullYear();

export const MAX_TAGS = 5;

export const bookFormSchema = z.object({
  // ----- 文字列（必須） -----
  // trim()：前後の空白を取り除いてからチェックする（空白だけの入力をはじく）
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(50, "50文字以内で入力してください"),
  author: z
    .string()
    .trim()
    .min(1, "著者を入力してください")
    .max(30, "30文字以内で入力してください"),

  // ----- セレクト -----
  // 文字列で受け取ってから、選択肢のどれかかを確かめる（初期値を未選択の "" にできるように）
  genre: z.string().pipe(z.enum(bookGenres, { error: "ジャンルを選択してください" })),

  // ----- 任意の文字列（形式のチェックつき） -----
  // 空ならそのまま通し、入力があれば「ハイフンを除いて13桁の数字か」を確かめる
  isbn: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{13}$/.test(value.replaceAll("-", "")),
      "ISBN は13桁の数字で入力してください（ハイフンは入れてもよい）",
    ),

  // ----- 任意の数値（文字列で受け取って、数値か null に変換する） -----
  publishedYear: z
    .string()
    .trim()
    // abort: true … このチェックで失敗したら、後ろのチェックをしない（エラー文が1つになる）
    .refine((value) => value === "" || /^\d{4}$/.test(value), {
      error: "4桁の西暦で入力してください",
      abort: true,
    })
    .refine(
      (value) => value === "" || (Number(value) >= 1900 && Number(value) <= currentYear),
      `1900〜${currentYear}年で入力してください`,
    )
    // transform：チェックを通った値を変換する。onSubmit には変換後の値（number | null）が届く
    .transform((value) => (value === "" ? null : Number(value))),

  // ----- 評価（Rating） -----
  rating: z.number().int().min(0).max(5),

  // ----- タグ（Autocomplete の複数選択）：文字列の配列 -----
  // 配列全体に対するチェックは、エラーが errors.tags.message に入るので表示しやすい
  tags: z
    .array(z.string())
    .max(MAX_TAGS, `タグは${MAX_TAGS}個までです`)
    .refine((tags) => tags.every((tag) => tag.length <= 20), "タグは1つ20文字以内で入力してください"),

  memo: z.string().trim().max(500, "500文字以内で入力してください"),
});

/** 入力中の値（useForm の defaultValues の型） */
export type BookFormInput = z.input<typeof bookFormSchema>;
/** チェックを通った後の値（onSubmit で受け取る型）。entities の BookInput と同じ形になる */
export type BookFormValues = z.output<typeof bookFormSchema>;

/**
 * フォームの初期値を作る
 *
 *   toFormInput()      … 新規登録：空欄
 *   toFormInput(book)  … 編集：今の値を入れておく
 */
export const toFormInput = (book?: Book): BookFormInput => ({
  title: book?.title ?? "",
  author: book?.author ?? "",
  genre: book?.genre ?? "",
  isbn: book?.isbn ?? "",
  // null（未入力）なら ""、数値なら文字列にする（入力欄の値は文字列）
  publishedYear: book?.publishedYear == null ? "" : String(book.publishedYear),
  rating: book?.rating ?? 0,
  tags: book?.tags ?? [],
  memo: book?.memo ?? "",
});
