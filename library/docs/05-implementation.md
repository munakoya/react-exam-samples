# 5. 実装手順

> [目次](README.md) ｜ 前：[4. ライブラリの使い方](04-libraries.md) ｜ 次：[6. 実装時の考え方とつまずき](06-thinking.md)

**1 ステップ = 動く状態 = 1 コミット**。どのステップの終わりでも、アプリは動いている。
完成したコードは各ステップの「完成形」のリンク先にある。ここではコメントを省いた要点だけを載せる。

| ステップ | 作るもの                                   | 目安  |
| -------- | ------------------------------------------ | ----- |
| 1        | 環境構築・テーマ・ルーティング・共通の枠   | 15 分 |
| 2        | 本の型と store                             | 15 分 |
| 3        | 本の一覧（表）                             | 20 分 |
| 4        | 登録フォーム・登録ページ                   | 30 分 |
| 5        | 詳細・編集ページ                           | 20 分 |
| 6        | 削除・通知                                 | 15 分 |
| 7        | 貸出・返却・状態の表示                     | 35 分 |
| 8        | 絞り込み・並び替え・ページ送り（URL）      | 30 分 |
| 9        | 貸出一覧・ダッシュボード                   | 25 分 |
| 10       | 評価・タグ、削除の制限                     | 15 分 |

必須だけなら 1〜7（約 2 時間 30 分）。8 以降は発展。

---

## ステップ 1：環境構築・テーマ・ルーティング・共通の枠

[1. プロジェクトの作成](01-setup.md) の手順どおり。

**確認**：メニューで全ページを行き来できる。スマホ幅で ☰ が出て開閉できる。

```bash
git commit -m "環境構築（MUI・テーマ・ルーティング・共通の枠）"
```

完成形：[App.tsx](../src/app/App.tsx)・[RootLayout.tsx](../src/app/layouts/RootLayout.tsx)・[AppProviders.tsx](../src/app/providers/AppProviders.tsx)・[theme.ts](../src/app/styles/theme.ts)

---

## ステップ 2：本の型と store（entities/book）

### 選択肢と型

```ts
// src/entities/book/model/book.ts
// 選択肢は「値の配列」「表示名」「{ value, label } の配列」の 3 点セットで作る
export const bookGenres = ["novel", "business", "tech", "design", "hobby", "other"] as const;
export type BookGenre = (typeof bookGenres)[number];
export const bookGenreLabels: Record<BookGenre, string> = {
  novel: "小説", business: "ビジネス", tech: "技術書", design: "デザイン", hobby: "趣味・実用", other: "その他",
};
export const bookGenreOptions = bookGenres.map((value) => ({ value, label: bookGenreLabels[value] }));

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  genre: z.enum(bookGenres),
  isbn: z.string(),
  publishedYear: z.number().int().nullable(),
  rating: z.number().int().min(0).max(5),
  tags: z.array(z.string()),
  memo: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Book = z.infer<typeof bookSchema>;
export type BookInput = Omit<Book, "id" | "createdAt" | "updatedAt">;
```

### store

```ts
// src/entities/book/model/bookStore.ts
export const useBookStore = create<BookState & BookActions>()(
  persist(
    (set) => ({
      books: [],
      addBook: (input) => {
        const now = new Date().toISOString();
        const book: Book = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
        set((state) => ({ books: [book, ...state.books] }));
        return book; // 登録後に詳細ページへ移動するのに使う
      },
      updateBook: (id, input) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? { ...b, ...input, updatedAt: new Date().toISOString() } : b)),
        })),
      removeBook: (id) => set((state) => ({ books: state.books.filter((b) => b.id !== id) })),
    }),
    {
      name: storageKey("books"),
      partialize: (state) => ({ books: state.books }),
      merge: mergeWithSchema(z.object({ books: z.array(bookSchema) })),
    },
  ),
);

// id から 1 冊（find は同じオブジェクトを返すので、セレクターで使ってよい）
export const useBook = (id: string | undefined) => useBookStore((s) => s.books.find((b) => b.id === id));
```

`storageKey`・`mergeWithSchema` は [shared/config](../src/shared/config/storage.ts)・[shared/lib/persist.ts](../src/shared/lib/persist.ts) をコピーする。最後に `index.ts`（窓口）から export する。

**確認**：`npm run build` が通る。

```bash
git commit -m "本の型と store を作成"
```

完成形：[book.ts](../src/entities/book/model/book.ts)・[bookStore.ts](../src/entities/book/model/bookStore.ts)・[index.ts](../src/entities/book/index.ts)

---

## ステップ 3：本の一覧（表）

最初は絞り込みなしで、表を出すだけにする。並び替え・ページ送りはステップ 8。

```tsx
// src/pages/book-list/ui/BookListPage.tsx（最初の形）
export const BookListPage = () => {
  const books = useBookStore((state) => state.books);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title="本の一覧"
          action={<Button component={RouterLink} to="/books/new" variant="contained">本を登録</Button>}
        />
        {books.length === 0 ? (
          <EmptyState title="まだ本がありません" description="「本を登録」から追加してください。" />
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="本の一覧">
              <TableHead>
                <TableRow>
                  <TableCell>タイトル</TableCell>
                  <TableCell>著者</TableCell>
                  <TableCell>ジャンル</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id} hover>
                    <TableCell component="th" scope="row">
                      <Link component={RouterLink} to={`/books/${book.id}`}>{book.title}</Link>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{bookGenreLabels[book.genre]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
};
```

表は行の操作（貸出・削除）が増えると長くなるので、あとで `widgets/book-table` に移す。

**確認**：0 件の案内が出る。DevTools の Local Storage に手で本を入れると表に出る（ステップ 4 で登録できるようになる）。

```bash
git commit -m "本の一覧を表で表示"
```

---

## ステップ 4：登録フォーム・登録ページ

### スキーマ

```ts
// src/features/book-form/model/schema.ts
export const bookFormSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください").max(50, "50文字以内で入力してください"),
  author: z.string().trim().min(1, "著者を入力してください").max(30, "30文字以内で入力してください"),
  genre: z.string().pipe(z.enum(bookGenres, { error: "ジャンルを選択してください" })),
  isbn: z.string().trim().refine(
    (v) => v === "" || /^\d{13}$/.test(v.replaceAll("-", "")),
    "ISBN は13桁の数字で入力してください（ハイフンは入れてもよい）",
  ),
  publishedYear: z.string().trim()
    .refine((v) => v === "" || /^\d{4}$/.test(v), { error: "4桁の西暦で入力してください", abort: true })
    .refine((v) => v === "" || (Number(v) >= 1900 && Number(v) <= currentYear), `1900〜${currentYear}年で入力してください`)
    .transform((v) => (v === "" ? null : Number(v))),
  rating: z.number().int().min(0).max(5),
  tags: z.array(z.string()).max(5, "タグは5個までです"),
  memo: z.string().trim().max(500, "500文字以内で入力してください"),
});
export type BookFormInput = z.input<typeof bookFormSchema>;
export type BookFormValues = z.output<typeof bookFormSchema>;

export const toFormInput = (book?: Book): BookFormInput => ({
  title: book?.title ?? "",
  genre: book?.genre ?? "",
  publishedYear: book?.publishedYear == null ? "" : String(book.publishedYear),
  // …
});
```

### フォーム（入力とチェックだけ。保存はページに任せる）

```tsx
// src/features/book-form/ui/BookForm.tsx（評価・タグはステップ 10）
export const BookForm = ({ defaultValues, submitLabel, onSubmit, onCancel }: BookFormProps) => {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<BookFormInput, unknown, BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormTextField control={control} name="title" label="タイトル" required autoFocus />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <FormTextField control={control} name="author" label="著者" required />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormTextField control={control} name="genre" label="ジャンル" select required>
            {bookGenreOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </FormTextField>
        </Grid>
        {/* isbn・publishedYear・memo も同じ形 */}
      </Grid>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={onCancel}>キャンセル</Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>{submitLabel}</Button>
      </Stack>
    </Box>
  );
};
```

### 登録ページ

```tsx
// src/pages/book-new/ui/BookNewPage.tsx
const handleSubmit = (values: BookFormValues) => {
  const created = addBook(values);
  navigate(`/books/${created.id}`); // 登録した本の詳細へ
};

<BookForm defaultValues={toFormInput()} submitLabel="登録" onSubmit={handleSubmit} onCancel={() => navigate("/books")} />
```

**確認**：空で送信するとエラー（最初のエラーの欄にフォーカス）。正しく入れると登録され、再読み込みしても残る。

```bash
git commit -m "本の登録フォームと登録ページを作成"
```

完成形：[schema.ts](../src/features/book-form/model/schema.ts)・[BookForm.tsx](../src/features/book-form/ui/BookForm.tsx)・[BookNewPage.tsx](../src/pages/book-new/ui/BookNewPage.tsx)

---

## ステップ 5：詳細・編集ページ

```tsx
// src/pages/book-detail/ui/BookDetailPage.tsx（要点）
const { bookId } = useParams<{ bookId: string }>();
const book = useBook(bookId);

if (!book) {
  // 削除済み・URL の打ち間違い
  return <EmptyState title="本が見つかりません" action={<Button component={RouterLink} to="/books">本の一覧へ戻る</Button>} />;
}

return (
  <Container maxWidth="md" sx={{ py: 3 }}>
    <Stack spacing={3}>
      <PageHeader
        title={book.title}
        breadcrumbs={[{ label: "本の一覧", to: "/books" }, { label: book.title }]}
        action={<Button component={RouterLink} to={`/books/${book.id}/edit`} variant="outlined">編集</Button>}
      />
      <Card>
        <CardContent>
          <DescriptionList items={[{ term: "著者", description: book.author }, /* … */]} />
        </CardContent>
      </Card>
    </Stack>
  </Container>
);
```

編集ページは登録ページとほぼ同じ。違いは**初期値に今の値を入れる**ことと、**`updateBook` を呼ぶ**こと。

```tsx
// src/pages/book-edit/ui/BookEditPage.tsx
<BookForm
  key={book.id} // 別の本の編集ページへ移ったら、フォームを作り直して初期値を入れ替える
  defaultValues={toFormInput(book)}
  submitLabel="更新"
  onSubmit={(values) => {
    updateBook(book.id, values);
    navigate(`/books/${book.id}`);
  }}
  onCancel={() => navigate(`/books/${book.id}`)}
/>
```

**⚠ フックは early return の前に呼ぶ**：`useNavigate`・`useBook`・`useBookStore` は `if (!book) return …` より上に書く。

**確認**：一覧 → 詳細 → 編集 → 保存で詳細に戻り、値が変わっている。存在しない id の URL で「見つかりません」が出る。

```bash
git commit -m "本の詳細・編集ページを作成"
```

完成形：[BookDetailPage.tsx](../src/pages/book-detail/ui/BookDetailPage.tsx)・[BookEditPage.tsx](../src/pages/book-edit/ui/BookEditPage.tsx)

---

## ステップ 6：削除・通知

### 通知（Notifier）

`shared/ui/Notifier` をコピーし、`<Notifier />` を AppProviders に置く（[1-8](01-setup.md#1-8-provider-をまとめる)）。あとは `notify("…")` を呼ぶだけ。登録・更新のページにも `notify(\`「${created.title}」を登録しました\`)` を足す。

### 削除ボタン（features/delete-book）

```tsx
// src/features/delete-book/ui/DeleteBookButton.tsx（貸出との連携はステップ 10）
export const DeleteBookButton = ({ book, onDeleted }: Props) => {
  const [open, setOpen] = useState(false); // ダイアログの開閉はこのボタンの中だけ
  const removeBook = useBookStore((state) => state.removeBook);

  const handleConfirm = () => {
    setOpen(false);
    onDeleted?.(); // 先にページを移動してから消す（「見つかりません」が一瞬出ないように）
    removeBook(book.id);
    notify(`「${book.title}」を削除しました`);
  };

  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>削除</Button>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${book.title}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
```

```tsx
// 詳細ページ：削除したら一覧へ。replace で「戻る」で削除済みのページに戻らないように
<DeleteBookButton book={book} onDeleted={() => navigate("/books", { replace: true })} />
```

**確認**：キャンセルで何も起きない。削除で一覧に戻り、下に通知が出る。

```bash
git commit -m "本の削除（確認ダイアログ）と通知を追加"
```

完成形：[DeleteBookButton.tsx](../src/features/delete-book/ui/DeleteBookButton.tsx)・[Notifier](../src/shared/ui/Notifier/)

---

## ステップ 7：貸出・返却・状態の表示

### 貸出の型・store・状態の判定（entities/loan）

```ts
// src/entities/loan/model/loan.ts
export const loanSchema = z.object({
  id: z.string(), bookId: z.string(), borrower: z.string(),
  loanedAt: z.string(), dueDate: z.string(), returnedAt: z.string(), // 未返却は ""
});

export const isActiveLoan = (loan: Loan) => loan.returnedAt === "";

// 本から見た状態。保存せず、今の貸出と今日の日付から毎回計算する
export const getAvailability = (currentLoan: Loan | undefined, today: string): Availability => {
  if (!currentLoan) return "available";
  return currentLoan.dueDate < today ? "overdue" : "onLoan";
};

// 本の id → 今の貸出
export const getCurrentLoanMap = (loans: Loan[]) =>
  new Map(loans.filter(isActiveLoan).map((loan) => [loan.bookId, loan]));
```

store は本と同じ形（`addLoan`・`returnLoan(id, returnedAt)`）。キーは `storageKey("loans")`。
状態のラベル [AvailabilityChip](../src/entities/loan/ui/AvailabilityChip.tsx)・期限の表示 [DueDateLabel](../src/entities/loan/ui/DueDateLabel.tsx) も entities/loan に置く。

### 貸出のダイアログ（features/lend-book）

```tsx
// LendBookButton.tsx：ボタン ＋ Dialog。Dialog は閉じると中身を消すので、開くたびにフォームが新しくなる
<Button variant="contained" onClick={() => setOpen(true)}>貸し出す</Button>
<Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
  <LendBookForm book={book} onDone={() => setOpen(false)} />
</Dialog>
```

```tsx
// LendBookForm.tsx：<form> で DialogTitle・DialogContent・DialogActions を包む
const today = todayString();
const { control, handleSubmit, setValue } = useForm<LendFormValues>({
  resolver: zodResolver(createLendSchema(today)), // 今日の日付でスキーマを作る
  defaultValues: { borrower: "", dueDate: addDays(today, 14) },
});

const onSubmit = (values: LendFormValues) => {
  addLoan({ bookId: book.id, loanedAt: today, ...values });
  notify(`「${book.title}」を${values.borrower}さんに貸し出しました`);
  onDone();
};

<form onSubmit={handleSubmit(onSubmit)} noValidate>
  <DialogTitle>貸し出す：{book.title}</DialogTitle>
  <DialogContent>
    <FormTextField control={control} name="borrower" label="借りる人" required />
    <FormTextField control={control} name="dueDate" label="返却期限" type="date"
      slotProps={{ inputLabel: { shrink: true } }} />
    <Chip label="1週間" onClick={() => setValue("dueDate", addDays(today, 7), { shouldValidate: true })} />
  </DialogContent>
  <DialogActions>
    <Button onClick={onDone}>キャンセル</Button>
    <Button type="submit" variant="contained">貸し出す</Button>
  </DialogActions>
</form>
```

### 返却・一覧の状態

返却ボタン（[ReturnBookButton](../src/features/return-book/ui/ReturnBookButton.tsx)）は削除ボタンと同じ形で、確認のあと `returnLoan(loan.id, todayString())` を呼ぶ。

一覧の表に「状態」「返却期限」「操作」の列を足す。本と貸出の両方を使い、features（貸出・返却・削除）を並べるので、ここで表を `widgets/book-table` に移す。

```tsx
// 今の貸出があれば「返却」、なければ「貸し出す」
const loan = currentLoans.get(book.id);
<AvailabilityChip availability={getAvailability(loan, today)} />
{loan ? <ReturnBookButton loan={loan} bookTitle={book.title} size="small" /> : <LendBookButton book={book} size="small" />}
```

詳細ページには今の貸出の `Alert` と、貸出の履歴（[LoanHistoryTable](../src/entities/loan/ui/LoanHistoryTable.tsx)）を出す。

**確認**：貸し出すと状態が「貸出中」になる。期限を昨日にした貸出を Local Storage で作ると「期限切れ」で赤くなる。返却すると「貸出可」に戻り、履歴に残る。期限に 31 日後を入れるとエラー。

```bash
git commit -m "貸出・返却と、本の状態の表示を追加"
```

完成形：[entities/loan](../src/entities/loan/)・[features/lend-book](../src/features/lend-book/)・[features/return-book](../src/features/return-book/)・[widgets/book-table](../src/widgets/book-table/ui/BookTable.tsx)

---

## ステップ 8：絞り込み・並び替え・ページ送り（URL に残す）

### 条件 ⇄ URL（ふつうの関数）

```ts
// src/features/book-filter/model/bookFilter.ts（要点）
export type BookFilter = { q: string; genre: BookGenre | "all"; status: Availability | "all"; sort: BookSortKey; order: SortOrder; page: number; perPage: number };

export const parseBookFilter = (params: URLSearchParams): BookFilter => ({
  q: params.get("q") ?? "",
  genre: bookGenres.find((g) => g === params.get("genre")) ?? "all", // 選択肢のどれかでなければ "all"
  page: toPositiveInt(params.get("page")) ?? 1,
  // …
});

export const toSearchParams = (filter: BookFilter) => {
  const params = new URLSearchParams();
  if (filter.q !== "") params.set("q", filter.q); // 初期値と同じ項目は URL に書かない
  if (filter.page !== 1) params.set("page", String(filter.page));
  // …
  return params;
};

export const filterBooks = (books, currentLoans, filter, today) => books.filter((book) => …);
export const sortBooks = (books, sort, order) => books.toSorted(…);
```

### URL を読み書きするフック

```ts
// src/features/book-filter/model/useBookFilter.ts
export const useBookFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = parseBookFilter(searchParams); // URL が「正」。useState と二重に持たない
  const updateFilter = (changes: Partial<BookFilter>) =>
    setSearchParams(toSearchParams({ ...filter, ...changes, page: changes.page ?? 1 }), { replace: true });
  return { filter, updateFilter };
};
```

### ページで組み立てる

```tsx
// src/pages/book-list/ui/BookListPage.tsx
const { filter, updateFilter, resetFilter } = useBookFilter();
const currentLoans = getCurrentLoanMap(loans);
const filtered = filterBooks(books, currentLoans, filter, todayString());
const sorted = sortBooks(filtered, filter.sort, filter.order);
const pageCount = Math.max(1, Math.ceil(sorted.length / filter.perPage));
const page = Math.min(filter.page, pageCount);
const pageBooks = sorted.slice((page - 1) * filter.perPage, page * filter.perPage);

<BookFilterBar filter={filter} onChange={updateFilter} onReset={resetFilter} />
<BookTable books={pageBooks} sort={filter.sort} order={filter.order} onSortChange={…} count={sorted.length} page={page} … />
```

表の見出しは `TableSortLabel`、表の下は `TablePagination`。**TablePagination の page は 0 から**数えるので、1 から数えるこのアプリの page と ±1 する。

**確認**：条件を変えると URL が変わる。再読み込み・詳細から「戻る」でも同じ表示。並び順を変えると 1 ページ目に戻る。0 件のとき「条件をクリア」が出る。

```bash
git commit -m "検索・絞り込み・並び替え・ページ送りを追加（URL に残す）"
```

完成形：[features/book-filter](../src/features/book-filter/)・[BookListPage.tsx](../src/pages/book-list/ui/BookListPage.tsx)・[BookTable.tsx](../src/widgets/book-table/ui/BookTable.tsx)

---

## ステップ 9：貸出一覧・ダッシュボード

### 貸出一覧（タブを URL に持つ）

```tsx
// src/pages/loan-list/ui/LoanListPage.tsx
const tab = parseTab(searchParams.get("tab")); // "active" | "overdue" | "returned" | "all"

<Tabs value={tab} onChange={(_e, value) => setSearchParams(value === "active" ? {} : { tab: value }, { replace: true })}>
  {tabs.map((value) => <Tab key={value} value={value} label={`${tabLabels[value]}（${loansForTab(loans, value, today).length}）`} />)}
</Tabs>
<LoanTable loans={loansForTab(loans, tab, today)} today={today} />
```

`LoanTable`（widgets）は貸出の `bookId` から本のタイトルを探して表示する（`new Map(books.map((b) => [b.id, b]))`）。

### ダッシュボード（集計はすべて計算）

```tsx
const activeLoans = loans.filter(isActiveLoan);
const overdueLoans = activeLoans.filter((l) => l.dueDate < today);
const dueSoonLoans = activeLoans.filter((l) => l.dueDate >= today && diffDays(today, l.dueDate) <= 3);
const loanCountThisMonth = loans.filter((l) => l.loanedAt.startsWith(today.slice(0, 7))).length;

<Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 3 }}><StatCard label="蔵書" value={books.length} unit="冊" to="/books" /></Grid>
  <Grid size={{ xs: 6, md: 3 }}><StatCard label="期限切れ" value={overdueLoans.length} color={overdueLoans.length > 0 ? "error" : undefined} to="/loans?tab=overdue" /></Grid>
  {/* … */}
</Grid>
<LoanTable loans={overdueLoans} today={today} emptyMessage="期限切れの本はありません" />
```

**確認**：数字が一覧と合っている。「期限切れ」のカードから貸出一覧の期限切れタブが開く。

```bash
git commit -m "貸出一覧（タブ）とダッシュボードを追加"
```

完成形：[LoanListPage.tsx](../src/pages/loan-list/ui/LoanListPage.tsx)・[LoanTable.tsx](../src/widgets/loan-table/ui/LoanTable.tsx)・[DashboardPage.tsx](../src/pages/dashboard/ui/DashboardPage.tsx)

---

## ステップ 10：評価・タグ、削除の制限

### Rating・Autocomplete を Controller でつなぐ

```tsx
<Controller
  control={control}
  name="rating"
  render={({ field }) => (
    <Rating
      name={field.name}
      value={field.value === 0 ? null : field.value} // 0 = 未評価 → 星なし
      onChange={(_event, value) => field.onChange(value ?? 0)} // 同じ星を押すと null が届く
    />
  )}
/>

<Controller
  control={control}
  name="tags"
  render={({ field, fieldState }) => (
    <Autocomplete
      multiple
      freeSolo // 候補にない文字も Enter で追加できる
      options={tagOptions} // 全部の本のタグ（Set で重複を除く）
      value={field.value}
      onChange={(_event, value) => field.onChange(normalizeTags(value))}
      renderInput={(params) => (
        <TextField {...params} label="タグ" error={!!fieldState.error} helperText={fieldState.error?.message} />
      )}
    />
  )}
/>
```

### 貸出中は削除させない・貸出の記録も消す

```tsx
// DeleteBookButton.tsx に足す
const currentLoan = useCurrentLoan(book.id);
const removeLoansByBook = useLoanStore((s) => s.removeLoansByBook);

// 押せない理由を Tooltip で出す。disabled のボタンはマウスの動きを受け取らないので <span> で包む
<Tooltip title={currentLoan ? "貸出中の本は削除できません" : ""}>
  <span>
    <Button color="error" disabled={currentLoan !== undefined} …>削除</Button>
  </span>
</Tooltip>

// handleConfirm に足す（2 つの store を動かすので features に書く）
removeLoansByBook(book.id);
```

**確認**：評価・タグが保存され、編集で元に戻る。貸出中の本の削除ボタンが押せず、理由が出る。削除すると貸出一覧からも消える。

```bash
git commit -m "評価・タグの入力と、削除の制限を追加"
```

---

最後に [6-5 提出前のチェックリスト](06-thinking.md#6-5-提出前のチェックリスト) を確認する。

> 次：[6. 実装時の考え方とつまずき](06-thinking.md)
