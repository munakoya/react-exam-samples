# 解説書・ガイド（読みもの）

> [サンプル集の目次](../README.md)

サンプル集の Markdown の読みものを、まとめて読める・検索できるアプリ。試験中にブラウザで確認するためのもの。

公開ページ：https://munakoya.github.io/react-exam-samples/guide/

```bash
npm run dev -w guide
```

## 載せているもの

| URL                | 読みもの                                                                                     | 元のファイル                                 |
| ------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `/library/…`       | 解説書（MUI 版・蔵書管理）：環境構築・設計・モダン JS・ライブラリ・実装手順・考え方とつまずき | [library/docs/](../library/docs/README.md)   |
| `/mui-guide/…`     | MUI 画面構築ガイド：テーマと sx・レイアウト・フォーム・一覧・ダイアログ・画面パターン集     | [mui-catalog/docs/](../mui-catalog/docs/README.md) |
| `/task-manager/…`  | 解説書（CSS 版・タスク管理）                                                                 | [task-manager/docs/](../task-manager/docs/README.md) |
| `/samples/…`       | サンプル集の目次と、各サンプルの README（お題・要件・学習ポイント）                          | 各フォルダの README.md                       |
| `/search?q=…`      | 全部の読みものから検索（見出しごと。スペースで区切ると AND）                                 | —                                            |

**中身はコピーしていない**。ビルドのときに元の Markdown を読み込むので、解説書を直せばこのアプリにもそのまま反映される。

## しくみ

| ファイル                                                                     | 役割                                                                                                        |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [entities/doc/model/docs.ts](src/entities/doc/model/docs.ts)                 | `import.meta.glob(…, { query: "?raw" })` で Markdown を文字列として読み込み、本（まとまり）と章に分ける     |
| [entities/doc/model/resolveLink.ts](src/entities/doc/model/resolveLink.ts)   | Markdown の相対リンクの行き先を決める（ほかの読みもの → アプリの中、ソースコード → GitHub のファイル）      |
| [entities/doc/model/sections.ts](src/entities/doc/model/sections.ts)         | 見出しごとに分ける（右の目次・検索に使う）。見出しの id は GitHub と同じ作り方（github-slugger）            |
| [entities/doc/ui/MarkdownView.tsx](src/entities/doc/ui/MarkdownView.tsx)     | react-markdown で表示し、見出し・表・コードを MUI の部品に置き換える（remark-gfm・rehype-slug・rehype-highlight） |
| [features/doc-search](src/features/doc-search/)                              | 全文検索                                                                                                    |

`vite.config.ts` の `@samples` は samples フォルダの別名。このアプリは samples の中のほかのフォルダの Markdown を読むので、単独では取り出せない。

## 読みものを足すとき

- 解説書の章を足す：`<アプリ>/docs/` に `.md` を置くだけで、メニューと検索に出る（ファイル名の順に並ぶ）
- 新しい本（まとまり）を足す：[docs.ts](src/entities/doc/model/docs.ts) の `bookDefs` に 1 件足す
