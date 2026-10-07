# 5. 操作ごとのデータの流れ

> [目次](README.md) ｜ 前：[4. widgets と pages](04-widgets-pages.md) ｜ 次：[6. ゼロから作る手順](06-build-steps.md)

ファイルごとに読むと、「ボタンを押したら、どこを通って画面が変わるのか」が見えにくい。
この章では操作を 1 つずつ取り上げ、**ファイルをまたいで**追いかける。

どの流れも、最後は同じ形になる。

```text
操作 → store（または URL）を変える → それを読んでいるコンポーネントが再描画 → 画面が変わる
```

**画面を直接書き換えるコードはどこにもない**。変えるのはデータ（store・URL・state）だけで、画面はデータから毎回作り直される。これが React の考え方。

---

## 5-1. 追加する

```text
[追加] ボタンを押す
 │  pages/user-list/ui/UserListPage.tsx
 │    onClick={dialog.openNew}
 ▼
useFormDialog（shared/ui/DialogForm/useFormDialog.ts）
 │    setTarget(undefined)  … 追加なので「編集中のユーザー」はなし
 │    setOpen(true)
 ▼
UserListPage が再描画 → <UserFormDialog open={true} user={undefined} />
 │  features/user-form/ui/UserFormDialog.tsx
 │    <Dialog open> が開き、中の <UserForm> が新しく作られる
 │    useForm({ defaultValues: toFormInput(undefined) })  … 空のフォーム
 │    otherEmails = 全員のメールアドレス
 ▼
入力して [追加]（または Enter）
 │    <form onSubmit={handleSubmit(onSubmit)}>  … shared/ui/DialogForm
 │    zod でチェック（features/user-form/model/schema.ts）
 │      ✕ エラー → 各入力欄に赤字。onSubmit は呼ばれない。ここで止まる
 │      ○ OK     → onSubmit(values)
 ▼
onSubmit
 │    addUser(values)                 → entities/user/model/userStore.ts
 │        id・createdAt・updatedAt を付けて、配列の先頭に足す
 │        persist が localStorage に保存
 │    notify("「〇〇」を追加しました") → shared/ui/Notifier/notifierStore.ts
 │    onDone()  = onClose = dialog.close → open を false に
 ▼
再描画
 ├ UserListPage：users が変わった → visibleUsers を計算し直す → 表に新しい行
 ├ PageHeader：「全 7人（有効 6人）」に
 ├ Notifier：画面下に通知
 └ Dialog：閉じるアニメーションの後、<UserForm> が消える（次に開くとまた新しく作られる）
```

---

## 5-2. 表の行から編集する

```text
行の ✎ を押す
 │  widgets/user-table/ui/UserTable.tsx
 │    onClick={() => onEdit(user)}
 │    ↑ onEdit は、ページが渡した dialog.openEdit
 ▼
useFormDialog
 │    setTarget(user)   … この人を編集中
 │    setOpen(true)
 ▼
<UserFormDialog open={true} user={佐藤さん} />
 │    defaultValues: toFormInput(佐藤さん)  … 今の値が入ったフォーム
 │    otherEmails = 佐藤さん「以外」のメールアドレス  … 自分のアドレスのまま保存できる
 │    見出し「ユーザーを編集」・ボタン「更新」
 ▼
[更新]
 │    updateUser(佐藤さん.id, values)  … map で佐藤さんだけ差し替え、updatedAt を更新
 │    notify("「〇〇」を更新しました")
 │    dialog.close()
 ▼
再描画：表の佐藤さんの行が新しい値に
```

カードの「編集」・詳細ページの「編集」も、**呼ぶ場所が違うだけで、`dialog.openEdit(user)` から先はまったく同じ**。

| 押す場所             | ファイル                                       | 呼ぶもの                        |
| -------------------- | ---------------------------------------------- | ------------------------------- |
| 表の行の ✎           | `widgets/user-table`                           | `onEdit(user)` → `dialog.openEdit` |
| カードの「編集」     | `widgets/user-card-grid`                       | `onEdit(user)` → `dialog.openEdit` |
| 詳細ページの「編集」 | `pages/user-detail`                            | `dialog.openEdit(user)` を直接   |

---

## 5-3. 1 人を削除する

```text
行の 🗑 を押す
 │  features/delete-user/ui/DeleteUserButton.tsx
 │    setOpen(true)   … このボタンの中の state
 ▼
<ConfirmDialog open title="削除しますか？" message="「佐藤 花子」を削除します。…" />
 │  shared/ui/ConfirmDialog
 │    [キャンセル]・Esc・背景クリック → onCancel → setOpen(false) で終わり
 │    [削除] → onConfirm = handleConfirm
 ▼
handleConfirm
 │    setOpen(false)
 │    removeUsers([user.id])    … filter でその人を除く
 │    notify("「佐藤 花子」を削除しました")
 │    onDeleted?.()             … 表・カードでは渡していないので何もしない
 ▼
再描画：表から行が消える（その行の DeleteUserButton も一緒に消える）
         最後のページの行が全部消えたら、DataTable が 1 つ前のページを出す（currentPage の計算）
```

---

## 5-4. チェックボックスで選んで一括操作する

```text
行の ☐ を押す
 │  shared/ui/DataTable/DataTable.tsx
 │    toggleRow(id) → onSelectedIdsChange([...selectedRowIds, id])
 │    ↑ onSelectedIdsChange は、UserTable が渡した setSelectedIds
 ▼
UserTable の selectedIds が変わる → DataTable を再描画
 │    selectedRowIds.length > 0 → 上に帯「2件選択中 [有効にする][無効にする][削除]」
 │    selectionActions(selectedRowIds) で UserTable が渡したボタンを出す
 ▼
【一括削除】[削除] を押す
 │  features/delete-user/ui/DeleteUsersButton.tsx
 │    確認ダイアログ「2人を削除しますか？」→ [削除]
 │    removeUsers(ids)
 │    notify("2人を削除しました")
 │    onDeleted() = setSelectedIds([])   … 選択を空に（UserTable が渡した関数）
 ▼
再描画：2 行が消え、帯も消える

【一括で有効／無効】[無効にする] を押す
 │  features/change-user-status/ui/ChangeUsersStatusButtons.tsx
 │    setActive(ids, false)  … 確認なし
 │    notify("2人を無効にしました", "info")
 ▼
再描画：2 行のスイッチが OFF、アバターが灰色に。選択は残る（続けて操作できる）
```

**見出しの ☐**：`toggleAll()` → 全員選択中なら `[]`、そうでなければ `rows` の全 id。`rows` は**絞り込み後**のユーザーなので、「管理者だけに絞って全選択 → 削除」で管理者だけが消える。

**選んだ後に絞り込んだら？**：`selectedIds` には見えなくなった人の id も残るが、`DataTable` は `rows` にいる人だけを数え（`selectedRowIds`）、一括ボタンにもその id だけを渡す。だから**見えない人が一緒に消える事故は起きない**。

---

## 5-5. 表のスイッチで有効／無効を切り替える

```text
スイッチを押す
 │  features/change-user-status/ui/UserActiveSwitch.tsx
 │    setActive([user.id], event.target.checked)
 │    notify("「〇〇」を無効にしました", "info")
 ▼
store が変わる → 表が再描画 → checked={user.active} が新しい値に
```

スイッチは自分で ON／OFF の状態を持っていない。**store の値をそのまま表示している**だけなので、store が変わらなければ見た目も変わらない。

---

## 5-6. 検索・絞り込みをする

```text
検索欄に「佐藤」と打つ
 │  features/user-filter/ui/UserFilterBar.tsx
 │    onChange → setKeyword("佐藤")
 ▼
useUserFilter（features/user-filter/model/useUserFilter.ts）
 │    setSearchParams(prev をコピーして q=佐藤 を入れる, { replace: true })
 ▼
URL が /users?q=佐藤 に変わる
 ▼
URL を読んでいるコンポーネントが再描画
 ├ UserFilterBar：useUserFilter() の keyword が "佐藤" → 入力欄に表示
 └ UserListPage：useUserFilter() の keyword が "佐藤"
      visibleUsers = filterUsers(users, "佐藤", "all")  … features/user-filter/model/filterUsers.ts
      → 表に佐藤さんだけ
```

- `UserFilterBar` と `UserListPage` は**それぞれ** `useUserFilter()` を呼んでいる。値の置き場所が URL 1 つなので、props で渡さなくても同じ値が読める
- 再読み込みしても URL に `?q=佐藤` が残るので、同じ結果になる
- 詳細ページへ行って「戻る」と、`/users?q=佐藤` に戻るので条件が残っている

---

## 5-7. 表とカードを切り替える

```text
[カード] を押す
 │  pages/user-list/ui/UserListPage.tsx
 │    ToggleButtonGroup の onChange → changeView("card")
 │    setSearchParams(prev をコピーして view=card を入れる)
 ▼
URL が /users?q=佐藤&view=card に（q は残る）
 ▼
UserListPage が再描画
 │    view = "card" → <UserCardGrid users={visibleUsers} onEdit={dialog.openEdit} />
 │    <UserTable> は画面から消える（選択していた行もリセット）
```

---

## 5-8. 詳細ページを開く・詳細から削除する

```text
表の名前（リンク）を押す
 │  widgets/user-table：<Link component={RouterLink} to="/users/u1">
 ▼
URL が /users/u1 に
 │  app/App.tsx：<Route path="/users/:id" element={<UserDetailPage />} />
 ▼
UserDetailPage
 │    useParams() → { id: "u1" }
 │    useUserStore((s) => s.users.find((u) => u.id === "u1")) → 佐藤さん
 │    見つからなければ「ユーザーが見つかりません」
 ▼
[削除] → 確認 → [削除]
 │  features/delete-user/ui/DeleteUserButton.tsx（variant="button"）
 │    removeUsers(["u1"])
 │    notify(…)
 │    onDeleted() = navigate("/users", { replace: true })   … 詳細ページが渡した関数
 ▼
一覧ページへ。履歴の詳細ページは一覧で置き換わっているので、「戻る」で消したユーザーのページに戻らない
```

---

## 5-9. ページを再読み込みする（保存と読み込み）

```text
アプリを開く
 │  entities/user/model/userStore.ts の persist
 │    localStorage の "user-management:users" を読む
 ▼
merge = mergeWithSchema(…)（shared/lib/persist.ts）
 │    何も保存されていない → seedUsers（6人）のまま
 │    zod のチェックに失敗   → console.warn して seedUsers のまま
 │    チェックに成功         → 保存されていた users を使う
 ▼
画面に一覧が出る

以後、addUser・updateUser・setActive・removeUsers で users が変わるたびに、
persist が partialize（{ users }）だけを localStorage に書き込む
```

---

## 5-10. まとめ：どの操作がどこを変えるか

| 操作                   | 変えるもの                         | 書いている場所                          | 確認ダイアログ | 通知 |
| ---------------------- | ---------------------------------- | --------------------------------------- | -------------- | ---- |
| 追加                   | store（`addUser`）                 | features/user-form                      | ―（フォーム）  | 緑   |
| 編集                   | store（`updateUser`）              | features/user-form                      | ―（フォーム）  | 緑   |
| 削除（1 人）           | store（`removeUsers`）             | features/delete-user                    | あり           | 緑   |
| 一括削除               | store（`removeUsers`）＋ 選択を空に | features/delete-user ＋ widgets/user-table | あり         | 緑   |
| 有効／無効（スイッチ） | store（`setActive`）               | features/change-user-status             | なし           | 青   |
| 一括で有効／無効       | store（`setActive`）               | features/change-user-status             | なし           | 青   |
| 検索・権限             | URL（`?q=`・`?role=`）             | features/user-filter                    | ―              | ―    |
| 表／カード             | URL（`?view=`）                    | pages/user-list                         | ―              | ―    |
| 行の選択               | state（`selectedIds`）             | widgets/user-table                      | ―              | ―    |
| ダイアログの開閉       | state（`useFormDialog`）           | pages                                   | ―              | ―    |
