# 3. モダン JavaScript / TypeScript

> [目次](README.md) ｜ 前：[2. 設計の考え方](02-design.md) ｜ 次：[4. ライブラリの使い方](04-libraries.md)

このアプリのコードに出てくる書き方だけを、例と一緒にまとめる。
「このアプリでは」の行に、実際に使っている場所を書いた。

## 3-1. 変数と関数

```js
const limit = 30; // 再代入しない値は const（基本はこれ）
let count = 0; // 再代入する値だけ let。var は使わない

// アロー関数：(引数) => 戻り値
const double = (n) => n * 2;
const greet = (name) => {
  const text = `${name}さんに貸し出しました`; // テンプレートリテラル：`…${式}…`
  return text;
};

// オブジェクトを返すときは ( ) で包む（{ だけだと関数の中身の始まりと区別できない）
const toOption = (value) => ({ value, label: labels[value] });
```

- `{ value, label: … }` の `value` は `value: value` の省略形（プロパティの短縮記法）
- このアプリでは：コンポーネントも action もすべてアロー関数。選択肢の `{ value, label }` は [book.ts](../src/entities/book/model/book.ts) の `bookGenreOptions`

## 3-2. 分割代入：オブジェクト・配列から取り出す

```js
const loan = { id: "1", borrower: "佐藤", dueDate: "2026-10-19" };

const { borrower, dueDate } = loan; // borrower = "佐藤"
const { borrower: name } = loan; // 別の名前で取り出す
const { returnedAt = "" } = loan; // なければ初期値

const [year, month, day] = "2026-10-05".split("-").map(Number); // 2026, 10, 5
```

React では毎回使う。

```tsx
const LendBookButton = ({ book, size = "medium" }: Props) => { … }; // props（初期値つき）
const [open, setOpen] = useState(false);                            // [値, 変える関数]
const { field: { ref, ...field }, fieldState } = useController(…);  // ネスト ＋ 残りをまとめる
```

`...field` は「`ref` 以外の残り全部」をまとめたオブジェクト（残余構文）。

このアプリでは：`"YYYY-MM-DD"` を年・月・日に分ける [shared/lib/date.ts](../src/shared/lib/date.ts) の `parseDate`。

## 3-3. スプレッド構文 `...`：コピーして一部を変える

```js
const updated = { ...loan, returnedAt: "2026-10-10" }; // コピーして returnedAt だけ上書き
const loans2 = [newLoan, ...loans]; // 先頭に追加した新しい配列
```

### なぜ「コピーして変える」のか（イミュータブルな更新）

React と Zustand は「前と同じオブジェクトか」で、変わったかどうかを判断する。

```js
// ✗ 元の配列を書き換える → 同じ配列のままなので、画面が更新されない
state.loans.push(newLoan);
loan.returnedAt = "2026-10-10";

// ○ 新しい配列・オブジェクトを作る
set((state) => ({ loans: [newLoan, ...state.loans] }));
set((state) => ({
  loans: state.loans.map((l) => (l.id === id ? { ...l, returnedAt } : l)),
}));
```

このアプリでは：[loanStore.ts](../src/entities/loan/model/loanStore.ts) の `returnLoan`（id が一致する 1 件だけ差し替える）。

## 3-4. `?.`（オプショナルチェーン）と `??`（Null 合体）

```js
book?.title; // book が null / undefined なら undefined（エラーにならない）
book?.title ?? ""; // 左が null / undefined なら右
```

`??` と `||` の違い：`||` は `0` や `""` も「なし」扱いにする。

```js
0 || 1; // 1（評価 0 が消える）
0 ?? 1; // 0
```

このアプリでは：

```ts
// フォームの初期値（features/book-form/model/schema.ts）。編集なら今の値、新規なら初期値
rating: book?.rating ?? 0,
// 出版年：null（未入力）なら ""、数値なら文字列に。== null は null と undefined の両方に当てはまる
publishedYear: book?.publishedYear == null ? "" : String(book.publishedYear),

// 削除の後に呼ぶ関数（渡されていなければ何もしない）
onDeleted?.();
```

## 3-5. 配列のメソッド

どれも**元の配列を変えずに**、新しい値を返す（`sort` を除く）。

```js
loans.filter((l) => l.returnedAt === ""); // 条件に合うものだけ
loans.map((l) => l.borrower); // 1 つずつ変換
loans.find((l) => l.bookId === id); // 最初の 1 件（なければ undefined）
loans.some((l) => l.dueDate < today); // 1 つでも合えば true
loans.filter(…).length; // 件数
[book.title, book.author, ...book.tags].some((t) => t.includes(keyword)); // どれかに含まれるか

books.flatMap((b) => b.tags); // [["古典"], ["React","入門"]] を ["古典","React","入門"] に（map ＋ 平らにする）
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6（1 つの値にまとめる）
items.slice(10, 20); // 11 番目〜20 番目（ページの切り出し）
```

### 並び替え：`toSorted` を使う

```js
const sorted = books.toSorted((a, b) => a.title.localeCompare(b.title, "ja"));
```

- `sort()` は**元の配列を書き換える**。store の配列に使うと state を壊すので、新しい配列を返す `toSorted()` を使う
- 比較関数は「a を前にしたいなら負の数、b を前にしたいなら正の数」を返す
- 数値は `a - b`（小さい順）、文字列は `a.localeCompare(b)`、逆順は結果に `-1` を掛ける

このアプリでは：[bookFilter.ts](../src/features/book-filter/model/bookFilter.ts) の `sortBooks`

```ts
const compareFns = {
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
  title: (a, b) => a.title.localeCompare(b.title, "ja"),
  rating: (a, b) => a.rating - b.rating,
};
// 比較関数を「小さい順」で書いておき、desc のときは結果を逆にする
books.toSorted((a, b) => (order === "asc" ? 1 : -1) * compareFns[sort](a, b));
```

### ページの切り出し

```js
const pageCount = Math.max(1, Math.ceil(total / perPage)); // 全ページ数（最低 1）
const page = Math.min(requestedPage, pageCount); // 範囲外なら最後のページ
const pageItems = items.slice((page - 1) * perPage, page * perPage);
```

このアプリでは：[BookListPage.tsx](../src/pages/book-list/ui/BookListPage.tsx)

## 3-6. `Map` と `Set`

### Map：キーから値をすぐ取り出す

```js
// 本の id → 今の貸出
const currentLoans = new Map(loans.filter(isActive).map((loan) => [loan.bookId, loan]));

currentLoans.get(book.id); // その本の今の貸出（なければ undefined）
currentLoans.has(book.id); // 貸出中か
currentLoans.size; // 貸出中の冊数
```

一覧で本ごとに `loans.find(…)` すると「本の数 × 貸出の数」だけ探すことになる。先に Map を作っておくと、`get` ですぐ取り出せる。
このアプリでは：[loan.ts](../src/entities/loan/model/loan.ts) の `getCurrentLoanMap`、[LoanTable.tsx](../src/widgets/loan-table/ui/LoanTable.tsx) の `bookMap`。

### Set：重複を取り除く

```js
[...new Set(["古典", "名作", "古典"])]; // ["古典", "名作"]
```

このアプリでは：[BookForm.tsx](../src/features/book-form/ui/BookForm.tsx) のタグ（入力されたタグの重複を除く・全部の本のタグから候補を作る）。

## 3-7. JSX の中の条件分岐

```tsx
{currentLoan && <Alert>貸出中</Alert>}                                  // あれば表示（&&）
{currentLoan ? <ReturnBookButton … /> : <LendBookButton … />}          // どちらかを表示（三項演算子）
```

⚠ `&&` の左が数値の `0` だと、画面に `0` が出る。`{loans.length > 0 && …}` のように真偽値にする。

一覧の `key` には重複しない id を使う（`key={book.id}`）。配列の番号（index）は並び替えで崩れるので避ける。

## 3-8. モジュール（import / export）

```ts
export const BookForm = () => { … };              // 名前付き export（このアプリはすべてこれ）
export { BookForm } from "./ui/BookForm";          // まとめて外へ出す（index.ts：窓口）
import type { Book } from "@/entities/book";       // 型だけを読み込む（ビルド後に消える）
import { useBookStore, type Book } from "@/entities/book"; // 値と型をまとめて
import Button from "@mui/material/Button";        // MUI の部品は default export
import { Link as RouterLink } from "react-router"; // 名前がぶつかるときは as で別名にする
```

`Link` は MUI にも React Router にもあるので、React Router の方を `RouterLink` と別名にしている。

## 3-9. 日付と id

```js
crypto.randomUUID(); // 重複しない id（"3b241101-e2bb-…"）
new Date().toISOString(); // 今の日時（保存用）"2026-10-05T09:00:00.000Z"（UTC）
```

### 「今日」と日付の計算

```js
// ⚠ toISOString は UTC。日本時間の 0〜9 時は「前の日」になる
new Date().toISOString().slice(0, 10); // ✗「今日」には使わない

// 今日の "YYYY-MM-DD"（端末の地域の日付）
const d = new Date();
`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//                     ↑ getMonth は 0 始まり（1 月 = 0）     ↑ padStart：2 桁にそろえる（"3" → "03"）

// ⚠ new Date("2026-10-05") は UTC の 0 時として読まれる。地域の 0 時にするなら年・月・日に分けて渡す
new Date(2026, 10 - 1, 5);

// n 日後：setDate に足した日を入れる（月末を超えても繰り上げてくれる）
date.setDate(date.getDate() + 14);

// 日数の差：ミリ秒の差 ÷ 1 日のミリ秒
Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
```

`"YYYY-MM-DD"` は桁がそろっているので、**文字列のまま大小を比べると日付の前後になる**。

```js
"2026-10-02" < "2026-10-05"; // true → 期限切れの判定（loan.dueDate < today）
"2026-10-05".slice(0, 7); // "2026-10" → 今月の判定（loanedAt.startsWith(thisMonth)）
```

このアプリでは：[shared/lib/date.ts](../src/shared/lib/date.ts)（`todayString`・`addDays`・`diffDays`）。

### 表示の整形：Intl

```js
new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
  .format(new Date("2026-10-05T09:05:00.000Z")); // "2026/10/05 18:05"（日本時間）
```

## 3-10. URL の検索条件：URLSearchParams

```js
const params = new URLSearchParams("?q=漱石&page=2");
params.get("q"); // "漱石"
params.get("genre"); // null（ない）
params.set("sort", "title"); // 足す・書き換える
params.delete("page"); // 消す
params.toString(); // "q=%E6%BC%B1%E7%9F%B3&sort=title"
```

URL の値は**いつも文字列か null**。数値なら `Number(…)` で変換し、おかしな値でないかを確かめる。

```js
const toPositiveInt = (value) => {
  const n = Number(value); // "abc" → NaN、null → 0
  return Number.isInteger(n) && n >= 1 ? n : undefined;
};
```

このアプリでは：[bookFilter.ts](../src/features/book-filter/model/bookFilter.ts) の `parseBookFilter`・`toSearchParams`。

## 3-11. TypeScript の型

### 基本

```ts
type Loan = { id: string; returnedAt: string };
type Availability = "available" | "onLoan" | "overdue"; // ユニオン型：このどれか
let year: number | null = null; // null もありうる
```

### 配列から型を作る：`as const` ＋ `typeof`

```ts
export const bookGenres = ["novel", "business", "tech"] as const;
export type BookGenre = (typeof bookGenres)[number]; // "novel" | "business" | "tech"
```

**値（配列）と型を 1 か所で定義できる**。ジャンルを足すときは配列に足すだけで、型も変わる。

### よく使う型の道具

```ts
// Record<キー, 値>：キーがすべてそろったオブジェクト（書き忘れると型エラー）
const bookGenreLabels: Record<BookGenre, string> = { novel: "小説", business: "ビジネス", tech: "技術書" };

type BookInput = Omit<Book, "id" | "createdAt" | "updatedAt">; // Omit：キーを除く
type Props = { book: Pick<Book, "title" | "genre"> }; // Pick：キーだけ選ぶ
const changes: Partial<BookFilter> = { page: 2 }; // Partial：すべてを「なくてもよい」に
type LendFormValues = z.output<ReturnType<typeof createLendSchema>>; // 関数の戻り値の型

// satisfies：型のチェックだけして、値の型（"success" など）はそのまま残す
const colors = { available: "success", onLoan: "primary", overdue: "error" } as const satisfies Record<
  Availability,
  ChipProps["color"]
>;
```

### 型の絞り込み

```ts
// find は「配列の要素の型」を返すので、string を "novel" | … に絞り込める
const genre = bookGenres.find((g) => g === urlValue) ?? "all"; // BookGenre | "all"

// ジェネリクス：<T> で「呼ぶ側の型」を受け取る関数
const pick = <T extends string>(options: readonly T[], value: string | null) =>
  options.find((option) => option === value); // T | undefined
```

このアプリでは：URL の値を選択肢に絞り込む [bookFilter.ts](../src/features/book-filter/model/bookFilter.ts) の `pick`。

### React・MUI でよく出る型

```ts
import type { ReactNode } from "react";
import type { ChipProps } from "@mui/material/Chip";
import type { SelectChangeEvent } from "@mui/material/Select";

type Props = {
  children: ReactNode; // JSX・文字列・null など、表示できるもの全部
  onChange: (changes: Partial<BookFilter>) => void; // 関数の型
  color: ChipProps["color"]; // 部品の props の型の一部を取り出す
};
```

---

> 次：[4. ライブラリの使い方](04-libraries.md)
