# 2. app と shared

> [目次](README.md) ｜ 前：[1. 全体の地図](01-map.md) ｜ 次：[3. entities と features](03-entities-features.md)

いちばん上の層（app）と、いちばん下の層（shared）を読む。
どちらも「ユーザー管理らしさ」がほとんどない土台なので、**ほかのお題でもほぼ同じものを書く**。

各ファイルは次の形で説明する。

- **何を書いているか**：ファイルの中身
- **なぜここか**：その層・フォルダに置く理由
- **ポイント**：読み落としやすい行

---

## 2-1. 設定ファイル（プロジェクトの直下）

### [index.html](../index.html)

- **何を書いているか**：`<div id="root">` と `<script type="module" src="/src/main.tsx">` だけ。`lang="ja"`、タイトル
- **ポイント**：`<link rel="icon" href="data:," />` は空のアイコン。これがないとブラウザが `favicon.ico` を探して 404 のエラーをコンソールに出す

### [vite.config.ts](../vite.config.ts) と [tsconfig.app.json](../tsconfig.app.json)

- **何を書いているか**：`"@"` → `src` の別名。`import … from "@/entities/user"` と書けるようにする
- **なぜ 2 か所か**：vite.config は「実際にファイルを探す」設定、tsconfig の `paths` は「型チェックでファイルを探す」設定。**両方そろえないと動かない**
- **ポイント**：tsconfig の `noUnusedLocals`・`noUnusedParameters` で、使っていない変数があると `npm run build` が失敗する。使わない引数は `_event` のように `_` を付ける（[UserListPage.tsx](../src/pages/user-list/ui/UserListPage.tsx) の `onChange={(_event, next) => …}`）

### [.oxlintrc.json](../.oxlintrc.json)

- `react/rules-of-hooks`：フックを `if` の中や `return` の後で呼ぶとエラーにする（[4 章](04-widgets-pages.md) の詳細ページで大事になる）
- `react/only-export-components`：1 つのファイルからコンポーネント以外も export すると、開発中の自動更新（HMR）が効きにくくなるので警告する

---

## 2-2. src/main.tsx（起点）

[main.tsx](../src/main.tsx)

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
```

- **何を書いているか**：React を `#root` に描画する。それだけ
- **なぜここか**：起点はなるべく薄くする。Provider は `AppProviders` に、ルートは `App` に分けておくと、どちらも 1 ファイルで読める
- **ポイント**
  - `!`（非 null アサーション）：`getElementById` は `null` を返すかもしれない型なので、「必ずある」と TypeScript に伝える
  - CSS を import していない。リセット CSS は MUI の `CssBaseline`、色は `theme.ts` が受け持つ
  - `StrictMode` は開発中だけコンポーネントを 2 回描画する。`console.log` が 2 回出ても正常

---

## 2-3. app/（アプリに 1 つしかないもの）

### [app/App.tsx](../src/app/App.tsx) ── ルーティング

```tsx
<Routes>
  <Route element={<RootLayout />}>
    <Route index element={<Navigate to="/users" replace />} />
    <Route path="/users" element={<UserListPage />} />
    <Route path="/users/:id" element={<UserDetailPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

- **何を書いているか**：URL とページの対応表
- **なぜここか**：URL の一覧はアプリに 1 つ。ページ（pages）を全部 import できるのは、pages より上の app だけ
- **ポイント**
  - **`path` のない `<Route element={<RootLayout />}>`**＝レイアウトルート。中の子ルートのページが、`RootLayout` の `<Outlet />` の位置に表示される。だからヘッダーとメニューはどのページでも出る
  - **`index`**＝親と同じ URL（`/`）。`/` に来たら `/users` へ移動させる
  - **`replace`**：履歴に `/` を残さない。残すと「戻る」で `/` に戻った瞬間にまた `/users` へ飛ばされ、戻れなくなる
  - **`:id`**＝URL パラメータ。`/users/u1` なら、詳細ページで `useParams()` が `{ id: "u1" }` を返す
  - **`*`**＝どれにも一致しないとき。必ず最後に書く（ただし React Router は順番ではなく「具体的な方」を優先するので、書く位置で壊れることはない）

### [app/layouts/RootLayout.tsx](../src/app/layouts/RootLayout.tsx) ── 全ページ共通の枠

```tsx
const navItems: AppShellNavItem[] = [{ to: "/users", label: "ユーザー一覧", icon: <PeopleOutlinedIcon /> }];

export const RootLayout = () => (
  <AppShell title="ユーザー管理" navItems={navItems} homeTo="/users" headerRight={<SamplesTopLink />}>
    <Outlet />
  </AppShell>
);
```

- **何を書いているか**：shared/ui の `AppShell`（ヘッダー＋サイドメニュー）に、このアプリのタイトルとメニューを渡す
- **なぜここか**：枠の**見た目と動き**は `AppShell`（shared）にあり、ユーザー管理とは関係ない。「タイトルは〇〇、メニューは△△」という**このアプリだけの中身**を決めるのが app の役目
- **ポイント**
  - `navItems` をコンポーネントの外に書いている。中身が変わらない値は外に置くと、描画のたびに作り直さない
  - `<SamplesTopLink />` は公開ページ用（「← サンプル集」のリンク）。**試験では不要**
  - メニューが 1 つしかないので、`/users/:id` を開いているときも「ユーザー一覧」が選択中に見える（`NavLink` は `/users` で始まる URL を選択中にする。`end` を付けると完全一致のときだけになる）

### [app/providers/AppProviders.tsx](../src/app/providers/AppProviders.tsx) ── 全体を包む Provider

```tsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  <BrowserRouter basename={basename} useTransitions={false}>
    {children}
    <Notifier />
  </BrowserRouter>
</ThemeProvider>
```

| 部品            | 役割                                                                 | ないとどうなる                                     |
| --------------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| `ThemeProvider` | 中の MUI の部品が `theme.ts` の色・設定を使う                        | MUI の初期の青になる。ボタンが大文字になる         |
| `CssBaseline`   | ブラウザごとの差をなくす。body の余白を消し、背景を theme の色にする | body に 8px の余白、背景が白                       |
| `BrowserRouter` | URL を読み、`useNavigate`・`<Link>`・`useSearchParams` を使えるようにする | それらを使った瞬間にエラー                     |
| `Notifier`      | `notify("…")` の通知を出す場所                                       | `notify` を呼んでも何も出ない                      |

- **なぜここか**：アプリ全体を 1 回だけ包めばよいもの。main.tsx に並べると読みにくいのでまとめた
- **ポイント**
  - `basename`：GitHub Pages のように `/react-exam-samples/user-management/` の下に置くときのため。手元では `"/"`。**試験では `<BrowserRouter>` だけでよい**
  - `useTransitions={false}`：React Router は初期設定でページの移動を少し遅らせて反映する。Zustand の更新はすぐ反映されるので、「store を変えてから navigate」のような書き方で順番がずれることがある。`false` にすると書いた順に反映される
  - Zustand の store は Provider が要らない。だからここには store の Provider がない

### [app/styles/theme.ts](../src/app/styles/theme.ts) ── テーマ

- **何を書いているか**：色（`palette`）、角丸（`shape`）、文字（`typography`）、部品の初期設定（`components`）、日本語化（`jaJP`）
- **なぜここか**：アプリ全体の見た目を 1 か所で決める。部品では `"#4f46e5"` のように色を直接書かず、`"primary.main"` と名前で使う。theme を変えれば全体が変わる
- **ポイント**

| 書いてあること                                           | 効果                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------ |
| `button: { textTransform: "none" }`                      | ボタンの文字を大文字にしない（MUI の初期設定は英字を大文字にする）       |
| `MuiButton: { defaultProps: { disableElevation: true } }`| 全部のボタンを影なしにする。毎回 props を書かなくてよい                  |
| `MuiCard: { defaultProps: { variant: "outlined" } }`     | カードを枠線で区切る                                                     |
| `MuiTableCell: { styleOverrides: { head: … } }`          | 表の見出しを太字・折り返さない                                           |
| `createTheme({ … }, jaJP)`                               | `TablePagination` の「1〜10 / 全 23 件」などを日本語にする               |
| `shape: { borderRadius: 8 }`                             | `sx={{ borderRadius: 1 }}` が 8px になる                                 |

---

## 2-4. shared/config ── 設定値

### [shared/config/storage.ts](../src/shared/config/storage.ts)

```ts
const STORAGE_PREFIX = "user-management";
export const storageKey = (name: string) => `${STORAGE_PREFIX}:${name}`;
// storageKey("users") → "user-management:users"
```

- **何を書いているか**：localStorage のキーを作る関数
- **なぜここか**：同じ `localhost:5173` で別のサンプルを動かすと、localStorage は共有される。キーにアプリ名を付けて混ざらないようにする。この「アプリ名」はアプリ全体の設定値なので config
- **ポイント**：サンプルをコピーして別のアプリを作るときは、`STORAGE_PREFIX` を必ず変える

---

## 2-5. shared/lib ── 業務に関係しない関数

### [shared/lib/date.ts](../src/shared/lib/date.ts)

日付を `"YYYY-MM-DD"` の**文字列のまま**扱う関数集。このアプリで使っているのは `formatDate`（`"2026-10-03"` → `"2026/10/03"`）だけ。
`todayString`・`addDays`・`diffDays` は他のサンプル（貸出の期限など）と共通の道具で、ここでは使っていない。

- **なぜ文字列か**：`<input type="date">` の値がそもそも `"2026-10-03"` の文字列。JSON（localStorage）に `Date` は保存できない。桁がそろっているので `<`・`>` でそのまま前後を比べられる。並び替え（入社日の列）も文字列の比較で正しく並ぶ
- **ポイント**：`new Date().toISOString().slice(0, 10)` で今日を作ると UTC の日付になり、日本時間の 0〜9 時は前日になる。`todayString()` を使う

### [shared/lib/format.ts](../src/shared/lib/format.ts)

`formatDateTime("2026-10-01T09:05:00.000Z")` → `"2026/10/01 18:05"`。詳細ページの「更新日時」で使う。
`Intl.DateTimeFormat` は作るのが重いので、関数の外で 1 回だけ作って使い回している。

### [shared/lib/persist.ts](../src/shared/lib/persist.ts) ── `mergeWithSchema`

```ts
export const mergeWithSchema =
  <T extends object>(schema: z.ZodType<T>) =>
  <S extends T>(persisted: unknown, current: S): S => {
    if (persisted === undefined) return current;          // 初めて開いた
    const result = schema.safeParse(persisted);
    if (!result.success) return current;                   // 形が崩れている → 初期値で始める
    return { ...current, ...result.data };                 // 正しい → 読み込んだ値で上書き
  };
```

- **何を書いているか**：Zustand の persist が localStorage から読み込んだ値を、zod でチェックしてから使う
- **なぜ要るか**：persist は読み込んだ値を**チェックせずに**そのまま state に入れる。型を変える前の古いデータや、手で書き換えたデータが残っていると、`user.name.toLowerCase()` などで画面が真っ白になる
- **なぜ shared か**：「スキーマを受け取ってチェックする」だけで、ユーザーを知らない。どの store にも使える
- **ポイント**：関数を返す関数（2 段の矢印）。1 段目でスキーマを受け取り、2 段目が persist の `merge` の形 `(persisted, current) => state` になっている。`{ ...current, ...result.data }` で、current の action（関数）を残したまま、データだけを上書きする

### [shared/lib/index.ts](../src/shared/lib/index.ts)

窓口。外からは `import { formatDate } from "@/shared/lib"` と書く。

---

## 2-6. shared/ui ── 使い回す部品

> このフォルダは `samples/_shared/mui-ui` のコピー（`npm run sync-ui` で全サンプルに配る）。
> だから使っていない部品（`StatCard`・`QuantityStepper`）も入っている。試験で作るときは使うものだけ書けばよい。

MUI の部品はそのまま使い、**MUI にない「組み合わせ」だけ**をここで作っている。

| 部品                        | このアプリで使う場所                           | 何をまとめているか                                       |
| --------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| `AppShell`                  | RootLayout                                     | AppBar ＋ Drawer（PC は常に表示、スマホは ☰ で開閉）     |
| `PageHeader`                | 一覧・詳細                                     | パンくず ＋ `<h1>` ＋ 説明 ＋ 右のボタン                 |
| `DataTable`                 | UserTable                                      | 表 ＋ チェックボックス ＋ 並び替え ＋ ページ送り         |
| `DialogForm`・`useFormDialog` | UserFormDialog・一覧・詳細                   | ダイアログの中のフォームの枠、追加／編集の開閉           |
| `FormTextField`             | UserFormDialog                                 | React Hook Form と MUI の TextField をつなぐ             |
| `ConfirmDialog`             | DeleteUserButton・DeleteUsersButton            | 「削除しますか？」の確認                                 |
| `Notifier`・`notify`        | AppProviders・各操作                           | 画面下の通知                                             |
| `EmptyState`                | 一覧（0 件・該当なし）・詳細（見つからない）・404 | 空のときの案内                                       |
| `DescriptionList`           | 詳細                                           | 「項目名：値」の一覧（`<dl>`）                           |
| `SamplesTopLink`            | RootLayout                                     | 公開ページ用。試験では不要                               |

ここからは、このアプリの動きに関わる部品を詳しく読む。

### [DataTable](../src/shared/ui/DataTable/DataTable.tsx) ── 列の定義を渡すだけの表

このアプリでいちばん大きい部品。**ユーザーを知らない**ので、`T extends { id: string }`（id を持つ何か）を受け取るジェネリクスになっている。

#### 受け取るもの（props）

| props                                   | 意味                                   | 渡さないと         |
| --------------------------------------- | -------------------------------------- | ------------------ |
| `rows`                                  | 表示する行（`User[]`）                 | 必須               |
| `columns`                               | 列の定義の配列                         | 必須               |
| `ariaLabel`                             | 表の名前（読み上げ用）                 | 必須               |
| `selectedIds`・`onSelectedIdsChange`    | 選択中の id と、変わったときの関数     | チェックボックスが出ない |
| `selectionActions`                      | 選択中だけ上に出す操作                 | 帯にボタンが出ない |
| `rowActions`                            | 行の右端の操作                         | 「操作」列が出ない |
| `defaultSort`                           | 最初の並び替え                         | 並び替えなし       |
| `pageSize`                              | 1 ページの行数                         | 全件を 1 ページに  |

列の定義（`DataTableColumn<T>`）は「見出し」と「セルの中身を作る関数」の組。

```ts
{ key: "joinedAt", label: "入社日", sortValue: (user) => user.joinedAt, render: (user) => formatDate(user.joinedAt) }
```

- `render`：セルに何を出すか（文字でも、`<Chip>` でも、`<Switch>` でもよい）
- `sortValue`：並び替えに使う値。**渡した列だけ**見出しが押せるようになる。表示（`2026/10/03`）と並び替えの値（`2026-10-03`）を分けられる

#### 中で持つ状態と、計算している値

```ts
const [sortKey, setSortKey] = useState(defaultSort?.key);   // どの列で並べるか
const [order, setOrder] = useState<Order>(…);               // 昇順・降順
const [page, setPage] = useState(0);                        // 今のページ

// 選択：rows にある id だけを「選択中」として数える
const selectedSet = new Set(selectedIds);
const selectedRowIds = rows.filter((row) => selectedSet.has(row.id)).map((row) => row.id);
const allSelected = rows.length > 0 && selectedRowIds.length === rows.length;
const someSelected = selectedRowIds.length > 0 && !allSelected;

// 並び替え → ページで切り出し
const sortedRows = sortColumn?.sortValue ? rows.toSorted(…) : rows;
const lastPage = …;
const currentPage = Math.min(page, lastPage);
const visibleRows = sortedRows.slice(currentPage * pageSize, …);
```

- **選択中の id は親が持つ**（`selectedIds` を props で受け取る）。一括削除のあとに選択を空にするなど、表の外から変えたいことがあるため。**並び替え・ページは表の中**で持つ（外から変える必要がない）
- **`selectedRowIds` を計算し直している理由**：検索で行が見えなくなったり、削除で行が消えたりしても、`selectedIds` には古い id が残っている。「3 件選択中」と出しているのに実際には 1 件しか見えない、というずれを防ぐため、**いま rows にあるものだけ**を数える
- **`toggleRow` は `selectedRowIds` から作り直す**ので、見えない古い id は次にチェックを押したときに自然に消える
- **見出しのチェックボックス**：`checked={allSelected}`・`indeterminate={someSelected}`（一部だけ選んでいるときの「−」）。押すと「全部選択」か「全部解除」。ページ送りがあっても**全ページ分**を選ぶ
- **`currentPage = Math.min(page, lastPage)`**：最後のページの行を全部消すと、そのページが無くなる。`page` を直す処理を書かずに、計算で「あるページ」に収めている
- **`toSorted`**：元の配列を変えずに並べた新しい配列を返す。`sort` は元の配列（＝ store の配列）を書き換えてしまうので使わない
- `compare`：文字は `localeCompare(…, "ja")`（日本語の辞書順）、数値は引き算

#### 描画の形

```text
<Paper>
  選択中のときだけ：<Toolbar>「2件選択中」 [selectionActions(selectedRowIds)]</Toolbar>
  <TableContainer>            … 狭い画面では表だけ横スクロール
    <Table>
      <TableHead> ☐(すべて) | 列の見出し（sortValue があれば TableSortLabel） | 操作 </TableHead>
      <TableBody> visibleRows ごとに ☐ | column.render(row) | rowActions(row) </TableBody>
  <TablePagination>           … pageSize を渡したときだけ
```

### [DialogForm](../src/shared/ui/DialogForm/DialogForm.tsx) と [useFormDialog](../src/shared/ui/DialogForm/useFormDialog.ts) ── 追加・編集ダイアログの型

#### useFormDialog：開閉と「どれを編集中か」

```ts
export const useFormDialog = <T>() => {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<T>();
  return {
    open, target,
    openNew: () => { setTarget(undefined); setOpen(true); },   // 追加
    openEdit: (item: T) => { setTarget(item); setOpen(true); }, // 編集
    close: () => setOpen(false),
  };
};
```

- **`target` が `undefined` なら追加、値があれば編集**。この 1 つのルールで、ダイアログを 1 つだけ置けばよくなる
- **`close` で `target` を消さない理由**：ダイアログは閉じるときにフェードアウトする。その間に `target` を消すと、見出しが「ユーザーを編集」→「ユーザーを追加」に一瞬変わって見える。次に開くときに `openNew`・`openEdit` が必ず `target` を入れ直すので、残しておいて問題ない
- **なぜ shared か**：「何かの追加／編集」に共通の形。ユーザーを知らない（`<T>` で受け取る）

#### DialogForm：ダイアログの中のフォームの枠

```tsx
<form onSubmit={onSubmit} noValidate>
  <DialogTitle>{title}</DialogTitle>
  <DialogContent><Stack spacing={2.5} sx={{ pt: 1 }}>{children}</Stack></DialogContent>
  <DialogActions>
    <Button onClick={onCancel}>キャンセル</Button>
    <Button type="submit" variant="contained">{submitLabel}</Button>
  </DialogActions>
</form>
```

- `<form>` で全体を包み、送信ボタンを `type="submit"` にする。**Enter キーでも送信できる**
- `noValidate`：ブラウザの入力チェック（`required` の吹き出し）を止め、zod のエラーだけを出す
- `pt: 1`：`DialogContent` の先頭は上の余白が詰まっていて、入力欄のラベルが切れる。その対策
- **これは `<Dialog>` の中身**であって、`<Dialog>` そのものは呼ぶ側（features）が書く。理由は次の章の `UserFormDialog` で説明する（「閉じると中身が消える」を使うため）

### [FormTextField](../src/shared/ui/FormTextField/FormTextField.tsx) ── React Hook Form と MUI をつなぐ

```tsx
const { field, fieldState } = useController({ name, control });
const { ref, ...fieldProps } = field;
return (
  <TextField
    fullWidth
    {...textFieldProps}
    {...fieldProps}                                      // value・onChange・onBlur・name
    inputRef={ref}                                       // ref は中の <input> に
    error={fieldState.error !== undefined}               // エラーなら赤枠
    helperText={fieldState.error?.message ?? helperText} // zod のエラー文
  />
);
```

- **なぜ要るか**：MUI の TextField に `{...register("name")}` を渡すと、`select` やラベルの位置などでうまく動かないことがある。`useController` でつなぐのが確実。毎回同じ 5 行になるので部品にした
- `name` の型が `FieldPath<TFieldValues>` なので、**存在しない項目名を書くと型エラー**になる
- `select` を付けるとセレクトボックスになり、`<MenuItem>` を子に書ける（権限・部署で使う）
- `ref` を `inputRef` に渡す理由：送信してエラーがあったとき、React Hook Form が最初のエラーの入力欄にフォーカスを移す。そのために本物の `<input>` を知る必要がある

### [ConfirmDialog](../src/shared/ui/ConfirmDialog/ConfirmDialog.tsx) ── 確認ダイアログ

- `open`・`title`・`message`・`onConfirm`・`onCancel` を受け取るだけ。**開閉の state は持たない**（呼ぶ側が持つ）
- `confirmLabel` の初期値は `"削除"`、`danger` の初期値は `true`（赤いボタン）。削除で使うことが多いので、何も渡さなければ削除用になる
- `<Dialog onClose={onCancel}>`：Esc キー・背景のクリックはキャンセルと同じ扱い

### [Notifier](../src/shared/ui/Notifier/Notifier.tsx) と [notifierStore](../src/shared/ui/Notifier/notifierStore.ts) ── 通知

```ts
export const useNotifierStore = create<NotifierStore>()((set) => ({
  notification: null,
  open: false,
  show: (message, severity = "success") => set({ notification: { id: Date.now(), message, severity }, open: true }),
  close: () => set({ open: false }),
}));

export const notify = (message: string, severity: AlertColor = "success") =>
  useNotifierStore.getState().show(message, severity);
```

- **仕組み**：通知の中身を Zustand の store に置き、表示役の `<Notifier />` をアプリに 1 つだけ置く。どこからでも `notify("…")` を呼べば、store が変わり `<Notifier />` が表示する
- **`getState()`**：フックを使わずに store を読む・action を呼ぶ Zustand の機能。だから `notify` は**ただの関数**で、コンポーネントの外・イベントハンドラの中、どこでも呼べる
- **`id: Date.now()` と `key={notification?.id}`**：同じ文言を続けて出しても、key が変わるので Snackbar が作り直され、4 秒を最初から数え直す
- **閉じても `notification` を残す**：閉じるアニメーションの間に文言が消えないように（`useFormDialog` の `target` と同じ考え方）
- `reason === "clickaway"` を無視：画面のどこかをクリックしただけで、読む前に消えないように
- **なぜ shared か**：通知はどのアプリにも要る、業務と関係ない仕組み

### [PageHeader](../src/shared/ui/PageHeader/PageHeader.tsx)・[EmptyState](../src/shared/ui/EmptyState/EmptyState.tsx)・[DescriptionList](../src/shared/ui/DescriptionList/DescriptionList.tsx)

| 部品              | ポイント                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `PageHeader`      | `variant="h5" component="h1"`：見た目は h5、HTML は `<h1>`。1 ページに 1 つ。パンくずの `to` がない項目は今のページ（リンクにしない） |
| `EmptyState`      | 0 件のときに「何もない」だけで終わらせず、`action` で次の操作（追加ボタン・一覧へ）を出す                   |
| `DescriptionList` | `<dl>`・`<dt>`・`<dd>` で作る。`display: "contents"` の Box で包み、`<dt>`・`<dd>` を grid の直接の子として 2 列に並べる |

### [AppShell](../src/shared/ui/AppShell/AppShell.tsx)

- `useMediaQuery(theme.breakpoints.up("md"))` で PC（900px 以上）かを判定し、Drawer の `variant` を `"permanent"`（常に表示）と `"temporary"`（☰ で開閉）で切り替える
- AppBar は `position="fixed"` なので、中身がヘッダーの下に隠れる。**空の `<Toolbar />` を置いてヘッダーと同じ高さの余白を作る**（Drawer の中とメインの先頭の 2 か所）
- メインに `minWidth: 0`：flex の子は中身より小さく縮まないので、幅の広い表があるとページ全体が横にはみ出す。これで表だけが横スクロールになる
- メニューは `component={NavLink}`：MUI の見た目のまま React Router のリンクにする。今のページには `active` クラスが付くので `"&.active"` で色を付ける
