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

`Map` は「**キー → 値**」の対応表（メモ）。試験では、**2 つのデータを id でつなぐ**ときと、**id ごとに数を足し合わせる**ときによく使う。

> 配列の `.map()`（1 つずつ変換する）とは**別物**。名前が同じだけで関係ない。

### Map の基本

```js
const memo = new Map(); // 空のメモを作る

memo.set("p1", 10); // 書く：キー "p1" → 値 10（同じキーなら上書き）
memo.get("p1"); // 読む：10
memo.get("p9"); // まだ書いていない → undefined
memo.has("p1"); // あるか：true
memo.size; // 件数：1
memo.delete("p1"); // 消す
```

配列から一気に作るときは、`[キー, 値]` の組の配列を渡す。

```js
const books = [
  { id: "b1", title: "坊っちゃん" },
  { id: "b2", title: "こころ" },
];
const bookMap = new Map(books.map((book) => [book.id, book]));
//                        ↑ 配列の .map で [id, 本] の組を作り、それを Map に渡す

bookMap.get("b2"); // { id: "b2", title: "こころ" }
bookMap.get("b2")?.title; // "こころ"
```

### 使い方 ①：id で相手を探す（2 つのデータをつなぐ）

貸出の記録には `bookId` しかない。表に本のタイトルを出すには、id から本を探す必要がある。

```js
// ✕ 行ごとに find：貸出 1 件ごとに、本の一覧を先頭から見直す
loans.map((loan) => books.find((book) => book.id === loan.bookId));

// ○ 先に「id → 本」の表を 1 回作り、あとは get で一発
const bookMap = new Map(books.map((book) => [book.id, book]));
loans.map((loan) => {
  const book = bookMap.get(loan.bookId);
  const title = book?.title ?? "（削除された本）"; // 相手が見つからない場合も必ず考える
  return { ...loan, title };
});
```

貸出が 100 件・本が 1000 冊だと、`find` は最悪 10 万回比べる。Map なら作るのに 1000 回、引くのに 100 回で済む。
このアプリでは：[LoanTable.tsx](../src/widgets/loan-table/ui/LoanTable.tsx) の `bookMap`、[loan.ts](../src/entities/loan/model/loan.ts) の `getCurrentLoanMap`（本の id → 今の貸出）。

### 使い方 ②：id ごとに数を足し合わせる（集計）

例：商品・仕入れ・販売のデータから、商品ごとの在庫数を出す。

```js
const products = [
  { id: "p1", name: "りんご" },
  { id: "p2", name: "みかん" },
  { id: "p3", name: "ぶどう" }, // まだ仕入れも販売もしていない
];
const purchases = [ // 仕入れ
  { productId: "p1", quantity: 10 },
  { productId: "p2", quantity: 5 },
  { productId: "p1", quantity: 20 },
];
const sales = [ // 販売
  { productId: "p1", quantity: 8 },
  { productId: "p1", quantity: 4 },
];
```

手で計算するときと同じく、**① 仕入れを商品ごとに足す → ② 販売を商品ごとに足す → ③ 仕入れ − 販売**。

#### まずは素直に書く（これで十分）

```js
const toStockRows = (products, purchases, sales) =>
  products.map((product) => {
    let purchased = 0;
    for (const p of purchases) {
      if (p.productId === product.id) purchased += p.quantity; // この商品の仕入れだけ足す
    }
    let sold = 0;
    for (const s of sales) {
      if (s.productId === product.id) sold += s.quantity; // この商品の販売だけ足す
    }
    return { ...product, stock: purchased - sold };
  });
```

商品ごとに、仕入れ・販売の一覧を**毎回最初から**見直している。数百件ならこれで困らない。

#### Map で書く（先にメモを作る）

仕入れの一覧を **1 回だけ** 見て、「商品ごとの合計」のメモを作っておく。

```js
const sumByProduct = (records) => {
  const memo = new Map(); // 空のメモ
  for (const record of records) {
    const before = memo.get(record.productId) ?? 0; // ① 今までの合計を読む（まだなければ 0）
    const after = before + record.quantity; //          ② 今回の数を足す
    memo.set(record.productId, after); //               ③ メモに書き戻す
  }
  return memo;
};
```

「**読む → 足す → 書き戻す**」。メモ帳の数字を消して、足した数を書き直すのと同じ。仕入れで動かすと、メモはこう変わる。

```text
はじめ                                   メモ：（空）
p1 を 10 個 → 読む 0  → 足して 10 を書く   メモ：p1=10
p2 を 5 個  → 読む 0  → 足して 5 を書く    メモ：p1=10, p2=5
p1 を 20 個 → 読む 10 → 足して 30 を書く   メモ：p1=30, p2=5
```

あとは商品ごとにメモを見て引き算するだけ。

```js
const toStockRows = (products, purchases, sales) => {
  const purchasedMemo = sumByProduct(purchases); // p1=30, p2=5
  const soldMemo = sumByProduct(sales); //         p1=12

  return products.map((product) => {
    const purchased = purchasedMemo.get(product.id) ?? 0;
    const sold = soldMemo.get(product.id) ?? 0;
    return { ...product, purchased, sold, stock: purchased - sold };
  });
};
// → りんご 30 − 12 = 18、みかん 5 − 0 = 5、ぶどう 0 − 0 = 0
```

| ポイント                     | 理由                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `?? 0`                       | 記録が 1 件もない商品はメモにない（`undefined`）。0 にしないと在庫が `NaN` になる          |
| **商品（products）から**行を作る | 仕入れから作ると、まだ仕入れていない商品（ぶどう）が表から消える。表の 1 行 ＝ 1 商品 |
| 在庫を**保存しない**         | 仕入れ − 販売 で必ず出せる。保存すると、仕入れ・販売のたびに書き換える処理が要り、ずれる |
| 1 行に詰めない               | `memo.set(id, (memo.get(id) ?? 0) + n)` は同じ意味だが読みにくい。慣れるまでは 3 行で書く |

素直な書き方と Map の書き方は**結果が同じ**。試験ではまず素直に書いて動かし、余裕があれば Map にする。

### 画面ではどう使うか

つないだ結果・集計した結果は **store に保存せず、描画のたびに計算**する（[2 章](02-design.md) の「計算できるものは持たない」）。

```tsx
const products = useProductStore((s) => s.products);
const purchases = usePurchaseStore((s) => s.purchases);
const sales = useSaleStore((s) => s.sales);
const rows = toStockRows(products, purchases, sales); // 仕入れ・販売が増えれば自動で計算し直される
```

| 状況                                                       | 書く場所                                       |
| ---------------------------------------------------------- | ---------------------------------------------- |
| 1 か所で表示するだけ                                       | コンポーネントの中                             |
| つないだ値で並び替え・絞り込みする、2 か所以上で使う       | `model/` の関数（`toStockRows` のような）      |
| 複数の store を読む部分まで、何画面でも繰り返す            | カスタムフック（中で `model/` の関数を呼ぶ）   |

- ⚠ **セレクターの中で計算しない**：`useStore((s) => toStockRows(s.products, …))` は毎回新しい配列を返し、無限に再描画される。配列を取り出してから、外で計算する
- 2 つ以上の entities をまたぐ計算は entities には書かない（entities どうしは import しない）。使う側の widgets・features の `model/` に置く

### Map とオブジェクト、どちらを使うか

`Object.fromEntries(books.map((b) => [b.id, b]))` でも同じことはできるが、「id から探す表」なら Map がおすすめ。

|                  | Map                                                        | オブジェクト                                     |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| ないキーの型     | `get` が `Book \| undefined` になり、「ないかも」に気付ける | `obj["b9"]` が `Book` 型のままで、気付けない     |
| キー             | 何でも（数値・オブジェクトも）                             | 文字列だけ                                       |
| JSON・localStorage | **そのまま保存できない**                                 | 保存できる                                       |

Map は**計算の途中で使う道具**。store に入れて persist したり、`JSON.stringify` したりはしない（`{}` になって中身が消える）。保存するのは元の配列だけにする。

### Set：「含まれているか」と重複の除去

`Set` は**値だけの集まり**（重複なし）。

```js
const selected = new Set(["u1", "u3"]);
selected.has("u1"); // true … 含まれているか（配列の includes より速い）

[...new Set(["古典", "名作", "古典"])]; // ["古典", "名作"] … 重複を取り除いて配列に戻す
```

|       | 持つもの   | 使いどころ                                 |
| ----- | ---------- | ------------------------------------------ |
| `Map` | キー → 値  | id から本・ユーザーを**取り出す**、id ごとに**集計する** |
| `Set` | 値だけ     | id が**含まれているか**調べる、重複を除く  |

このアプリでは：[BookForm.tsx](../src/features/book-form/ui/BookForm.tsx) のタグ（入力されたタグの重複を除く・全部の本のタグから候補を作る）。ユーザー管理の [DataTable.tsx](../../user-management/src/shared/ui/DataTable/DataTable.tsx) では、選択中の id を `Set` にして行ごとに `has` で調べている。

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
