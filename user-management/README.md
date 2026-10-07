# ユーザー管理（サンプル・MUI 版）

> [サンプル集の目次](../README.md)・MUI 版の共通の作りは目次の README を参照。
>
> **試験でよく出る CRUD の UI をひととおり入れたサンプル**。追加ボタン → モーダル、カードの「編集」→ 編集モーダル、削除 → 確認ダイアログ、チェックボックスで選べる表（一括操作・行の編集／削除ボタン）。
> 同じ UI を 1 ファイルで書いた見本と、このアプリの実際のファイルは [MUI 部品カタログの「画面パターン（CRUD）」](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/crud-overview) で並べて見られる。
>
> **全ファイルの「どこに・何を・なぜ」と、ゼロから作る手順は [解説書](docs/README.md) にまとめてある。**

## お題

社内のユーザー（アカウント）を管理するアプリを作ってください。
一覧は表とカードを切り替えて表示でき、表ではチェックボックスで複数のユーザーを選んでまとめて操作できるようにしてください。
追加・編集はダイアログ（モーダル）で行い、削除の前には確認を出してください。
UI には Material UI（MUI）を使い、データはブラウザを閉じても残るようにしてください。

### 要件

**必須**

- [ ] ユーザーを追加・編集・削除できる（追加・編集は一覧の上に重なるダイアログで行う）
- [ ] 項目：名前（必須・30文字以内）、メールアドレス（必須・形式チェック・重複不可）、権限（管理者・編集者・閲覧者）、部署、入社日（必須）、有効／無効
- [ ] 一覧は表で表示し、行ごとに編集・削除のボタンを置く
- [ ] 削除の前に確認ダイアログを出す
- [ ] データを localStorage に保存する

**発展**

- [ ] 表のチェックボックスで複数選び、まとめて削除・有効／無効にする（見出しのチェックボックスで全選択）
- [ ] 表の見出しで並び替え、10 件ずつのページ送り
- [ ] 表の中のスイッチで、有効／無効をその場で切り替える
- [ ] 表とカードの表示を切り替える。カードの「編集」からも編集ダイアログを開く
- [ ] 名前・メールアドレスで検索、権限で絞り込み。条件と表示の切り替えは URL に持つ
- [ ] 詳細ページ（`/users/:id`）。そこからも編集・削除でき、削除したら一覧へ戻る

## 画面と URL

| URL          | 画面                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| `/users`     | 一覧（表／カード、`?q=`・`?role=`・`?view=card`）。追加・編集はダイアログ |
| `/users/:id` | 詳細（編集・削除）                                                        |

## 実装の順番（コミットの単位）

1. 環境構築（MUI・テーマ・shared/ui）、ルーティング（`/users`・`/users/:id`・404）と共通の枠（AppShell）
2. `entities/user`：選択肢・zod スキーマ・store（persist）、Chip・Avatar・Card
3. 一覧の表（`widgets/user-table`：shared/ui の `DataTable` に列の定義を渡す）
4. 追加・編集のダイアログ（`features/user-form`：`DialogForm` ＋ `useFormDialog`）
5. 削除（`features/delete-user`：ボタン ＋ `ConfirmDialog`）、通知（Notifier）
6. 表のチェックボックスで選択 → 一括削除・一括の有効／無効、行のスイッチ
7. 検索・絞り込み（`features/user-filter`、URL に持つ）
8. カード表示（`widgets/user-card-grid`）と表示の切り替え
9. 詳細ページ

## 解答の構成

```text
src/
├── app/                              App.tsx・RootLayout（AppShell）・AppProviders（テーマ・Router・通知）・theme.ts
├── pages/
│   ├── user-list/                    一覧：追加ボタン・絞り込み・表／カードの切り替え・ダイアログを1つ置く
│   ├── user-detail/                  詳細：同じダイアログ・削除ボタンを使い回す
│   └── not-found/
├── widgets/
│   ├── user-table/                   DataTable ＋ 列の定義 ＋ 選択・一括操作 ＋ 行の編集／削除
│   └── user-card-grid/               UserCard に 詳細・編集・削除 のボタンを差し込んで Grid に並べる
├── features/
│   ├── user-form/                    追加・編集のダイアログ（schema.ts：重複チェック・初期値 toFormInput）
│   ├── delete-user/                  DeleteUserButton（1件）・DeleteUsersButton（まとめて）＋ 確認ダイアログ
│   ├── change-user-status/           行のスイッチ・まとめて有効／無効
│   └── user-filter/                  検索・権限の条件を URL で持つ・filterUsers
├── entities/
│   └── user/                         型（zod）・選択肢・store・UserCard・UserRoleChip・UserAvatar
└── shared/
    ├── ui/                           DataTable・DialogForm（useFormDialog）・ConfirmDialog・FormTextField など
    ├── lib/                          日付・persist の読み込みチェック
    └── config/                       localStorage のキー
```

## 学習ポイント

### 1. 追加と編集で同じダイアログを使い回す

```tsx
// pages：ダイアログは1つだけ置く
const dialog = useFormDialog<User>();          // open・target・openNew・openEdit・close
<Button onClick={dialog.openNew}>追加</Button>
<UserTable users={visibleUsers} onEdit={dialog.openEdit} />
<UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
```

- `target` が undefined なら追加、値があれば編集。フォームの初期値は `toFormInput(user)`
- `<Dialog>` は閉じると中身を消すので、`useForm` を中身の部品に書けば、開くたびに初期値から始まる（`reset()` が要らない）

### 2. entities はボタンを持たない

`UserCard` は見せ方だけ。編集・削除のボタンは widgets（`UserCardGrid`）で `actions` に差し込む。
同じカードを、別の画面では別のボタンで使い回せる。

### 3. 表の選択は「id の配列」

選択中の id は `useState<string[]>([])`。一括操作のボタンには `ids` を渡す。
絞り込みで見えなくなった行は「選択中」に数えない（`DataTable` の中で rows にある id だけを数える）。

### 4. 確認を出すのは取り消せない操作だけ

削除は `ConfirmDialog` で確認。有効／無効の切り替えは取り消せるので、確認なしで通知だけ出す。

### 5. 重複チェックは「自分以外」と比べる

スキーマを関数（`createUserFormSchema(otherEmails)`）で作り、編集中のユーザーを除いたメールアドレスを渡す。

## 動かし方

```bash
npm run dev -w user-management
```

最初から 6 人分のデータが入っている。消したいときは DevTools の Application → Local Storage で `user-management:users` を削除する。
