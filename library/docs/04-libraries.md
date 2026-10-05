# 4. ライブラリの使い方

> [目次](README.md) ｜ 前：[3. モダン JavaScript / TypeScript](03-modern-js.md) ｜ 次：[5. 実装手順](05-implementation.md)

それぞれ「何をするものか → 最小の使い方 → このアプリでの使い方 → つまずき」の順に書く。
MUI の部品ごとの細かい使い方は [MUI 部品カタログ](../../mui-catalog/)、画面の組み立て方は [MUI 画面構築ガイド](../../mui-catalog/docs/README.md) を引く。

## 4-1. React（このアプリで使うフック）

### useState：コンポーネントの中の値

```tsx
const [open, setOpen] = useState(false);
setOpen(true); // 値を入れ替える
setOpen((prev) => !prev); // 今の値をもとに変える
```

state が変わると、そのコンポーネントがもう一度実行（再描画）される。**値は次の描画から変わる**ので、`setOpen(true)` の直後に `open` を読んでもまだ `false`。

### 計算できる値は、毎回計算する

```tsx
// ○ 描画のたびに計算する（books・loans・filter が変われば、自動で計算し直される）
const filteredBooks = filterBooks(books, currentLoans, filter, today);

// ✗ useState ＋ useEffect で「計算した値」を持たない（1 回ずれて描画され、更新し忘れのもと）
const [filteredBooks, setFilteredBooks] = useState([]);
useEffect(() => setFilteredBooks(filterBooks(…)), [books, filter]);
```

このアプリには `useEffect` が 1 つもない。**画面に出す値はほとんど「計算」で済む**。useEffect は、タイマー・イベントの登録など「React の外と同期する」ときだけ使う。

### カスタムフック：処理をまとめて使い回す

`use` で始まる関数の中でフックを使うと、カスタムフックになる。

```ts
// features/book-filter/model/useBookFilter.ts
export const useBookFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = parseBookFilter(searchParams); // URL → 条件
  const updateFilter = (changes: Partial<BookFilter>) =>
    setSearchParams(toSearchParams({ ...filter, ...changes, page: changes.page ?? 1 }), { replace: true });
  return { filter, updateFilter };
};
```

フックのルール：コンポーネント（かカスタムフック）の**一番上**で呼ぶ。`if` の中や、early return（`if (!book) return …`）の後では呼ばない。

### key：コンポーネントを作り直す

```tsx
<BookForm key={book.id} defaultValues={toFormInput(book)} … />
```

`key` が変わると、React はそのコンポーネントを捨てて作り直す（中の state もリセット）。編集ページで別の本に移ったとき、フォームの初期値を入れ替えるのに使う。

## 4-2. React Router

### URL とページの対応

```tsx
// app/App.tsx
<Routes>
  {/* path のない Route ＝ レイアウトルート。子のページを RootLayout の <Outlet /> に表示する */}
  <Route element={<RootLayout />}>
    <Route index element={<DashboardPage />} />           {/* "/" */}
    <Route path="/books" element={<BookListPage />} />
    <Route path="/books/new" element={<BookNewPage />} />  {/* "new" は :bookId より優先 */}
    <Route path="/books/:bookId" element={<BookDetailPage />} />
    <Route path="/books/:bookId/edit" element={<BookEditPage />} />
    <Route path="*" element={<NotFoundPage />} />          {/* どれにも一致しない URL */}
  </Route>
</Routes>
```

### MUI の部品をリンクにする：`component={RouterLink}`

```tsx
import { Link as RouterLink } from "react-router";

<Button component={RouterLink} to="/books/new" variant="contained">本を登録</Button>
<Link component={RouterLink} to={`/books/${book.id}`}>{book.title}</Link>   {/* MUI の Link */}
<ListItemButton component={NavLink} to="/books" end>本の一覧</ListItemButton> {/* 今のページに active が付く */}
<IconButton component={RouterLink} to={`/books/${book.id}/edit`} aria-label="編集"><EditIcon /></IconButton>
```

`href` のままだとページ全体を読み込み直し、state が消える。**アプリの中のリンクは必ず `component={RouterLink}` と `to`**。

### ページを移動する

| やりたいこと                     | 書き方                                                    |
| -------------------------------- | --------------------------------------------------------- |
| 押すとページが変わるだけ         | `<Button component={RouterLink} to="…">`（リンク）        |
| 保存などの処理のあとに移動       | `const navigate = useNavigate(); navigate("/books");`     |
| 履歴を残さずに移動（削除の後）   | `navigate("/books", { replace: true })`                   |
| 戻るボタンと同じ                 | `navigate(-1)`                                            |

### URL から値を受け取る

```tsx
// /books/abc → { bookId: "abc" }
const { bookId } = useParams<{ bookId: string }>();
const book = useBook(bookId); // 見つからなければ undefined → 「見つかりません」を表示する

// /books?q=漱石&page=2
const [searchParams, setSearchParams] = useSearchParams();
searchParams.get("q"); // "漱石"
setSearchParams({ tab: "overdue" }, { replace: true }); // URL を書き換える（replace：履歴を増やさない）
```

URL の値は手で書き換えられるので、**使う前に「選択肢のどれかか」「1 以上の整数か」を確かめる**（[bookFilter.ts](../src/features/book-filter/model/bookFilter.ts) の `parseBookFilter`）。

### ページの移動と store の更新の順番（useTransitions）

React Router は初期設定で、ページの移動を少し遅らせて反映する（React の `startTransition`）。Zustand の更新はすぐ反映されるので、**書いた順に動かない**ことがある（例：`navigate` してから store を変えたのに、store の変更が先に画面に出る）。
`<BrowserRouter useTransitions={false}>` にすると、どちらもすぐ反映され、書いた順に動く。このサンプル集はすべてこの設定にしている。

## 4-3. Zustand

### store を作る

```ts
import { create } from "zustand";

type LoanStore = {
  loans: Loan[]; // 値（state）
  addLoan: (input: LoanInput) => void; // 値の変え方（action）
  returnLoan: (id: string, returnedAt: string) => void;
};

// TypeScript では create<型>()(…) と ( ) を 2 回書く（ミドルウェアの型を正しく付けるため）
export const useLoanStore = create<LoanStore>()((set) => ({
  loans: [],
  addLoan: (input) =>
    set((state) => ({ loans: [{ ...input, id: crypto.randomUUID(), returnedAt: "" }, ...state.loans] })),
  returnLoan: (id, returnedAt) =>
    set((state) => ({ loans: state.loans.map((l) => (l.id === id ? { ...l, returnedAt } : l)) })),
}));
```

- `set((state) => ({ … }))`：今の state から次の state を作る。**返したキーだけが上書き**される
- 元の配列は書き換えず、新しい配列を作る（[3-3](03-modern-js.md#3-3-スプレッド構文-コピーして一部を変える)）
- action が値を返してもよい：`addBook` は作った本を返し、登録後に詳細ページへ移動するのに使う

### 画面で使う：セレクター

```tsx
const books = useBookStore((state) => state.books); // 値
const addBook = useBookStore((state) => state.addBook); // action
const loanCount = useLoanStore((s) => s.loans.filter((l) => l.bookId === id).length); // 数値は OK
const book = useBookStore((s) => s.books.find((b) => b.id === id)); // find も OK（同じオブジェクト）
```

**⚠ いちばん多いバグ：セレクターで新しい配列・オブジェクトを返す**

```tsx
// ✗ 呼ぶたびに新しい配列 → 毎回「変わった」と判断され、無限に再描画（Maximum update depth exceeded）
const myLoans = useLoanStore((s) => s.loans.filter((l) => l.bookId === id));

// ○ 元の値を選んでから、画面側で計算する
const loans = useLoanStore((s) => s.loans);
const myLoans = loans.filter((l) => l.bookId === id);
```

### persist：localStorage に保存する

```ts
import { createJSONStorage, persist } from "zustand/middleware";

export const useBookStore = create<BookState & BookActions>()(
  persist(
    (set) => ({ … }),                                  // 中身は persist なしと同じ
    {
      name: "library:books",                           // localStorage のキー（store ごとに変える）
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ books: state.books }), // 保存する値だけ（関数は保存できない）
      version: 1,
      merge: mergeWithSchema(z.object({ books: z.array(bookSchema) })), // 読み込んだ値を zod でチェック
    },
  ),
);
```

- state が変わるたびに自動で保存し、開いたときに自動で読み込む
- `merge`：persist は読み込んだ値をチェックしない。形の崩れた古いデータで画面が壊れないよう、zod でチェックする（[shared/lib/persist.ts](../src/shared/lib/persist.ts)）
- 保存された中身は DevTools の **Application → Local Storage** で見られる

### 保存しない store・React の外から使う

通知（スナックバー）の文言は保存しないので、`persist` を付けない。

```ts
// shared/ui/Notifier/notifierStore.ts
export const useNotifierStore = create<NotifierStore>()((set) => ({
  notification: null,
  open: false,
  show: (message, severity = "success") => set({ notification: { id: Date.now(), message, severity }, open: true }),
  close: () => set({ open: false }),
}));

// getState()：React の外（ふつうの関数）から store の値・action を取り出す
export const notify = (message: string, severity: AlertColor = "success") =>
  useNotifierStore.getState().show(message, severity);
```

これで、どのコンポーネントからでも `notify("登録しました")` と書くだけで通知が出る。Provider で包む必要もない。

## 4-4. zod

「データはこの形」というスキーマを書き、チェックする。

### よく使う書き方

| やりたいこと                     | 書き方                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------ |
| 必須の文字列                     | `z.string().trim().min(1, "…を入力してください").max(50, "…")`                 |
| 任意の文字列（入力があれば形式）  | `z.string().trim().refine((v) => v === "" \|\| /^\d{13}$/.test(v), "…")`        |
| セレクト（未選択 `""` を許す）   | `z.string().pipe(z.enum(bookGenres, { error: "…を選択してください" }))`         |
| 日付 `"YYYY-MM-DD"`（必須）      | `z.iso.date({ error: "…を入力してください" })`                                  |
| 今日以降                         | `.refine((v) => v >= today, "今日以降の日付を選んでください")`                  |
| 文字列で受け取って数値・null に  | `.transform((v) => (v === "" ? null : Number(v)))`                             |
| 失敗したら後ろのチェックをしない | `.refine(…, { error: "…", abort: true })`                                      |
| 配列の数                         | `z.array(z.string()).max(5, "5個までです")`                                     |
| 数値（評価）                     | `z.number().int().min(0).max(5)`                                                |
| 項目同士を比べる                 | `z.object({…}).refine((v) => v.end > v.start, { error: "…", path: ["end"] })`  |

### 型を作る

```ts
type BookFormInput = z.input<typeof bookFormSchema>; // チェック前（入力中の値）publishedYear: string
type BookFormValues = z.output<typeof bookFormSchema>; // チェック後（送信で受け取る値）publishedYear: number | null
type Book = z.infer<typeof bookSchema>; // z.output と同じ
```

`.transform()` や `.pipe()` を使うと、input と output の型が変わる。React Hook Form には両方を渡す（[4-5](#4-5-react-hook-form)）。

### スキーマの工場：条件で変わるチェック

「返却期限は今日から 30 日以内」は、今日によって変わる。今日の日付を受け取ってスキーマを作る関数にする。

```ts
export const createLendSchema = (today: string) =>
  z.object({
    borrower: z.string().trim().min(1, "借りる人の名前を入力してください"),
    dueDate: z
      .iso.date({ error: "返却期限を入力してください" })
      .refine((v) => v >= today, "今日以降の日付を選んでください")
      .refine((v) => v <= addDays(today, 30), "返却期限は今日から30日以内にしてください"),
  });

useForm({ resolver: zodResolver(createLendSchema(todayString())), … });
```

### チェックする

```ts
bookSchema.parse(data); // 合わなければ例外
const result = bookSchema.safeParse(data); // 例外を投げずに結果を返す
if (result.success) result.data;
else result.error;
```

## 4-5. React Hook Form

### 基本の形

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const {
  control, // MUI の部品とつなぐ（Controller・FormTextField に渡す）
  handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
  setValue, // JS から値を入れる
  formState: { isSubmitting },
} = useForm<BookFormInput, unknown, BookFormValues>({
  resolver: zodResolver(bookFormSchema), // チェックは zod に任せる
  defaultValues: toFormInput(), // 初期値（すべての項目を書く）
});

return (
  <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <FormTextField control={control} name="title" label="タイトル" required />
    <Button type="submit" variant="contained" loading={isSubmitting}>登録</Button>
  </Box>
);
```

- `useForm<入力中の型, unknown, チェック後の型>`：`transform` で型が変わるときは 3 つ目も書く
- `noValidate`：ブラウザ標準の吹き出しを止め、zod のエラー表示にそろえる

### MUI の入力欄は Controller でつなぐ

`register` は「中身が素の `<input>`」の部品向け。MUI の TextField は外枠と中の `<input>` が別なので、**`Controller`（`useController`）でつなぐのが確実**。

```tsx
<Controller
  control={control}
  name="title"
  render={({ field: { ref, ...field }, fieldState }) => (
    <TextField
      {...field} // value・onChange・onBlur・name
      inputRef={ref} // ref は中の <input> へ（エラー時にフォーカスが移る）
      label="タイトル"
      error={fieldState.error !== undefined} // 赤枠
      helperText={fieldState.error?.message} // エラー文
    />
  )}
/>
```

毎回同じ書き方になるので、[FormTextField](../src/shared/ui/FormTextField/FormTextField.tsx) にまとめている。

### 部品ごとのつなぎ方

| 部品                          | 書き方                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| 文字・数値・日付・複数行      | `<FormTextField control={control} name="…" type="date" multiline … />`                           |
| セレクト（1 つ選ぶ）          | `<FormTextField … select>` ＋ `<MenuItem value="…">`。未選択は `""`                             |
| ラジオボタン                  | `Controller` で `<RadioGroup {...field}>`                                                        |
| チェックボックス・スイッチ    | `checked={field.value}`・`onChange={(e) => field.onChange(e.target.checked)}`                    |
| Rating（星）                  | `value={field.value === 0 ? null : field.value}`・`onChange={(_e, v) => field.onChange(v ?? 0)}` |
| Autocomplete（複数・自由入力） | `value={field.value}`・`onChange={(_e, v) => field.onChange(v)}`・`renderInput` に TextField     |

Rating・Autocomplete のように `onChange` の**第 2 引数**に値が届く部品は、自分で `field.onChange(値)` を呼ぶ（[BookForm.tsx](../src/features/book-form/ui/BookForm.tsx)）。

### つまずき

- **`defaultValues` は最初の 1 回だけ使われる**。別の本の編集ページに移るときは `key={book.id}` でフォームを作り直す
- **ダイアログの中のフォームは、開くたびにまっさら**：MUI の Dialog は閉じると中身を消す（次に開いたときに作り直す）ので、`reset()` しなくてよい（[LendBookButton](../src/features/lend-book/ui/LendBookButton.tsx)）
- `setValue("dueDate", 値, { shouldValidate: true })`：JS から値を入れたとき、エラー表示も更新する
- 送信ボタンは `type="submit"`（MUI の Button の初期値は `"button"`）
- 入力中の値を画面に出したいときは `useWatch({ control, name: "…" })`

## 4-6. MUI

詳しくは [MUI 画面構築ガイド](../../mui-catalog/docs/README.md)。ここでは、このアプリを読むのに必要なことだけ。

### 読み込みと見た目の決め方

```tsx
import Button from "@mui/material/Button"; // 部品は 1 つずつ（default export）
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"; // アイコン

<Button variant="contained" color="error" startIcon={<DeleteOutlinedIcon />}>削除</Button>

// sx：その場のスタイル。数値は theme の単位（p: 2 = 16px、borderRadius: 1 = 8px）、色は theme の名前
<Box sx={{ p: 2, bgcolor: "background.paper", color: "text.secondary", display: { xs: "none", md: "block" } }} />
```

### 画面の組み立て

| やりたいこと                     | 部品                                                    |
| -------------------------------- | ------------------------------------------------------- |
| ページの幅を決めて中央に寄せる   | `<Container maxWidth="lg" sx={{ py: 3 }}>`              |
| 縦・横に並べて間隔をそろえる     | `<Stack spacing={3}>`・`<Stack direction="row" spacing={1}>` |
| カードを列に並べる               | `<Grid container spacing={2}>` ＋ `<Grid size={{ xs: 12, md: 4 }}>` |
| 白い面・枠線で囲む               | `<Card>`・`<Paper variant="outlined">`                  |
| 文字                             | `<Typography variant="h5" component="h1">`              |
| 表                               | `TableContainer > Table > TableHead / TableBody > TableRow > TableCell` |
| 状態のラベル                     | `<Chip label="期限切れ" color="error" size="small" />`  |
| 重ねて出す入力・確認             | `<Dialog open onClose>` ＋ DialogTitle・DialogContent・DialogActions |
| 操作の結果の通知                 | `Snackbar` ＋ `Alert`（このアプリは `notify()`）        |

### v9 の注意（古い記事の書き方が使えない）

| 古い書き方                               | v9 の書き方                                     |
| ---------------------------------------- | ----------------------------------------------- |
| `<TextField InputProps={{ … }}>`         | `slotProps={{ input: { … } }}`                  |
| `inputProps={{ min: 0 }}`                | `slotProps={{ htmlInput: { min: 0 } }}`         |
| `InputLabelProps={{ shrink: true }}`     | `slotProps={{ inputLabel: { shrink: true } }}`  |
| `<Grid item xs={12} md={6}>`             | `<Grid size={{ xs: 12, md: 6 }}>`               |
| `<Stack alignItems="center">`・`<Box mt={2}>` | `sx={{ alignItems: "center" }}`・`sx={{ mt: 2 }}` |
| `DeleteOutline`・`ErrorOutline`（アイコン） | `DeleteOutlined`・`ErrorOutlined`            |

---

> 次：[5. 実装手順](05-implementation.md)
