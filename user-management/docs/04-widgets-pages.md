# 4. widgets と pages

> [目次](README.md) ｜ 前：[3. entities と features](03-entities-features.md) ｜ 次：[5. 操作ごとのデータの流れ](05-flows.md)

entities（見せ方）と features（操作）は、それぞれ単体では画面にならない。
**widgets** がそれらを組み合わせて「表」「カード一覧」というかたまりにし、**pages** がかたまりを並べて 1 つの画面にする。

---

## 4-1. widgets/user-table ── ユーザーの表

[ui/UserTable.tsx](../src/widgets/user-table/ui/UserTable.tsx)

```tsx
type UserTableProps = { users: User[]; onEdit: (user: User) => void };

const columns: DataTableColumn<User>[] = [ … ];   // ← コンポーネントの外

export const UserTable = ({ users, onEdit }: UserTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <DataTable
      ariaLabel="ユーザー一覧"
      rows={users}
      columns={columns}
      getRowLabel={(user) => user.name}
      defaultSort={{ key: "joinedAt", order: "desc" }}
      pageSize={10}
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
      selectionActions={(ids) => (
        <>
          <ChangeUsersStatusButtons ids={ids} />
          <DeleteUsersButton ids={ids} onDeleted={() => setSelectedIds([])} />
        </>
      )}
      rowActions={(user) => (
        <>
          <IconButton aria-label={`「${user.name}」を編集`} onClick={() => onEdit(user)}>✎</IconButton>
          <DeleteUserButton user={user} />
        </>
      )}
    />
  );
};
```

### 何を組み合わせているか

| 場所             | 入れているもの                                            | どの層から          |
| ---------------- | --------------------------------------------------------- | ------------------- |
| 表の枠           | `DataTable`                                               | shared/ui           |
| 列の中身         | `UserAvatar`・`UserRoleChip`・`departmentLabels`・`formatDate` | entities・shared |
| 「有効」の列     | `UserActiveSwitch`                                        | features            |
| 選択中の帯       | `ChangeUsersStatusButtons`・`DeleteUsersButton`           | features            |
| 行の右端         | 編集ボタン（`onEdit` を呼ぶだけ）・`DeleteUserButton`     | features            |

- **なぜ widgets か**：shared の表に、entities の見せ方と、**2 つの features**（削除・有効／無効）を差し込んでいる。features 同士は import し合えないので、両方を並べるには 1 つ上の widgets が要る
- **なぜ pages に直接書かないか**：ページに書くと、一覧ページが 150 行を超えて読めなくなる。表は表、ページは並べるだけ、と分けると、それぞれが 1 画面で読める

### 列の定義（columns）

```ts
const columns: DataTableColumn<User>[] = [
  {
    key: "name", label: "名前", minWidth: 220,
    sortValue: (user) => user.name,
    render: (user) => (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <UserAvatar name={user.name} active={user.active} />
        <Stack sx={{ minWidth: 0 }}>
          <Link component={RouterLink} to={`/users/${user.id}`}>{user.name}</Link>   {/* 詳細へ */}
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Stack>
      </Stack>
    ),
  },
  { key: "role", label: "権限", sortValue: (user) => user.role, render: (user) => <UserRoleChip role={user.role} /> },
  { key: "department", label: "部署", sortValue: (user) => departmentLabels[user.department], render: … },
  { key: "joinedAt", label: "入社日", sortValue: (user) => user.joinedAt, render: (user) => formatDate(user.joinedAt) },
  { key: "active", label: "有効", render: (user) => <UserActiveSwitch user={user} /> },   // sortValue なし → 並び替え不可
];
```

- **コンポーネントの外に置く**：props も state も使わないので、描画のたびに作り直す必要がない
- **`render` と `sortValue` を分ける**：表示は `2026/10/03`、並び替えは `2026-10-03`。部署は表示名（日本語）で並べている
- 権限は値（`admin` < `editor` < `viewer`）で並ぶ。英語のアルファベット順が、ちょうど権限の強い順になっている
- 名前のセルを**リンク**にして詳細ページへ。詳細へのボタンを別に置かなくて済む
- `minWidth`：狭い画面で名前の列が潰れて縦長にならないように

### 選択の state を widgets に置く理由

- 選んでいる行は**この表の中だけ**で使う（帯の表示・一括ボタン）。ページや store に置く必要がない
- `DataTable`（shared）が持たずに受け取る形なのは、**一括削除のあとに選択を空にする**のは表を使う側の都合だから（`onDeleted={() => setSelectedIds([])}`）
- 表示をカードに切り替えると `UserTable` が画面から消えるので、選択も自然にリセットされる

### 編集は「押されたことを伝える」だけ

編集ダイアログは**ページ**にある（表とカードの両方から開くため）。表は `onEdit(user)` を呼んで「この人の編集が押された」と伝えるだけ。
削除は `DeleteUserButton` が自分で確認ダイアログまで持っているので、表は置くだけでよい。

---

## 4-2. widgets/user-card-grid ── カードの一覧

[ui/UserCardGrid.tsx](../src/widgets/user-card-grid/ui/UserCardGrid.tsx)

```tsx
<Grid container spacing={2} component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
  {users.map((user) => (
    <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }} component="li">
      <UserCard
        user={user}
        actions={
          <>
            <Button size="small" component={RouterLink} to={`/users/${user.id}`} sx={{ mr: "auto" }}>詳細</Button>
            <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => onEdit(user)}>編集</Button>
            <DeleteUserButton user={user} />
          </>
        }
      />
    </Grid>
  ))}
</Grid>
```

- **entities の `UserCard` に、features のボタンを `actions` で差し込む**。3 章で「カードはボタンを持たない」と決めたのは、ここで中身を入れるため
- `size={{ xs: 12, sm: 6, md: 4 }}`：12 等分のうち何列分を使うか。スマホ 1 列（12/12）、600px〜 2 列（6/12）、900px〜 3 列（4/12）
- `component="ul"`・`component="li"`：カードの並びを「リスト」として HTML に出す（読み上げで「6 項目のリスト」と伝わる）。`listStyle: "none"` で黒丸を消す
- `sx={{ mr: "auto" }}`（詳細ボタン）：右の余白を全部取るので、詳細は左端、編集・削除は右端に寄る
- props は `UserTable` と**同じ形**（`users`・`onEdit`）。だからページは表とカードを同じ書き方で切り替えられる

---

## 4-3. pages/user-list ── 一覧ページ

[ui/UserListPage.tsx](../src/pages/user-list/ui/UserListPage.tsx)

ページの役目は 2 つだけ：**部品を並べること**と**ダイアログを開閉すること**。データの処理は features・widgets にある。

### 上から順に読む

```tsx
export const UserListPage = () => {
  // ① データと条件を集める
  const users = useUserStore((state) => state.users);          // store（全員）
  const { keyword, role } = useUserFilter();                   // URL（?q=・?role=）
  const dialog = useFormDialog<User>();                        // ダイアログの開閉と編集中のユーザー

  // ② 表示の切り替えも URL（?view=card）
  const [searchParams, setSearchParams] = useSearchParams();
  const view: ViewMode = searchParams.get("view") === "card" ? "card" : "table";
  const changeView = (next: ViewMode) => setSearchParams((prev) => { … }, { replace: true });

  // ③ 計算できる値（state にしない）
  const visibleUsers = filterUsers(users, keyword, role);
  const activeCount = users.filter((user) => user.active).length;

  // ④ 2 か所で使うボタンは変数にしておく
  const addButton = <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>追加</Button>;

  // ⑤ 並べる
  return ( … );
};
```

| 段階 | ポイント                                                                                                          |
| ---- | ----------------------------------------------------------------------------------------------------------------- |
| ①    | 一覧の元データは store、条件は URL、ダイアログはこのページの state。**3 種類の置き場所**を使い分けている          |
| ②    | `?view=card` のときだけカード。それ以外（なし・知らない値）は表。`useUserFilter` と同じく、今の URL をコピーしてから 1 つだけ変える |
| ③    | `visibleUsers` と `activeCount` は**描画のたびに計算**。state にすると、追加・削除のたびに更新し忘れてずれる   |
| ④    | 追加ボタンはヘッダーと「0 人のとき」の 2 か所に出す。JSX も変数に入れられる                                       |

### 並べ方（return の中）

```tsx
<Container maxWidth="lg" sx={{ py: 3 }}>
  <Stack spacing={3}>
    <PageHeader title="ユーザー一覧" description={`全 ${users.length}人（有効 ${activeCount}人）…`} action={addButton} />

    {users.length === 0 ? (
      <EmptyState title="ユーザーがいません" … action={addButton} />            // ← そもそも 0 人
    ) : (
      <>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <UserFilterBar />
          <ToggleButtonGroup exclusive value={view} onChange={(_e, next: ViewMode | null) => next && changeView(next)}>
            <ToggleButton value="table">…</ToggleButton>
            <ToggleButton value="card">…</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {visibleUsers.length === 0 ? (
          <EmptyState title="条件に合うユーザーはいません" … />                  // ← 絞り込みで 0 人
        ) : view === "table" ? (
          <UserTable users={visibleUsers} onEdit={dialog.openEdit} />
        ) : (
          <UserCardGrid users={visibleUsers} onEdit={dialog.openEdit} />
        )}
      </>
    )}
  </Stack>

  <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />  // ← 1つだけ
</Container>
```

- **空の状態を 2 種類に分ける**：
  - 全員 0 人 → 「追加しましょう」と追加ボタン（絞り込み欄は出しても意味がないので出さない）
  - 絞り込みで 0 人 → 「条件を変えてください」（データはあるので、追加を促さない）
- **`ToggleButtonGroup` の `exclusive`**：1 つだけ選べる。選択中のボタンをもう一度押すと `next` が `null` で来るので、`next && …` で無視する（どちらも選ばれていない状態にしない）
- **`onEdit={dialog.openEdit}`**：表・カードで編集が押されると、`dialog.openEdit(user)` が呼ばれ、`target` に user が入り、ダイアログが開く
- **`<UserFormDialog>` はページに 1 つ**：表の行やカードごとにダイアログを置くと、ユーザーの数だけフォームの部品ができる。1 つを `target` で使い回す
- **ダイアログを `<Stack>` の外に置く**：Dialog は画面の上に重ねて表示されるので、どこに書いても見た目は同じ。`Stack` の中に置くと `spacing` の余白が 1 つ増える
- `Container maxWidth="lg"`：横に広がりすぎないように最大幅を決め、中央に寄せる。`py: 3`（上下 24px）

---

## 4-4. pages/user-detail ── 詳細ページ

[ui/UserDetailPage.tsx](../src/pages/user-detail/ui/UserDetailPage.tsx)

```tsx
export const UserDetailPage = () => {
  const { id } = useParams();                                                          // URL の :id
  const user = useUserStore((state) => state.users.find((item) => item.id === id));    // 1人だけ選ぶ
  const navigate = useNavigate();
  const dialog = useFormDialog<User>();

  if (!user) {
    return <EmptyState title="ユーザーが見つかりません" … action={<Button component={RouterLink} to="/users">ユーザー一覧へ</Button>} />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title={user.name}
          breadcrumbs={[{ label: "ユーザー一覧", to: "/users" }, { label: user.name }]}
          action={
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => dialog.openEdit(user)}>編集</Button>
              <DeleteUserButton user={user} variant="button" onDeleted={() => navigate("/users", { replace: true })} />
            </Stack>
          }
        />
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <UserAvatar … /> {user.email}
          <DescriptionList items={[
            { term: "権限", description: <UserRoleChip role={user.role} /> },
            { term: "部署", description: departmentLabels[user.department] },
            { term: "入社日", description: formatDate(user.joinedAt) },
            { term: "状態", description: <UserStatusChip active={user.active} /> },
            { term: "更新日時", description: formatDateTime(user.updatedAt) },
          ]} />
        </Paper>
      </Stack>
      <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
    </Container>
  );
};
```

- **一覧と同じ部品を使い回す**：`UserFormDialog`・`DeleteUserButton`・`UserRoleChip` など。新しく書いたのは「並べ方」だけ
- **`find` はセレクターの中で OK**：`find` が返すのは store の中にある**同じオブジェクト**（新しく作らない）なので、無限再描画にならない。このユーザーが更新されたら、新しいオブジェクトになるのでちゃんと再描画される
- **`useParams()` の `id` は `string | undefined`**：`find` で見つからなければ `undefined`。**URL の打ち間違い・削除済み**のときに「見つかりません」を出す
- **フックは全部 `if (!user) return` より前に書く**：React のフックは毎回**同じ順番・同じ数**で呼ばれる必要がある。`return` の後に `useFormDialog()` を書くと、ユーザーがいるときといないときでフックの数が変わり、エラーになる（lint の `rules-of-hooks` が教えてくれる）
- **削除したら一覧へ戻る**：`DeleteUserButton` の `onDeleted` に `navigate("/users", { replace: true })` を渡す。消したユーザーのページに残らないように
  - **`replace: true`**：履歴の「詳細ページ」を一覧で置き換える。「戻る」を押して、消したユーザーの詳細（＝見つかりません）に戻らないように
- **編集したら表示がすぐ変わる**：ダイアログが `updateUser` で store を変える → セレクターが新しい `user` を返す → ページが再描画される。ページ側で何もしなくてよい
- パンくずの最後（`{ label: user.name }`）は `to` がないので、今のページとしてリンクにならない
- `Container maxWidth="md"`：一覧（lg）より狭くして、情報欄を読みやすくする

---

## 4-5. pages/not-found ── 404

[ui/NotFoundPage.tsx](../src/pages/not-found/ui/NotFoundPage.tsx)

`EmptyState` に「ページが見つかりません」と一覧へのボタンを渡すだけ。

- `<Button component={RouterLink} to="/">`：MUI のボタンの見た目で、React Router のリンクとして動かす。`href` で書くとページ全体が再読み込みされる
- `App.tsx` の `<Route path="*">` から使われる

---

## 4-6. pages の index.ts

```ts
// pages/user-list/index.ts
export { UserListPage } from "./ui/UserListPage";
```

ページも同じく窓口を作る。`App.tsx` は `import { UserListPage } from "@/pages/user-list"` と書く。
ページの中を `ui/` と分けるのは、ほかの層とそろえるため（ページ専用のフックや計算が増えたら `model/` を足せる）。
