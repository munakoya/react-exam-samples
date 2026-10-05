# 6. 画面パターン集

> [目次](README.md) ｜ 前：[5. ダイアログ・通知・メニュー](05-feedback.md)

試験のお題はほとんどが「一覧 → 詳細 → 登録・編集」＋「そのお題ならではの操作 1〜2 個」でできている。
画面の型を覚えておき、お題の名詞（本・商品・会員…）を入れ替えて使う。完成形は [蔵書管理（library）](../../library/)。

## 6-1. 一覧ページ

```text
┌──────────────────────────────────────────────┐
│ 本の一覧                          [本を登録] │ PageHeader
│ 全14冊・貸出中5冊                            │
│ [キーワード🔍] [ジャンル▼] [すべて|貸出可|…] │ 絞り込み（Stack direction="row"）
│ 14件 / 全14件                                │
│ ┌──────────────────────────────────────────┐ │
│ │ タイトル↑ │ ジャンル │ 状態 │ 操作        │ │ Table ＋ TableSortLabel
│ │ 坊っちゃん │ 小説     │ 貸出中│ [返却][✎][🗑]│ │
│ └──────────────────────────────────────────┘ │
│                       1ページの行数 10 ▼ 1-10 │ TablePagination
└──────────────────────────────────────────────┘
```

```tsx
export const BookListPage = () => {
  const books = useBookStore((state) => state.books); // 元のデータを選ぶ（セレクターで filter しない）
  const { filter, updateFilter, resetFilter } = useBookFilter(); // 条件（URL か useState）

  // 表示する分は計算で求める
  const filtered = filterBooks(books, filter);
  const sorted = sortBooks(filtered, filter.sort, filter.order);
  const pageItems = sorted.slice((filter.page - 1) * filter.perPage, filter.page * filter.perPage);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="本の一覧" action={<Button component={RouterLink} to="/books/new" variant="contained">本を登録</Button>} />
        {books.length === 0 ? (
          <EmptyState title="まだ本がありません" />
        ) : (
          <>
            <BookFilterBar filter={filter} onChange={updateFilter} onReset={resetFilter} />
            <Typography variant="body2" color="text.secondary">{filtered.length}件 / 全{books.length}件</Typography>
            {filtered.length === 0 ? (
              <EmptyState title="条件に合う本がありません" action={<Button onClick={resetFilter}>条件をクリア</Button>} />
            ) : (
              <BookTable books={pageItems} … />
            )}
          </>
        )}
      </Stack>
    </Container>
  );
};
```

| 置き場所（FSD）           | 中身                                           |
| ------------------------- | ---------------------------------------------- |
| `pages/book-list`         | 上の組み立て                                   |
| `widgets/book-table`      | 表（行の操作として features を並べる）         |
| `features/book-filter`    | 条件の型・URL との読み書き・絞り込みの関数・バー |
| `features/delete-book` など | 行の操作ボタン                               |
| `entities/book`           | 型・store・状態の判定・状態のラベル            |

## 6-2. 詳細ページ

```text
┌──────────────────────────────────────────────┐
│ 本の一覧 > 坊っちゃん                        │ Breadcrumbs
│ 坊っちゃん              [返却] [編集] [削除] │ PageHeader の action
│ ⚠ 佐藤さんに貸出中。返却期限を6日過ぎています │ Alert
│ ┌──────────────────────────────────────────┐ │
│ │ 著者   夏目漱石                          │ │ Card ＋ DescriptionList
│ │ 評価   ★★★★☆                            │ │
│ └──────────────────────────────────────────┘ │
│ 貸出の履歴（2件）                            │ Typography h6 component="h2"
│ ┌ 借りた人 │ 貸出日 │ 返却期限 │ 返却日 ┐    │ Table
└──────────────────────────────────────────────┘
```

```tsx
export const BookDetailPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const book = useBook(bookId); // フックは early return より上で呼ぶ
  const loans = useLoanStore((state) => state.loans);

  if (!book) {
    return <EmptyState title="本が見つかりません" action={<Button component={RouterLink} to="/books">一覧へ戻る</Button>} />;
  }

  const bookLoans = loans.filter((loan) => loan.bookId === book.id);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title={book.title}
          breadcrumbs={[{ label: "本の一覧", to: "/books" }, { label: book.title }]}
          action={
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to={`/books/${book.id}/edit`} variant="outlined">編集</Button>
              <DeleteBookButton book={book} onDeleted={() => navigate("/books", { replace: true })} />
            </Stack>
          }
        />
        <Card><CardContent><DescriptionList items={[…]} /></CardContent></Card>
        <Typography variant="h6" component="h2">貸出の履歴</Typography>
        <LoanHistoryTable loans={bookLoans} />
      </Stack>
    </Container>
  );
};
```

## 6-3. 登録・編集ページ

```tsx
// 登録
<Container maxWidth="sm" sx={{ py: 3 }}>
  <Stack spacing={3}>
    <PageHeader title="本を登録" breadcrumbs={[{ label: "本の一覧", to: "/books" }, { label: "本を登録" }]} />
    <Card>
      <CardContent>
        <BookForm
          defaultValues={toFormInput()}
          submitLabel="登録"
          onSubmit={(values) => {
            const created = addBook(values);
            notify(`「${created.title}」を登録しました`);
            navigate(`/books/${created.id}`);
          }}
          onCancel={() => navigate("/books")}
        />
      </CardContent>
    </Card>
  </Stack>
</Container>

// 編集：初期値に今の値・key で作り直す・updateBook を呼ぶ
<BookForm key={book.id} defaultValues={toFormInput(book)} submitLabel="更新" onSubmit={…} onCancel={…} />
```

フォームの中は [3. フォーム](03-forms.md)。

## 6-4. ダッシュボード

```text
┌ 蔵書 14冊 ┐┌ 貸出中 5冊 ┐┌ 期限切れ 2冊 ┐┌ 今月 2件 ┐   StatCard を Grid で（xs:6 / md:3）
期限切れの本                                              LoanTable
返却期限が近い本（3日以内）                               LoanTable
最近登録した本  [カード][カード][カード][カード]          Grid ＋ Card
```

```tsx
// 数字はすべて計算。store に件数を保存しない
const overdue = loans.filter((l) => l.returnedAt === "" && l.dueDate < today);

<Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 3 }}>
    <StatCard label="期限切れ" value={overdue.length} unit="冊" color={overdue.length > 0 ? "error" : undefined} to="/loans?tab=overdue" />
  </Grid>
  {/* … */}
</Grid>
```

グラフは要件になければ作らない。割合なら `LinearProgress variant="determinate" value={率}` で十分。

## 6-5. タブで分ける一覧

```tsx
const tab = parseTab(searchParams.get("tab")); // URL に持つと、ほかの画面から直接開ける
<Tabs value={tab} onChange={(_e, v) => setSearchParams({ tab: v }, { replace: true })} variant="scrollable">
  <Tab value="active" label={`貸出中（${activeCount}）`} />
  <Tab value="overdue" label={`期限切れ（${overdueCount}）`} />
</Tabs>
<LoanTable loans={loansForTab(loans, tab)} />
```

## 6-6. 手順に分ける入力（Stepper）

購入・申し込みのように「入力 → 確認 → 完了」と進む画面。

```tsx
const steps = ["お届け先", "支払い方法", "確認"];
const [activeStep, setActiveStep] = useState(0);

<Stepper activeStep={activeStep} sx={{ mb: 3 }}>
  {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
</Stepper>
{activeStep === 0 && <AddressForm onNext={(values) => { setAddress(values); setActiveStep(1); }} />}
{activeStep === 1 && <PaymentForm onBack={() => setActiveStep(0)} onNext={…} />}
{activeStep === 2 && <Confirm onBack={…} onSubmit={placeOrder} />}
```

1 つの `useForm` で全部の項目を持ち、ステップごとに `trigger(["name", "zip"])` でその分だけチェックしてもよい。
完了後に別ページへ移動するなら `navigate("/orders/complete", { replace: true })`（戻るで入力に戻らない）。

## 6-7. お題ごとの部品の選び方

| お題                   | そのお題ならではの操作・表示                 | よく使う部品                                                                                 |
| ---------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| タスク管理・Todo       | 状態の切り替え・期限切れ・ボード             | List（チェック）・Chip（優先度）・ToggleButtonGroup（絞り込み）・Grid 3 列（ボード）         |
| 在庫管理               | 入出庫・在庫少の警告                         | Table・Chip（在庫の状態）・Dialog（入出庫）・Alert（要発注）・TextField type="number"       |
| EC・ショップ           | カート・合計・購入                           | Grid ＋ Card（CardMedia）・Badge（カートの数）・QuantityStepper・Stepper（購入）・Drawer（カート） |
| 予約・スケジュール     | 時間の重なり・定員                           | TextField type="date"/"time"・Table か CSS Grid（時間割）・Alert（重複）                     |
| 蔵書・貸出             | 貸出・返却・期限切れ                         | Table・Dialog（貸出）・Chip（状態）・Tabs（貸出一覧）・StatCard                              |
| ユーザ（会員）管理     | 権限・有効/無効・検索                        | Table・Avatar・Switch（有効）・Select（権限）・Autocomplete（検索）                          |
| アルバム・ギャラリー   | 画像の一覧・拡大                             | ImageList か Grid ＋ CardMedia・Dialog（拡大）・Rating・Chip（タグ）                         |
| 注文管理               | 注文の状態の変更・明細                       | Table・Chip（状態）・Select（状態の変更）・Accordion か Collapse（明細）                     |
| 受講管理・成績         | 進み具合・出席                               | LinearProgress（進み具合）・Checkbox（出席）・Table・Tabs                                    |
| 掲示板・コメント       | 投稿・返信・いいね                           | List ＋ Avatar・TextField multiline・IconButton（いいね）・Pagination                        |
| 家計簿                 | 収入・支出・月の合計                         | ToggleButtonGroup（収入/支出）・TextField type="month"・StatCard（合計）・LinearProgress（予算） |

## 6-8. 組み立ての順番（どの画面でも同じ）

1. `Container` ＋ `Stack` ＋ `PageHeader` で骨組み（中身は仮の文字）
2. 一覧を表で出す（0 件なら EmptyState）
3. 登録ページとフォーム → 詳細 → 編集 → 削除
4. お題ならではの操作（Dialog か、ページ）
5. 絞り込み・並び替え・ページ送り
6. Chip・Alert・StatCard で見やすくする
7. スマホ幅の確認（`direction={{ xs: "column", sm: "row" }}`、表は TableContainer）

---

> [目次へ戻る](README.md)
