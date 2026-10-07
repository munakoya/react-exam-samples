# 6. ゼロから作る手順

> [目次](README.md) ｜ 前：[5. 操作ごとのデータの流れ](05-flows.md) ｜ 次：[7. つまずきと判断の基準](07-pitfalls.md)

**1 ステップ = 動く状態 = 1 コミット**。どのステップの終わりでも、アプリは動いている。
各ステップに「作るファイル（この順に書く）」「要点」「確認すること」をまとめた。手が止まったら、リンク先の完成形と 2〜4 章の説明を見る。

| ステップ | 作るもの                                          | 目安  | 必須／発展 |
| -------- | ------------------------------------------------- | ----- | ---------- |
| 1        | 環境構築・テーマ・ルーティング・共通の枠          | 15 分 | 必須       |
| 2        | ユーザーの型・選択肢・store、Chip・Avatar         | 15 分 | 必須       |
| 3        | 一覧の表                                          | 15 分 | 必須       |
| 4        | 追加・編集のダイアログ                            | 30 分 | 必須       |
| 5        | 削除（確認ダイアログ）・通知                      | 15 分 | 必須       |
| 6        | チェックで選択 → 一括操作、行のスイッチ           | 20 分 | 発展       |
| 7        | 検索・絞り込み（URL）                             | 20 分 | 発展       |
| 8        | カード表示と切り替え                              | 15 分 | 発展       |
| 9        | 詳細ページ                                        | 15 分 | 発展       |

必須だけなら 1〜5（約 1 時間 30 分）。並び替え・ページ送りは `DataTable` に `sortValue`・`pageSize` を渡すだけなので、ステップ 3 で一緒に入れてしまう。

> **shared/ui について**：試験では `DataTable`・`DialogForm` などを一から書くことになる。各部品が「何を受け取り、何をするか」は [2 章](02-app-shared.md) を見て、**このアプリで使う機能だけ**を書く（たとえば表は、最初はチェックボックスなしで作り、ステップ 6 で足す）。

---

## ステップ 1：環境構築・テーマ・ルーティング・共通の枠

### コマンド

```bash
npm create vite@latest user-management -- --template react-ts
cd user-management
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router zustand zod react-hook-form @hookform/resolvers

mkdir -p src/app/providers src/app/layouts src/app/styles
mkdir -p src/pages src/widgets src/features src/entities
mkdir -p src/shared/ui src/shared/lib src/shared/config
```

Vite が作った `App.css`・`index.css`・`assets/` は消し、`main.tsx` の CSS の import も消す。

### 作るファイル（この順に）

| # | ファイル                                  | 要点                                                                     |
| - | ----------------------------------------- | ------------------------------------------------------------------------ |
| 1 | `vite.config.ts`・`tsconfig.app.json`     | `"@"` → `src` の別名を**両方**に                                         |
| 2 | `src/app/styles/theme.ts`                 | `createTheme({ palette, shape, typography, components }, jaJP)`          |
| 3 | `src/shared/ui/AppShell/AppShell.tsx`     | AppBar ＋ Drawer ＋ main。最初は Drawer なしのヘッダーだけでもよい        |
| 4 | `src/shared/ui/PageHeader`・`EmptyState`  | 見出しと空の案内                                                         |
| 5 | `src/shared/ui/index.ts`                  | 窓口                                                                     |
| 6 | `src/pages/user-list/ui/UserListPage.tsx` ＋ `index.ts` | 仮：`<PageHeader title="ユーザー一覧" />` だけ           |
| 7 | `src/pages/user-detail/…`・`src/pages/not-found/…`      | 仮：見出しだけ                                           |
| 8 | `src/app/layouts/RootLayout.tsx`          | `<AppShell title=… navItems=…><Outlet /></AppShell>`                     |
| 9 | `src/app/App.tsx`                         | `<Routes>` ＋ レイアウトルート ＋ `index` の `<Navigate replace>`        |
| 10 | `src/app/providers/AppProviders.tsx`     | `ThemeProvider` → `CssBaseline` → `BrowserRouter`                        |
| 11 | `src/main.tsx`                           | `<StrictMode><AppProviders><App /></AppProviders></StrictMode>`          |

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});

// tsconfig.app.json の compilerOptions に
"paths": { "@/*": ["./src/*"] }
```

```tsx
// src/app/App.tsx
<Routes>
  <Route element={<RootLayout />}>
    <Route index element={<Navigate to="/users" replace />} />
    <Route path="/users" element={<UserListPage />} />
    <Route path="/users/:id" element={<UserDetailPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

> `node:url` で型エラーが出たら `npm install -D @types/node`。

### 確認

- `/` を開くと `/users` に移動し、「ユーザー一覧」が出る
- `/xxx` で 404 が出る
- スマホ幅（DevTools）で ☰ が出て、メニューが開閉できる

```bash
git init && git add . && git commit -m "環境構築（MUI・テーマ・ルーティング・共通の枠）"
```

完成形：[App.tsx](../src/app/App.tsx)・[RootLayout.tsx](../src/app/layouts/RootLayout.tsx)・[AppProviders.tsx](../src/app/providers/AppProviders.tsx)・[theme.ts](../src/app/styles/theme.ts)・[AppShell.tsx](../src/shared/ui/AppShell/AppShell.tsx)

---

## ステップ 2：ユーザーの型・選択肢・store（entities/user）

### 作るファイル（この順に）

| # | ファイル                                     | 要点                                                               |
| - | -------------------------------------------- | ------------------------------------------------------------------ |
| 1 | `src/shared/config/storage.ts` ＋ `index.ts` | `storageKey("users")` → `"user-management:users"`                  |
| 2 | `src/shared/lib/persist.ts`・`date.ts` ＋ `index.ts` | `mergeWithSchema`・`formatDate`                            |
| 3 | `src/entities/user/model/user.ts`            | 権限・部署の 3 点セット、`userSchema`、`User`、`UserInput`          |
| 4 | `src/entities/user/model/userStore.ts`       | `users` ＋ 4 つの action ＋ persist                                |
| 5 | `src/entities/user/ui/UserChips.tsx`・`UserAvatar.tsx` | 色の決め方を 1 か所に                                    |
| 6 | `src/entities/user/index.ts`                 | 外に見せるものを export                                            |

```ts
// user.ts（権限。部署も同じ形で書く）
export const userRoles = ["admin", "editor", "viewer"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleLabels: Record<UserRole, string> = { admin: "管理者", editor: "編集者", viewer: "閲覧者" };
export const userRoleOptions = userRoles.map((value) => ({ value, label: userRoleLabels[value] }));

export const userSchema = z.object({
  id: z.string(), name: z.string(), email: z.string(),
  role: z.enum(userRoles), department: z.enum(departments),
  active: z.boolean(), joinedAt: z.string(), createdAt: z.string(), updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;
export type UserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
```

```ts
// userStore.ts
export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      users: [],   // 試験では [] から。動作確認用に 2〜3 人入れておくと楽
      addUser: (input) => {
        const now = new Date().toISOString();
        set((state) => ({ users: [{ ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...state.users] }));
      },
      updateUser: (id, input) =>
        set((state) => ({ users: state.users.map((u) => (u.id === id ? { ...u, ...input, updatedAt: new Date().toISOString() } : u)) })),
      setActive: (ids, active) =>
        set((state) => ({ users: state.users.map((u) => (ids.includes(u.id) ? { ...u, active, updatedAt: new Date().toISOString() } : u)) })),
      removeUsers: (ids) => set((state) => ({ users: state.users.filter((u) => !ids.includes(u.id)) })),
    }),
    {
      name: storageKey("users"),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users }),
      version: 1,
      merge: mergeWithSchema(z.object({ users: z.array(userSchema) })),
    },
  ),
);
```

`setActive`・`removeUsers` はステップ 5・6 で使うが、形がそろっているのでここで一緒に書いてしまう。

### 確認

一覧ページで仮に `users.length` を出し、DevTools の Application → Local Storage に `user-management:users` ができていること。

```bash
git add . && git commit -m "ユーザーの型・選択肢・store"
```

完成形：[user.ts](../src/entities/user/model/user.ts)・[userStore.ts](../src/entities/user/model/userStore.ts)・[UserChips.tsx](../src/entities/user/ui/UserChips.tsx)・[persist.ts](../src/shared/lib/persist.ts)

---

## ステップ 3：一覧の表（widgets/user-table）

### 作るファイル（この順に）

| # | ファイル                                   | 要点                                                                 |
| - | ------------------------------------------ | -------------------------------------------------------------------- |
| 1 | `src/shared/ui/DataTable/DataTable.tsx`    | まずは `rows`・`columns`・`rowActions`・`sortValue`・`pageSize` だけ（チェックボックスはステップ 6） |
| 2 | `src/widgets/user-table/ui/UserTable.tsx` ＋ `index.ts` | 列の定義（コンポーネントの外）＋ `<DataTable>`          |
| 3 | `src/pages/user-list/ui/UserListPage.tsx`  | store から `users` を読み、0 人なら `EmptyState`、いれば `<UserTable>` |

```tsx
// UserTable.tsx（この時点）
const columns: DataTableColumn<User>[] = [
  { key: "name", label: "名前", sortValue: (u) => u.name, render: (u) => <>{/* アバター・名前・メール */}</> },
  { key: "role", label: "権限", sortValue: (u) => u.role, render: (u) => <UserRoleChip role={u.role} /> },
  { key: "department", label: "部署", sortValue: (u) => departmentLabels[u.department], render: (u) => departmentLabels[u.department] },
  { key: "joinedAt", label: "入社日", sortValue: (u) => u.joinedAt, render: (u) => formatDate(u.joinedAt) },
  { key: "active", label: "状態", render: (u) => <UserStatusChip active={u.active} /> },  // ステップ 6 でスイッチに
];

export const UserTable = ({ users, onEdit }: UserTableProps) => (
  <DataTable ariaLabel="ユーザー一覧" rows={users} columns={columns}
    defaultSort={{ key: "joinedAt", order: "desc" }} pageSize={10}
    rowActions={(user) => <IconButton aria-label={`「${user.name}」を編集`} onClick={() => onEdit(user)}><EditOutlinedIcon /></IconButton>}
  />
);
```

`onEdit` はステップ 4 でつなぐ。今は `onEdit={() => {}}` を渡しておく。

### 確認

- 表が出る。見出しを押すと並び替わる（もう一度押すと逆順）
- 11 人以上いるとページ送りが出る（store の初期値を増やして試す）
- スマホ幅で表だけが横スクロールする（ページ全体がはみ出さない）

```bash
git add . && git commit -m "ユーザー一覧の表（並び替え・ページ送り）"
```

完成形：[DataTable.tsx](../src/shared/ui/DataTable/DataTable.tsx)・[UserTable.tsx](../src/widgets/user-table/ui/UserTable.tsx)

---

## ステップ 4：追加・編集のダイアログ（features/user-form）

### 作るファイル（この順に）

| # | ファイル                                          | 要点                                                               |
| - | ------------------------------------------------- | ------------------------------------------------------------------ |
| 1 | `src/shared/ui/FormTextField/FormTextField.tsx`   | `useController` で TextField とつなぐ                              |
| 2 | `src/shared/ui/DialogForm/DialogForm.tsx`         | `<form noValidate>` ＋ Title ＋ Content ＋ Actions                 |
| 3 | `src/shared/ui/DialogForm/useFormDialog.ts`       | `open`・`target`・`openNew`・`openEdit`・`close`                   |
| 4 | `src/features/user-form/model/schema.ts`          | `createUserFormSchema(otherEmails)`・型 2 つ・`toFormInput`         |
| 5 | `src/features/user-form/ui/UserFormDialog.tsx` ＋ `index.ts` | **外側 `UserFormDialog`（Dialog）と内側 `UserForm`（useForm）に分ける** |
| 6 | `src/pages/user-list/ui/UserListPage.tsx`         | `useFormDialog`・追加ボタン・`onEdit={dialog.openEdit}`・ダイアログを 1 つ |

```tsx
// UserFormDialog.tsx の骨組み
export const UserFormDialog = ({ open, user, onClose }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <UserForm user={user} onDone={onClose} />
  </Dialog>
);

const UserForm = ({ user, onDone }: { user?: User; onDone: () => void }) => {
  const users = useUserStore((s) => s.users);
  const addUser = useUserStore((s) => s.addUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const otherEmails = users.filter((o) => o.id !== user?.id).map((o) => o.email);

  const { control, handleSubmit } = useForm<UserFormInput, unknown, UserFormValues>({
    resolver: zodResolver(createUserFormSchema(otherEmails)),
    defaultValues: toFormInput(user),
  });

  const onSubmit = (values: UserFormValues) => {
    if (user) updateUser(user.id, values); else addUser(values);
    onDone();
  };

  return (
    <DialogForm title={user ? "ユーザーを編集" : "ユーザーを追加"} submitLabel={user ? "更新" : "追加"}
      onSubmit={handleSubmit(onSubmit)} onCancel={onDone}>
      <FormTextField control={control} name="name" label="名前" required autoFocus />
      {/* email・role（select）・department（select）・joinedAt（date, shrink）・active（Controller ＋ Switch） */}
    </DialogForm>
  );
};
```

```tsx
// UserListPage.tsx に足すもの
const dialog = useFormDialog<User>();
<Button variant="contained" onClick={dialog.openNew}>追加</Button>
<UserTable users={users} onEdit={dialog.openEdit} />
<UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
```

### 確認

- 追加：空のまま送信 → 名前・メール・入社日に赤字。正しく入れると表の先頭に出る
- 重複：既にあるメールで追加 → 「このメールアドレスは登録済みです」
- 編集：A さんの ✎ → A さんの値。**閉じて B さんの ✎ → B さんの値**（A さんの値が残っていない）
- 編集で何も変えずに「更新」→ 重複エラーにならない
- Esc・背景クリック・キャンセルで閉じる。閉じる途中で見出しが変わらない
- 再読み込みしても追加・編集が残っている

```bash
git add . && git commit -m "追加・編集のダイアログ（重複チェック）"
```

完成形：[schema.ts](../src/features/user-form/model/schema.ts)・[UserFormDialog.tsx](../src/features/user-form/ui/UserFormDialog.tsx)・[DialogForm.tsx](../src/shared/ui/DialogForm/DialogForm.tsx)・[useFormDialog.ts](../src/shared/ui/DialogForm/useFormDialog.ts)・[FormTextField.tsx](../src/shared/ui/FormTextField/FormTextField.tsx)

---

## ステップ 5：削除（確認ダイアログ）・通知

### 作るファイル（この順に）

| # | ファイル                                        | 要点                                                             |
| - | ----------------------------------------------- | ---------------------------------------------------------------- |
| 1 | `src/shared/ui/ConfirmDialog/ConfirmDialog.tsx` | 開閉は持たない。`open`・`onConfirm`・`onCancel` を受け取る        |
| 2 | `src/shared/ui/Notifier/notifierStore.ts`       | `notification`・`open`・`show`・`close` と `notify()`            |
| 3 | `src/shared/ui/Notifier/Notifier.tsx`           | Snackbar ＋ Alert。`key={notification?.id}`                      |
| 4 | `src/app/providers/AppProviders.tsx`            | `<Notifier />` を 1 つ置く                                       |
| 5 | `src/features/delete-user/ui/DeleteUserButton.tsx` ＋ `index.ts` | ボタン ＋ `useState` ＋ `ConfirmDialog`         |
| 6 | `UserTable.tsx` の `rowActions`                 | `<DeleteUserButton user={user} />` を足す                        |
| 7 | `UserFormDialog.tsx` の `onSubmit`              | `notify("「〇〇」を追加しました")` などを足す                    |

```tsx
// DeleteUserButton.tsx の骨組み
const [open, setOpen] = useState(false);
const removeUsers = useUserStore((s) => s.removeUsers);
const handleConfirm = () => {
  setOpen(false);
  removeUsers([user.id]);
  notify(`「${user.name}」を削除しました`);
  onDeleted?.();
};
return (
  <>
    <IconButton color="error" aria-label={`「${user.name}」を削除`} onClick={() => setOpen(true)}><DeleteOutlinedIcon /></IconButton>
    <ConfirmDialog open={open} title="削除しますか？" message={`「${user.name}」を削除します。この操作は取り消せません。`}
      onConfirm={handleConfirm} onCancel={() => setOpen(false)} />
  </>
);
```

### 確認

- 🗑 → 確認 → 「キャンセル」で何も起きない、「削除」で消えて通知が出る
- 追加・編集でも通知が出る。続けて操作すると、通知の 4 秒が数え直される

ここで**必須の要件はすべて**そろう。

```bash
git add . && git commit -m "削除（確認ダイアログ）・通知"
```

完成形：[DeleteUserButton.tsx](../src/features/delete-user/ui/DeleteUserButton.tsx)・[ConfirmDialog.tsx](../src/shared/ui/ConfirmDialog/ConfirmDialog.tsx)・[notifierStore.ts](../src/shared/ui/Notifier/notifierStore.ts)・[Notifier.tsx](../src/shared/ui/Notifier/Notifier.tsx)

---

## ステップ 6：チェックで選択 → 一括操作、行のスイッチ

### 作るファイル（この順に）

| # | ファイル                                                 | 要点                                                                 |
| - | -------------------------------------------------------- | -------------------------------------------------------------------- |
| 1 | `DataTable.tsx`                                          | `selectedIds`・`onSelectedIdsChange`・`selectionActions`・`getRowLabel` を足す。`selectedRowIds` を rows から計算 |
| 2 | `src/features/delete-user/ui/DeleteUsersButton.tsx`      | `ids` ＋ 確認 ＋ `onDeleted`                                          |
| 3 | `src/features/change-user-status/ui/UserActiveSwitch.tsx` | `checked={user.active}`、確認なし・通知だけ                         |
| 4 | `src/features/change-user-status/ui/ChangeUsersStatusButtons.tsx` ＋ `index.ts` | 有効にする／無効にする                 |
| 5 | `UserTable.tsx`                                          | `useState<string[]>([])`、`selectionActions`、「有効」列をスイッチに |

```tsx
// DataTable.tsx に足す計算
const selectable = selectedIds !== undefined && onSelectedIdsChange !== undefined;
const selectedSet = new Set(selectedIds);
const selectedRowIds = rows.filter((row) => selectedSet.has(row.id)).map((row) => row.id);
const allSelected = rows.length > 0 && selectedRowIds.length === rows.length;
const someSelected = selectedRowIds.length > 0 && !allSelected;
const toggleAll = () => onSelectedIdsChange?.(allSelected ? [] : rows.map((row) => row.id));
const toggleRow = (id: string) =>
  onSelectedIdsChange?.(selectedSet.has(id) ? selectedRowIds.filter((x) => x !== id) : [...selectedRowIds, id]);
```

```tsx
// UserTable.tsx
const [selectedIds, setSelectedIds] = useState<string[]>([]);
<DataTable …
  selectedIds={selectedIds}
  onSelectedIdsChange={setSelectedIds}
  selectionActions={(ids) => (<>
    <ChangeUsersStatusButtons ids={ids} />
    <DeleteUsersButton ids={ids} onDeleted={() => setSelectedIds([])} />
  </>)}
/>
```

### 確認

- 行を選ぶと上に「〇件選択中」の帯。見出しの ☐ で全選択／全解除、一部選択で「−」
- 一括削除のあと、帯が消える（選択が空になる）
- 一括で無効 → スイッチが OFF・アバターが灰色。選択は残る
- スイッチで切り替え → 通知、再読み込みしても残る

```bash
git add . && git commit -m "チェックで選択して一括操作・行のスイッチ"
```

完成形：[UserTable.tsx](../src/widgets/user-table/ui/UserTable.tsx)・[DeleteUsersButton.tsx](../src/features/delete-user/ui/DeleteUsersButton.tsx)・[UserActiveSwitch.tsx](../src/features/change-user-status/ui/UserActiveSwitch.tsx)・[ChangeUsersStatusButtons.tsx](../src/features/change-user-status/ui/ChangeUsersStatusButtons.tsx)

---

## ステップ 7：検索・絞り込み（URL）

### 作るファイル（この順に）

| # | ファイル                                             | 要点                                                    |
| - | ---------------------------------------------------- | ------------------------------------------------------- |
| 1 | `src/features/user-filter/model/useUserFilter.ts`    | `useSearchParams`、型ガード、今の URL をコピーして 1 つ変える、`replace` |
| 2 | `src/features/user-filter/model/filterUsers.ts`      | 権限 ＆ （名前 or メール）                              |
| 3 | `src/features/user-filter/ui/UserFilterBar.tsx` ＋ `index.ts` | 検索欄・権限のセレクト（「すべて」を先頭に）   |
| 4 | `UserListPage.tsx`                                   | `visibleUsers = filterUsers(users, keyword, role)` を表に渡す。0 件の `EmptyState` を 2 種類に |

### 確認

- 「佐藤」で絞れる。メールアドレスの一部（`sato`）でも絞れる。大文字でも当たる
- URL が `/users?q=佐藤&role=admin` になる。再読み込みしても残る
- 「すべて」・空欄に戻すと、URL から `role`・`q` が消える
- 何文字打っても、「戻る」1 回で前のページに戻る（`replace`）
- 条件に合う人がいないと「条件に合うユーザーはいません」

```bash
git add . && git commit -m "検索・権限で絞り込み（URL に持つ）"
```

完成形：[useUserFilter.ts](../src/features/user-filter/model/useUserFilter.ts)・[filterUsers.ts](../src/features/user-filter/model/filterUsers.ts)・[UserFilterBar.tsx](../src/features/user-filter/ui/UserFilterBar.tsx)

---

## ステップ 8：カード表示と切り替え

### 作るファイル（この順に）

| # | ファイル                                                | 要点                                                              |
| - | ------------------------------------------------------- | ----------------------------------------------------------------- |
| 1 | `src/entities/user/ui/UserCard.tsx`                     | 見せ方だけ。`actions?: ReactNode` を受け取る                      |
| 2 | `src/widgets/user-card-grid/ui/UserCardGrid.tsx` ＋ `index.ts` | `Grid` で並べ、`actions` に 詳細・編集・`DeleteUserButton`   |
| 3 | `UserListPage.tsx`                                      | `?view=card` を読む、`ToggleButtonGroup`、表とカードを出し分け    |

### 確認

- 切り替えると URL に `?view=card`。検索の `q` は消えない
- カードの「編集」で同じダイアログが開く。削除もできる
- 幅で 1 列・2 列・3 列に変わる。同じ行のカードの高さがそろう

```bash
git add . && git commit -m "カード表示と表示の切り替え"
```

完成形：[UserCard.tsx](../src/entities/user/ui/UserCard.tsx)・[UserCardGrid.tsx](../src/widgets/user-card-grid/ui/UserCardGrid.tsx)・[UserListPage.tsx](../src/pages/user-list/ui/UserListPage.tsx)

---

## ステップ 9：詳細ページ

### 作るファイル（この順に）

| # | ファイル                                            | 要点                                                                |
| - | --------------------------------------------------- | ------------------------------------------------------------------- |
| 1 | `src/shared/ui/DescriptionList/DescriptionList.tsx` | `<dl>` の 2 列                                                      |
| 2 | `src/shared/lib/format.ts`                          | `formatDateTime`                                                    |
| 3 | `DeleteUserButton.tsx`                              | `variant`（"icon" / "button"）と `onDeleted` を足す                 |
| 4 | `src/pages/user-detail/ui/UserDetailPage.tsx`       | `useParams` → `find` → 見つからない／詳細。**フックは全部 return の前** |
| 5 | `UserTable.tsx`                                     | 名前のセルを `<Link component={RouterLink} to={`/users/${user.id}`}>` に |

### 確認

- 名前を押すと詳細へ。パンくずで一覧へ戻れる
- 詳細で編集 → 表示がすぐ変わる
- 詳細で削除 → 一覧へ戻る。「戻る」を押しても消したユーザーのページに戻らない
- `/users/xxx` で「ユーザーが見つかりません」

```bash
git add . && git commit -m "詳細ページ（編集・削除）"
```

完成形：[UserDetailPage.tsx](../src/pages/user-detail/ui/UserDetailPage.tsx)・[DescriptionList.tsx](../src/shared/ui/DescriptionList/DescriptionList.tsx)

---

## 最後に

```bash
npm run lint
npm run build    # 型エラー・使っていない変数があると失敗する
```

両方通ったら [7 章のチェックリスト](07-pitfalls.md) を見て提出する。
