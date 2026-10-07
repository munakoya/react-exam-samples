# 7. つまずきと判断の基準

> [目次](README.md) ｜ 前：[6. ゼロから作る手順](06-build-steps.md)

このアプリを作るときに起きやすいバグと直し方、迷ったときの決め方、提出前のチェックリスト。

---

## 7-1. よくあるバグと直し方

### 画面が真っ白になり、`Maximum update depth exceeded` が出る

**原因**：Zustand のセレクターの中で `filter`・`map`・`{ … }` を使い、毎回新しい値を返している。

```ts
// ✕
const activeUsers = useUserStore((state) => state.users.filter((u) => u.active));
// ○ 配列を選んでから、コンポーネントの中で絞る
const users = useUserStore((state) => state.users);
const activeUsers = users.filter((u) => u.active);
```

`find` は store の中の同じオブジェクトを返すので、セレクターの中で使ってよい（詳細ページ）。

### 編集ダイアログを開くと、前に開いたユーザーの値が入っている

**原因**：`useForm` を `<Dialog>` と同じコンポーネントに書いている。`defaultValues` は最初の 1 回しか使われない。
**直し方**：`<Dialog>` の**中身**を別のコンポーネント（`UserForm`）にして、`useForm` をそこに書く（[3 章](03-entities-features.md) の UserFormDialog）。

### 何も変えずに編集を保存すると「このメールアドレスは登録済みです」

**原因**：重複チェックで、自分自身のメールアドレスとも比べている。
**直し方**：`users.filter((o) => o.id !== user?.id)` で**自分を除いて**からスキーマに渡す。

### ダイアログを閉じる瞬間、見出しが「編集」→「追加」に変わって見える

**原因**：閉じるときに編集中のユーザー（`target`）も消している。
**直し方**：`close` では `open` だけを `false` にし、`target` は残す（`useFormDialog`）。

### 検索すると、表示の切り替え（`?view=card`）が消える

**原因**：`setSearchParams({ q: keyword })` と書くと、URL の検索条件が丸ごと置き換わる。
**直し方**：`(prev) => { const next = new URLSearchParams(prev); next.set(…); return next; }` で、今の URL をコピーしてから 1 つだけ変える。

### 1 文字打つごとに履歴が増え、「戻る」が効かない

**直し方**：`setSearchParams(…, { replace: true })`。

### Switch を押しても値が変わらない・`true` が `"on"` になる

**原因**：Switch に `value` を渡している、または `event.target.value` を使っている。
**直し方**：`checked={field.value}` と `field.onChange(event.target.checked)`。Switch・Checkbox は `checked`。

### 一括削除のあと、「0件選択中」の帯が残る・次に選んだときに数がおかしい

**直し方**：`DeleteUsersButton` の `onDeleted` で `setSelectedIds([])`。
また `DataTable` は `selectedIds` そのままではなく、`rows` にいる id（`selectedRowIds`）だけを数える。

### 詳細ページで削除すると、一瞬「見つかりません」が出る・戻るで消したユーザーのページに戻る

**直し方**：`onDeleted={() => navigate("/users", { replace: true })}`。`AppProviders` の `BrowserRouter` に `useTransitions={false}` を付けると、store の更新と画面の移動が書いた順に反映される。

### `Rendered more hooks than during the previous render`

**原因**：`if (!user) return …` の**後**でフックを呼んでいる。
**直し方**：`useParams`・`useUserStore`・`useNavigate`・`useFormDialog` を全部、早期 return より前に書く。

### `npm run build` で失敗する（dev では動く）

| エラー                                       | 直し方                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `'xxx' is declared but its value is never read` | 使っていない import・変数を消す。使わない引数は `_event` のように `_` |
| `Cannot find module '@/…'`                   | `tsconfig.app.json` の `paths` を確認（vite.config だけでは型が通らない） |
| `Type 'string' is not assignable to type 'UserRole'` | URL などから来た文字列は、型ガード（`isUserRole`）で確かめてから使う |

### 再読み込みすると画面が真っ白（`Cannot read properties of undefined`）

**原因**：型を変える前の古いデータが localStorage に残っている。
**直し方**：DevTools → Application → Local Storage で `user-management:users` を消す。根本的には persist の `merge: mergeWithSchema(…)` で形をチェックする。

---

## 7-2. 迷ったときの決め方

### 追加・編集は「ページ」か「ダイアログ」か

| こんなとき                                           | 選ぶもの   | このアプリでは                       |
| ---------------------------------------------------- | ---------- | ------------------------------------ |
| お題に「モーダル」「ダイアログ」と書いてある         | ダイアログ | ←（要件に書いてある）                |
| 項目が少ない（〜6 個）・一覧を見ながら操作したい     | ダイアログ | 項目は 6 個                          |
| 項目が多い・URL で開きたい・戻るボタンで戻りたい     | ページ     | 蔵書管理（library）はページ          |

### 確認ダイアログを出すか

| 操作                                   | 確認       | 代わりに           |
| -------------------------------------- | ---------- | ------------------ |
| 削除（取り消せない）                   | **出す**   | ―                  |
| 有効／無効の切り替え（もう一度押せば戻る） | 出さない | 通知で結果を伝える |
| 追加・編集（フォームの送信）           | 出さない   | 通知               |

確認を出しすぎると、ユーザーは読まずに「OK」を押すようになる。本当に危ない操作だけにする。

### 状態をどこに置くか

```text
ほかの値から計算できる？ ── はい → 持たない（描画のたびに計算）
  │いいえ
再読み込み・URL の共有で残したい？ ── はい → URL（useSearchParams）
  │いいえ
離れた画面・部品からも読み書きする？ ── はい → Zustand の store（残すなら persist）
  │いいえ
その部品の中だけで使う → useState（使う部品のいちばん近くに）
```

### どの層に書くか

[1 章の表](01-map.md) を見る。迷ったら「ユーザーを知らなくても書けるか」（→ shared）、「操作か、見せ方か」（→ features か entities）から考える。

### 部品に分けるか

- **2 か所以上で使う** → 分ける（`UserRoleChip`・`DeleteUserButton`）
- **1 つのファイルが 1 画面に収まらない** → 分ける（`UserTable` をページから出した）
- 1 か所でしか使わず短い → 分けない（`ViewMode` の切り替えはページに直接書いた）

---

## 7-3. このアプリを広げるなら

試験の発展課題でよく出るもの。どこに何を足すかの見当をつける練習になる。

| 足したいもの                          | 足す場所                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| 部署でも絞り込む                      | `useUserFilter` に `department`、`filterUsers` に条件、`UserFilterBar` にセレクト |
| メールの重複を大文字・小文字を無視して判定 | `schema.ts` の `refine` で `toLowerCase()` して比べる                |
| 最後の管理者は削除・無効にできない     | `DeleteUserButton`・`UserActiveSwitch` で `disabled`（管理者の数は store の `users` から計算） |
| 一括で権限を変える                    | store に `setRole(ids, role)`、`features/change-user-role` を作り、`UserTable` の `selectionActions` に並べる |
| 1 ページの行数を変えられる            | `DataTable` の `rowsPerPageOptions` と `onRowsPerPageChange`             |
| ダッシュボード（権限ごとの人数）      | `pages/dashboard` を作り、`shared/ui/StatCard` を並べる。人数は `users` から計算 |

---

## 7-4. 提出前のチェックリスト

### 必須の要件

- [ ] 追加・編集がダイアログで行える。編集では今の値が入っている
- [ ] 名前：空・31 文字以上でエラー。前後の空白だけでもエラー
- [ ] メール：空・形式違い・他人と重複でエラー。自分のままなら保存できる
- [ ] 権限・部署はセレクト、入社日は日付（空でエラー）、有効／無効はスイッチ
- [ ] 表の各行に編集・削除のボタンがある
- [ ] 削除の前に確認が出る。キャンセルで何も起きない
- [ ] 再読み込みしてもデータが残る

### 発展の要件

- [ ] チェックで選んで一括削除・一括の有効／無効。見出しの ☐ で全選択
- [ ] 見出しで並び替え、10 件ずつのページ送り
- [ ] 表のスイッチで有効／無効が切り替わる
- [ ] 表とカードの切り替え。カードの「編集」でも同じダイアログが開く
- [ ] 検索・権限の絞り込み。条件と表示が URL に残る
- [ ] 詳細ページで編集・削除。削除したら一覧へ戻る

### 動き・見た目

- [ ] 0 人のとき・絞り込みで 0 人のときに案内が出る
- [ ] `/users/存在しない id`・`/xxx` で案内が出る
- [ ] 操作のたびに通知が出る
- [ ] スマホ幅でレイアウトが崩れない（表は横スクロール、メニューは ☰）
- [ ] アイコンだけのボタンに `aria-label`（誰の編集・削除か）

### コード

- [ ] `npm run lint`・`npm run build` が通る
- [ ] コンソールにエラー・警告が出ていない
- [ ] 層のルールを守っている（features が別の features を import していない、entities がボタンを持っていない）
- [ ] 計算できる値を state に入れていない
- [ ] ステップごとにコミットしている
