# MUI 部品カタログ ＋ MUI 画面構築ガイド

> [サンプル集の目次](../README.md)

Material UI（`@mui/material` v9）で画面を作るための資料。2 つに分かれている。

| 資料                                            | 中身                                                                                                    | こんなときに見る                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **MUI 部品カタログ**（このアプリ）              | 部品ごとに、押さえどころ・動く見本（コードをコピーできる）・主な props・公式ドキュメントへのリンク     | 「この部品はどう書く？」を調べるとき |
| **[MUI 画面構築ガイド](docs/README.md)**（読みもの。[ブラウザで読む](https://munakoya.github.io/react-exam-samples/guide/mui-guide)） | 土台（テーマ・sx）、レイアウト、フォーム、一覧、ダイアログと通知、画面パターン集、お題別の部品の選び方 | 「この画面はどう組む？」を調べるとき |

ライブラリ（zod・Zustand・React Hook Form・React Router）と組み合わせて FSD で作ったアプリは [蔵書管理（library）](../library/) にある。

```bash
npm run dev -w mui-catalog
```

公開ページ：https://munakoya.github.io/react-exam-samples/mui-catalog/

## ページ

| URL       | 内容                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `/`       | 部品を探す（部品名・やりたいことで検索）、使い始め方、v9 で変わった書き方              |
| `/theme`  | テーマの値（色・余白・角丸・ブレークポイント・文字）と sx の書き方。名前を押すとコピー |
| `/patterns/:slug` | 画面パターン（CRUD）。1 ファイル版の見本と、ユーザー管理アプリの実際のファイル（FSD の層つき）を並べて見る |
| `/:slug`  | 部品 1 つ分のページ（`/button`・`/text-field`・`/notifier` など 49 部品）。「サンプルアプリでの使用例」つき |

| 画面パターン（CRUD）      | 中身                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `crud-overview` 全体像    | CRUD 画面を 1 ファイルで書いた見本と、FSD の層ごとのファイル                         |
| `add-dialog` 追加モーダル | 追加ボタン → モーダルのフォーム（`DialogForm`・`useFormDialog`）                     |
| `edit-dialog` 編集モーダル | カードの「編集」→ 今の値が入ったモーダル（追加と同じフォームを使い回す）           |
| `delete-confirm` 削除の確認 | 削除ボタン → 確認ダイアログ（1 件・まとめて・詳細ページから戻る）                 |
| `selectable-table` 選択できる表 | チェックボックス・全選択・一括操作・行の編集／削除ボタン・並び替え・ページ送り |
| `search-filter` 検索・絞り込み | キーワード・権限で絞り込み、表／カードの切り替え（URL に持つ）                  |

| 分類           | 部品                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| レイアウト     | Box・Container・Stack・Grid・Paper                                                                                      |
| ナビゲーション | AppBar・Drawer・Tabs・Breadcrumbs・Link（React Router）・Menu・Pagination                                               |
| 入力           | Button・IconButton・TextField・Select・Autocomplete・Checkbox・RadioGroup・Switch・ToggleButtonGroup・Slider・Rating    |
| 表示           | Typography・Card・List・Table（並び替え・ページ送り）・Chip・Avatar・Badge・Tooltip・Accordion                          |
| フィードバック | Alert・Snackbar・Progress・Skeleton                                                                                     |
| ダイアログ     | Dialog（フォームを載せる形も）                                                                                          |
| 自作部品       | AppShell・PageHeader・FormTextField・ConfirmDialog・DialogForm・DataTable・Notifier・EmptyState・DescriptionList・StatCard・QuantityStepper |

TextField・Checkbox・RadioGroup・Dialog などには React Hook Form ＋ zod でつなぐ見本もある。

## しくみ

| ファイル                                                                                     | 役割                                                                                                            |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [pages/component-docs/model/muiDocs.ts](src/pages/component-docs/model/muiDocs.ts)           | 部品ごとの説明・押さえどころ・見本の一覧・props・公式ドキュメントの URL。サイドメニューもここから作る           |
| [pages/component-docs/demos/](src/pages/component-docs/demos/)                               | 見本。1 ファイル = 1 つの見本                                                                                   |
| [pages/component-docs/model/sources.ts](src/pages/component-docs/model/sources.ts)           | `import.meta.glob` で、見本を「部品」と「文字列（`?raw`）」の両方で読み込む。表示しているコードと動いている見本が必ず一致する |
| [pages/component-docs/model/patterns.ts](src/pages/component-docs/model/patterns.ts)         | 画面パターンの説明・見本・サンプルアプリのファイル（`files`）・使っている部品                                   |
| [pages/component-docs/model/usages.ts](src/pages/component-docs/model/usages.ts)             | 部品ごとの「サンプルアプリでの使用例」（サンプルアプリのファイルのパスと説明）                                  |
| `model/sources.ts` の `loadAppSource`                                                         | サンプルアプリ（`@samples/<アプリ>/src`）のファイルを、表示するときに 1 つずつ文字列で読み込む。カタログだけを取り出したときは GitHub へのリンクになる |
| `src/shared/ui/`                                                                              | 自作部品。元は [\_shared/mui-ui](../_shared/mui-ui/)（`npm run sync-ui` で各 MUI アプリへコピー）              |

## 部品のページを足すとき

1. `src/pages/component-docs/demos/<slug>/Basic.tsx` に見本を作る（`export default function` で書く）
2. `muiDocs.ts` に 1 件足す（`slug`・`name`・`category`・`description`・`points`・`demos`・`props`・`docsUrl`）
3. 自作部品なら `_shared/mui-ui/<部品名>/` に作り、`npm run sync-ui` で各アプリへコピーしてから、`sharedUi: true` で足す

react-sample-app の `/mui` にも同じ内容の部品ドキュメントがある（見本は同じもの）。
