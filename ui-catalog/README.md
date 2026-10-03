# UI 部品カタログ

> [サンプル集の目次](../README.md)

全サンプル共通の部品（`src/shared/ui/`、元は [\_shared/ui](../_shared/ui/)）のドキュメント。
部品ごとに「動く見本とそのコード」「props の表」「部品本体のソースコード」「使いそうなお題」を見られ、コードはボタンでコピーできる。

```bash
npm run dev -w ui-catalog
```

## ページ

| URL       | 内容                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `/`       | 部品を探す。部品名・やりたいこと（「評価」「画像」）・お題（「家計簿」）で検索 |
| `/:slug`  | 部品1つ分のページ（`/button`・`/image-field` など）                            |
| `/tokens` | デザイントークン（`tokens.css` の色・余白・角丸など）。名前を押すとコピー      |
| `/form`   | React Hook Form ＋ zod で全種類の入力部品をつないだ例                          |

## しくみ

| ファイル                                                                         | 役割                                                                                                                          |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [pages/ui-docs/model/componentDocs.ts](src/pages/ui-docs/model/componentDocs.ts) | 部品ごとの説明・見本の一覧・props・使いそうなお題・一緒にコピーする部品。サイドバーのメニューもここから作る                   |
| [pages/ui-docs/demos/](src/pages/ui-docs/demos/)                                 | 見本。1ファイル = 1つの見本                                                                                                   |
| [pages/ui-docs/model/sources.ts](src/pages/ui-docs/model/sources.ts)             | `import.meta.glob` で、見本を「部品」と「文字列（`?raw`）」の両方で読み込む。表示しているコードと動いている見本が必ず一致する |

## 部品のページを足すとき

1. `_shared/ui/` に部品を作り、`npm run sync-ui` で各アプリへコピーする
2. `src/pages/ui-docs/demos/<slug>/Basic.tsx` に見本を作る（`export default function` で書く）
3. `componentDocs.ts` に1件足す（`slug`・`name`・`category`・`description`・`topics`・`demos`・`props`）
