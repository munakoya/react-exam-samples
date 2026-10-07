# 3. 機能を作る（ステップ 1〜9）

> [目次](README.md) ｜ 前：[2. 雛形で環境を作る](02-start.md) ｜ 次：[4. 仕上げと提出](04-finish.md)

**1 ステップ = 動く状態 = 1 コミット**。どのステップの終わりでも、アプリは動いている。
各ステップは同じ形で書いてある：

- **作るファイル**：どの層に、何というファイルを作るか。「写すもの」は雛形の各フォルダの `README.md`（書き方）か、完成形のサンプル
- **やること**：上から順にチェックしていけば漏れない
- **終わりの確認**：ブラウザで確かめること。全部できたらコミット
- **よくある漏れ**：後で直すことになりやすいもの

例のお題は「商品（Item）の管理」。名前はお題に合わせて変える（`item` → `book`・`task`・`user` など）。

| ステップ | 作るもの                               | 目安  | 必須／発展 |
| -------- | -------------------------------------- | ----- | ---------- |
| 1        | 型・選択肢・store（entities）          | 15 分 | 必須       |
| 2        | 一覧ページ                             | 15 分 | 必須       |
| 3        | 追加（ダイアログ）                     | 20 分 | 必須       |
| 4        | 編集（同じダイアログ）                 | 10 分 | 必須       |
| 5        | 削除（確認ダイアログ）・通知           | 10 分 | 必須       |
| 6        | 詳細ページ                             | 15 分 | 要件しだい |
| 7        | お題固有の操作                         | 25 分 | 要件しだい |
| 8        | 検索・絞り込み・並び替え               | 20 分 | 発展が多い |
| 9        | 発展（一括操作・集計・カード表示など） | 残り  | 発展       |

---

## ステップ 1：型・選択肢・store（entities）

**作るファイル**

| 層       | ファイル                              | 写すもの                                                                                     |
| -------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| entities | `entities/item/model/item.ts`         | 雛形 `src/entities/README.md` の「model/item.ts」                                            |
| entities | `entities/item/model/itemStore.ts`    | 同じく「model/itemStore.ts」                                                                 |
| entities | `entities/item/index.ts`              | 同じく「index.ts（窓口）」                                                                   |

**やること**

- [ ] 選択肢（種類・ステータスなど）を「値の配列・表示名・`{ value, label }` の配列」の 3 点セットで書く
- [ ] zod のスキーマを書き、型は `z.infer` で作る。`id`・`createdAt`・`updatedAt` を入れる
- [ ] フォームから受け取る型 `ItemInput`（`Omit<Item, "id" | "createdAt" | "updatedAt">`）を作る
- [ ] store に `items` と `addItem`・`updateItem`・`removeItems` を書く。**計算できる値（件数・合計）は入れない**
- [ ] `persist` の `name` は `storageKey("items")`、`merge` は `mergeWithSchema(…)`
- [ ] `index.ts` から、外で使うものだけを export する

**終わりの確認**

- [ ] `npm run build` が通る（まだ画面は変わらない）

```bash
git commit -m "商品の型と store を作成"
```

**よくある漏れ**：日付は `"YYYY-MM-DD"` の文字列で持つ（Date 型にしない）。任意の項目は `""` か `null` のどちらかにそろえる。
詳しく：[解説書 4-3. Zustand](../../library/docs/04-libraries.md#4-3-zustand)・[4-4. zod](../../library/docs/04-libraries.md#4-4-zod)

---

## ステップ 2：一覧ページ

**作るファイル**

| 層    | ファイル                                 | 写すもの                                                                                         |
| ----- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| pages | `pages/item-list/ui/ItemListPage.tsx`    | 雛形 `src/pages/README.md` の「item-list」（最初はダイアログの行を除く）                         |
| pages | `pages/item-list/index.ts`               | `export { ItemListPage } from "./ui/ItemListPage";`                                              |
| app   | `app/App.tsx`・`app/layouts/RootLayout.tsx` | Route とメニューを足す                                                                        |

**やること**

- [ ] `App.tsx` に `<Route path="/items" element={<ItemListPage />} />` を足す
- [ ] トップを一覧へ飛ばす：`<Route index element={<Navigate to="/items" replace />} />`（`pages/home` は消してよい）
- [ ] `RootLayout.tsx` のメニューに `{ to: "/items", label: "商品一覧", icon: <…Icon /> }` を足す
- [ ] 一覧は最初は表を直接書くか、`DataTable` に `rows`・`columns` だけを渡す（操作のボタンはまだ）
- [ ] 0 件のときは表の代わりに `EmptyState` を出す

**終わりの確認**

- [ ] メニューから一覧が開く。0 件の案内が出る
- [ ] DevTools → Application → Local Storage にデータを手で入れると、表に出る（なくてもよい）

```bash
git commit -m "商品の一覧ページを作成"
```

**よくある漏れ**：`useItemStore((s) => s.items.filter(…))` のようにセレクターの中で絞り込む（無限に再描画）。`items` を選んでから画面で絞り込む。
見本：[MUI 部品カタログ › DataTable](https://munakoya.github.io/react-exam-samples/mui-catalog/data-table)・[MUI 画面構築ガイド 6-1. 一覧ページ](../../mui-catalog/docs/06-page-patterns.md#6-1-一覧ページ)

---

## ステップ 3：追加（ダイアログ）

**作るファイル**

| 層       | ファイル                                       | 写すもの                                                  |
| -------- | ---------------------------------------------- | --------------------------------------------------------- |
| features | `features/item-form/model/schema.ts`           | 雛形 `src/features/README.md` の「item-form/model/schema.ts」 |
| features | `features/item-form/ui/ItemFormDialog.tsx`     | 同じく「item-form/ui/ItemFormDialog.tsx」                  |
| features | `features/item-form/index.ts`                  | `export { ItemFormDialog } from "./ui/ItemFormDialog";`   |
| pages    | `pages/item-list/ui/ItemListPage.tsx`          | `useFormDialog`・追加ボタン・`<ItemFormDialog>` を足す     |

**やること**

- [ ] フォームのスキーマに、要件の入力チェック（必須・文字数・数値の範囲・形式）を**全部**書く。エラー文は日本語
- [ ] `toFormInput(item?)` で初期値を作る（数値の欄は文字列 `""` で始める）
- [ ] 入力欄は `FormTextField`。セレクトは `select` ＋ `MenuItem`、日付は `type="date"` ＋ `slotProps={{ inputLabel: { shrink: true } }}`
- [ ] ページで `const dialog = useFormDialog<Item>()`、追加ボタンの `onClick={dialog.openNew}`
- [ ] ダイアログはページに 1 つ：`<ItemFormDialog open={dialog.open} item={dialog.target} onClose={dialog.close} />`
- [ ] 保存したら `notify("「…」を追加しました")` → ダイアログを閉じる
- [ ] 0 件の `EmptyState` にも同じ追加ボタンを置く

**終わりの確認**

- [ ] 空のまま「追加」→ 各欄の下にエラーが出て、最初のエラーの欄にカーソルが移る
- [ ] 正しく入れて「追加」→ ダイアログが閉じ、一覧に増え、下に通知が出る
- [ ] **再読み込みしても残っている**
- [ ] もう一度開くと、空のフォームから始まる。Esc・キャンセルで閉じる

```bash
git commit -m "商品の追加（ダイアログ）を作成"
```

**よくある漏れ**：数値の欄を `z.number()` にして「Expected number」になる（`z.coerce.number<string>()` を使う）。
ラジオ・チェックボックス・スイッチ・星・タグのつなぎ方は [MUI 画面構築ガイド 3. フォーム](../../mui-catalog/docs/03-forms.md)。
見本：[画面パターン › 追加モーダル](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/add-dialog)。
追加を**ページ**でやるなら：[解説書 5. ステップ 4](../../library/docs/05-implementation.md#ステップ-4登録フォーム登録ページ)

---

## ステップ 4：編集（同じダイアログ）

**作るファイル**

| 層    | ファイル                                       | 写すもの                                                         |
| ----- | ---------------------------------------------- | ---------------------------------------------------------------- |
| pages | `pages/item-list/ui/ItemListPage.tsx`          | 表に `onEdit={dialog.openEdit}` を渡す                           |
| （表）| ページの表・または `widgets/item-table/ui/ItemTable.tsx` | 雛形 `src/widgets/README.md`：`rowActions` に編集ボタン |

**やること**

- [ ] 表の行（カードなら `actions`）に編集ボタンを置き、`onClick={() => onEdit(item)}`
- [ ] ページで `onEdit={dialog.openEdit}` を渡す（ダイアログはステップ 3 のものを使い回す）
- [ ] フォームは `item` があれば「編集」の見出し・「更新」のボタン、`updateItem` で保存
- [ ] アイコンだけのボタンには `aria-label={`「${item.name}」を編集`}` と `Tooltip`

**終わりの確認**

- [ ] 編集を押すと**今の値が入った**ダイアログが開く。保存すると一覧に反映され、通知が出る
- [ ] 別の行の編集を開くと、その行の値になっている。追加を開くと空に戻る

```bash
git commit -m "商品の編集を追加"
```

**よくある漏れ**：重複チェック（同じ名前・メールは不可）があるなら、編集のときは「自分以外」と比べる。
見本：[画面パターン › 編集モーダル](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/edit-dialog)

---

## ステップ 5：削除（確認ダイアログ）・通知

**作るファイル**

| 層       | ファイル                                        | 写すもの                                                         |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| features | `features/delete-item/ui/DeleteItemButton.tsx`  | 雛形 `src/features/README.md` の「delete-item」                  |
| features | `features/delete-item/index.ts`                 | `export { DeleteItemButton } from "./ui/DeleteItemButton";`      |
| （表）   | 表の `rowActions`                               | 編集ボタンの横に `<DeleteItemButton item={item} />`              |

**やること**

- [ ] 削除ボタンと `ConfirmDialog` をセットにした部品を作る。開閉はボタンの中の `useState(false)`
- [ ] 確認の文に「何を消すか」を入れる：`「りんご」を削除します。この操作は取り消せません。`
- [ ] 「削除」で store から消す → `notify(…)`。「キャンセル」・Esc では何もしない

**終わりの確認**

- [ ] キャンセルで何も起きない。削除で一覧から消え、通知が出る。再読み込みしても消えている
- [ ] 最後の 1 件を消すと、0 件の案内に変わる

```bash
git commit -m "商品の削除（確認ダイアログ）を追加"
```

**よくある漏れ**：消すとほかのデータに影響する（注文の中の商品、貸出中の本）なら、削除を止めるか一緒に消す（[解説書 5. ステップ 10](../../library/docs/05-implementation.md#ステップ-10評価タグ削除の制限)）。
見本：[画面パターン › 削除の確認](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/delete-confirm)

---

## ステップ 6：詳細ページ（要件にあれば）

**作るファイル**

| 層    | ファイル                                     | 写すもの                                                   |
| ----- | -------------------------------------------- | ---------------------------------------------------------- |
| pages | `pages/item-detail/ui/ItemDetailPage.tsx`    | 雛形 `src/pages/README.md` の「item-detail」               |
| pages | `pages/item-detail/index.ts`                 | `export { ItemDetailPage } from "./ui/ItemDetailPage";`    |
| app   | `app/App.tsx`                                | `<Route path="/items/:id" element={<ItemDetailPage />} />` |

**やること**

- [ ] `useParams()` で id を受け取り、`useItemStore((s) => s.items.find((i) => i.id === id))` で 1 件選ぶ
- [ ] 見つからないとき（削除済み・URL の打ち間違い）は `EmptyState` と「一覧へ」ボタン
- [ ] `PageHeader` にパンくず（一覧 › 名前）と、右に編集・削除ボタン
- [ ] 項目は `DescriptionList`。改行のあるメモは `multiline: true`
- [ ] 削除したら `onDeleted={() => navigate("/items", { replace: true })}` で一覧へ戻る
- [ ] 一覧の名前を `Link component={RouterLink} to={`/items/${item.id}`}` にして詳細へ行けるようにする

**終わりの確認**

- [ ] 一覧 → 詳細 → 編集 → 保存で値が変わる。削除で一覧に戻る
- [ ] `/items/abc` のような存在しない URL で「見つかりません」が出る
- [ ] 詳細ページで再読み込みしても表示される

```bash
git commit -m "商品の詳細ページを作成"
```

見本：[MUI 画面構築ガイド 6-2. 詳細ページ](../../mui-catalog/docs/06-page-patterns.md#6-2-詳細ページ)

---

## ステップ 7：お題固有の操作

追加・編集・削除のほかに、お題ごとの「業務の操作」がある。form でまとめて編集するのではなく、**専用のボタン・ダイアログ**を features に作る。

| お題の例     | 操作                         | 作り方の例                                                                                                   |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| タスク管理   | ステータスを変える           | 行のセレクト・ボタン。store に `changeStatus(id, status)`（[task-manager-mui](../../task-manager-mui/README.md)） |
| 在庫管理     | 入庫・出庫（在庫数を増減）   | ダイアログで数量を入力。出庫は在庫数を超えないチェック（`superRefine`）                                     |
| 蔵書管理     | 貸出・返却                   | 別の store（貸出の記録）を作り、状態は計算（[library](../../library/README.md)）                             |
| ユーザー管理 | 有効／無効を切り替える       | 行のスイッチ。取り消せるので確認なし（[user-management](../../user-management/README.md)）                   |
| EC           | カートに入れる・注文を確定   | カートの store、合計は計算                                                                                   |

**やること**

- [ ] store に操作の action を足す（`changeStatus`・`stockIn` など）。1 項目だけ変えるなら、フォームでなくボタン・スイッチ・セレクト
- [ ] 操作できない条件（在庫 0・貸出中）はボタンを `disabled` にし、理由を `Tooltip` で出す
- [ ] 状態（期限切れ・在庫切れ）は**保存せず計算**し、`Chip` や色で目立たせる
- [ ] 取り消せない操作だけ確認ダイアログを出す

**終わりの確認**

- [ ] 操作の結果が一覧・詳細の両方に反映され、再読み込みしても残る
- [ ] 押せない条件のときに押せない（理由が分かる）

```bash
git commit -m "（操作の名前）を追加"
```

---

## ステップ 8：検索・絞り込み・並び替え

**作るファイル**

| 層       | ファイル                                        | 写すもの                                                                                                         |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| features | `features/item-filter/model/useItemFilter.ts`   | [useUserFilter.ts](../../user-management/src/features/user-filter/model/useUserFilter.ts)（条件を URL で持つ） |
| features | `features/item-filter/model/filterItems.ts`     | [filterUsers.ts](../../user-management/src/features/user-filter/model/filterUsers.ts)（条件に合うものを返す） |
| features | `features/item-filter/ui/ItemFilterBar.tsx`     | [UserFilterBar.tsx](../../user-management/src/features/user-filter/ui/UserFilterBar.tsx)（検索欄・セレクト）  |

**やること**

- [ ] 条件は `useSearchParams` で URL に持つ（`?q=りんご&category=food`）。`{ replace: true }` で履歴を増やさない
- [ ] 絞り込んだ結果は**計算**する（`const visibleItems = filterItems(items, keyword, category)`）
- [ ] 並び替えは `DataTable` の `sortValue` を渡す（列の見出しで切り替え）か、セレクトで選ぶ
- [ ] 「1 件もない」と「条件に合うものがない」で `EmptyState` の文言を変える

**終わりの確認**

- [ ] 条件を変えると URL が変わり、再読み込み・詳細から「戻る」でも同じ表示
- [ ] 条件に合うものがないとき、案内が出る

```bash
git commit -m "検索・絞り込み・並び替えを追加"
```

見本：[画面パターン › 検索・絞り込み](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/search-filter)。
ページ送りの位置まで URL に持つ形は [解説書 5. ステップ 8](../../library/docs/05-implementation.md#ステップ-8絞り込み並び替えページ送りurl-に残す)。

---

## ステップ 9：発展

要件の発展に書かれているものだけを、**1 つずつ作ってコミット**する。

| 発展の例                       | 作り方                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| チェックボックスでまとめて削除 | `DataTable` に `selectedIds`・`selectionActions`（[画面パターン › 選択できる表](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/selectable-table)） |
| 件数・合計の表示               | `StatCard` を `Grid` で並べる。数字はすべて計算（[解説書 5. ステップ 9](../../library/docs/05-implementation.md#ステップ-9貸出一覧ダッシュボード)） |
| 表とカードの切り替え           | `ToggleButtonGroup`。値は URL（`?view=card`）（[UserListPage.tsx](../../user-management/src/pages/user-list/ui/UserListPage.tsx)） |
| ページ送り                     | `DataTable` に `pageSize={10}`                                                                                               |
| 星の評価・タグ                 | `Rating`・`Autocomplete` を `Controller` でつなぐ（[MUI 画面構築ガイド 3. フォーム](../../mui-catalog/docs/03-forms.md)）    |
| タブで分ける                   | `Tabs`。選んでいるタブは URL（[MUI 画面構築ガイド 6-5](../../mui-catalog/docs/06-page-patterns.md#6-5-タブで分ける一覧)）    |

**終わりの確認**（発展 1 つごと）

- [ ] 必須の機能が壊れていない（追加・編集・削除をもう一度試す）
- [ ] 再読み込みしても状態が正しい

```bash
git commit -m "（発展の機能）を追加"
```

時間が残り 20 分になったら、作りかけの発展は止めて（動かない部分は消して）、[4. 仕上げと提出](04-finish.md) へ進む。
