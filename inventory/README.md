# 在庫管理（サンプル）

> [サンプル集の目次](../README.md)・共通の作りは目次の README を参照。

## お題

小さなお店の在庫を管理するアプリを作ってください。
商品を登録し、入庫・出庫のたびに在庫数を更新します。在庫が少なくなった商品がすぐ分かるようにしてください。
データはブラウザを閉じても残るようにしてください。

### 要件

**必須**

- [ ] 商品の一覧を表で表示する（商品名・カテゴリ・在庫数・発注点・状態・更新日時）
- [ ] 商品を登録・編集・削除できる（削除の前に確認する）
- [ ] 入力チェック：商品名は必須・30文字以内、カテゴリは必須、在庫数・発注点は 0〜9999 の整数
- [ ] 在庫数が 0 なら「在庫切れ」、発注点以下なら「在庫少」、それ以外は「在庫あり」と表示する
- [ ] 商品名のキーワード検索、カテゴリでの絞り込み
- [ ] データを localStorage に保存する（再読み込みしても残る）

**発展**

- [ ] 商品の詳細ページ（URL に商品の id を含める）
- [ ] 入庫・出庫を記録し、詳細ページに履歴を表示する。出庫数は在庫数を超えられない
- [ ] 「要発注のみ」の絞り込み。絞り込みの条件を URL に残す（再読み込み・共有しても同じ表示）
- [ ] 商品を削除したら、その商品の履歴も消す

## 画面と URL

| URL                   | 画面                                         |
| --------------------- | -------------------------------------------- |
| `/items`              | 一覧（`?category=food&low=1` で絞り込み）    |
| `/items/new`          | 新規登録                                     |
| `/items/:itemId`      | 詳細（入出庫の履歴つき）                     |
| `/items/:itemId/edit` | 編集                                         |
| （モーダル）          | 入出庫：一覧・詳細の「入出庫」ボタンから開く |

## 実装の順番（コミットの単位）

1. 環境構築、ルーティング（`/items`・`/items/new`・`/items/:itemId`・`/items/:itemId/edit`・404）
2. `entities/item`：zod スキーマ・型・カテゴリの選択肢・store（persist）
3. 一覧ページ（表・0件の表示）
4. 登録フォーム（`features/item-form`）と新規登録ページ
5. 詳細ページ・編集ページ（同じフォームを使い回す）
6. 削除（確認ダイアログ）
7. 在庫の状態（`getStockStatus`）とバッジ
8. キーワード検索・カテゴリ・要発注の絞り込み（URL に残す）
9. 入出庫：`entities/stock-movement`（履歴の store）、`features/adjust-stock`（フォーム）
10. 削除時に履歴も消す、詳細ページに履歴の表

## 解答の構成

```text
src/
├── app/                        App.tsx（ルーティング）・RootLayout・AppProviders・styles
├── pages/
│   ├── item-list/              一覧（検索・絞り込みは URL と useState）
│   ├── item-detail/            詳細（入出庫の履歴）
│   ├── item-new/               新規登録
│   ├── item-edit/              編集
│   └── not-found/
├── widgets/
│   └── item-table/             一覧表（商品の表示 ＋ 入出庫・削除の操作）
├── features/
│   ├── item-form/              登録・編集フォーム（新規と編集で共通）
│   ├── adjust-stock/           入出庫のモーダル（在庫数を変える ＋ 履歴を残す）
│   └── delete-item/            削除ボタン（商品 ＋ 履歴を消す）
├── entities/
│   ├── item/                   商品の型・store・在庫の状態の判定・バッジ
│   └── stock-movement/         入出庫の履歴の型・store・履歴の表
└── shared/                     ui（部品）・lib（日付・persist）・config（localStorage のキー）
```

## 学習ポイント

| ポイント                                                   | 見るところ                                                                                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| zod のスキーマから型を作る（`z.infer`）                    | [entities/item/model/item.ts](src/entities/item/model/item.ts)                                                                            |
| Zustand ＋ persist の基本（説明が一番詳しい）              | [entities/item/model/itemStore.ts](src/entities/item/model/itemStore.ts)                                                                  |
| 読み込んだデータを zod でチェック                          | [shared/lib/persist.ts](src/shared/lib/persist.ts)                                                                                        |
| 選択肢は `as const` の配列 ＋ `Record` の表示名            | [entities/item/model/item.ts](src/entities/item/model/item.ts)                                                                            |
| 状態の判定を entities に置く                               | `getStockStatus`（[item.ts](src/entities/item/model/item.ts)）・[ItemStockBadge](src/entities/item/ui/ItemStockBadge.tsx)                 |
| 入力中と送信後で型が違う（`z.input`/`z.output`）           | [features/item-form/model/schema.ts](src/features/item-form/model/schema.ts)                                                              |
| 数値の入力（`valueAsNumber`）                              | [features/item-form/ui/ItemForm.tsx](src/features/item-form/ui/ItemForm.tsx)                                                              |
| 登録と編集でフォームを共通化（`defaultValues`・`key`）     | [item-new](src/pages/item-new/ui/ItemNewPage.tsx)・[item-edit](src/pages/item-edit/ui/ItemEditPage.tsx)                                   |
| 他の値によって変わるチェック（スキーマの工場 ＋ `refine`） | [features/adjust-stock/model/schema.ts](src/features/adjust-stock/model/schema.ts)                                                        |
| 入力中の値を読む（`useWatch`）                             | [features/adjust-stock/ui/AdjustStockForm.tsx](src/features/adjust-stock/ui/AdjustStockForm.tsx)                                          |
| 2つの store を features でまとめて動かす                   | [AdjustStockForm](src/features/adjust-stock/ui/AdjustStockForm.tsx)・[DeleteItemButton](src/features/delete-item/ui/DeleteItemButton.tsx) |
| モーダルを開くたびにフォームを作り直す                     | [features/adjust-stock/ui/AdjustStockButton.tsx](src/features/adjust-stock/ui/AdjustStockButton.tsx)                                      |
| URL の値を1つだけ変える（他は残す）                        | `updateParam`（[pages/item-list/ui/ItemListPage.tsx](src/pages/item-list/ui/ItemListPage.tsx)）                                           |
| `useParams` と「見つからない」表示                         | [pages/item-detail/ui/ItemDetailPage.tsx](src/pages/item-detail/ui/ItemDetailPage.tsx)                                                    |
| 表（列の定義 ＋ 配列）                                     | [widgets/item-table/ui/ItemTable.tsx](src/widgets/item-table/ui/ItemTable.tsx)                                                            |

## 動かし方

```bash
cd frontend/exam/samples
npm install
npm run dev -w inventory
```
