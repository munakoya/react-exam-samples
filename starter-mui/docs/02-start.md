# 2. 雛形で環境を作る（10 分）

> [目次](README.md) ｜ 前：[1. 始める前に決める](01-plan.md) ｜ 次：[3. 機能を作る](03-build.md)

雛形（[starter-mui](../README.md)）には、[解説書 1. プロジェクトの作成](../../library/docs/01-setup.md) の 1-2〜1-10 が入っている。
**コピーして、名前を 4 か所変えるだけ**。雛形を持ち込めない試験なら、1 章を見ながら手で作る。

## やること

- [ ] 1. 雛形をコピーして起動する

  ```bash
  npx degit munakoya/react-exam-samples/starter-mui my-app
  cd my-app
  npm install
  npm run dev
  ```

- [ ] 2. 4 か所を変える

  | ファイル                         | 変えるところ                                          |
  | -------------------------------- | ----------------------------------------------------- |
  | `package.json`                   | `"name"` をアプリ名に（英小文字と `-`）                |
  | `index.html`                     | `<title>` をアプリ名に                                 |
  | `src/shared/config/storage.ts`   | `STORAGE_PREFIX` をアプリ名に（localStorage のキーの頭） |
  | `src/app/layouts/RootLayout.tsx` | ヘッダーの `title`（メニューはページを作ってから足す）  |

- [ ] 3. テーマの色を変えるなら `src/app/styles/theme.ts` の `palette.primary.main` だけ（見た目の調整は最後に回す）
- [ ] 4. README に [1 章](01-plan.md) の要件と設計メモを貼る
- [ ] 5. Git を始めて、最初のコミットをする

  ```bash
  git init
  git add -A
  git commit -m "環境構築（MUI・テーマ・ルーティング・共通の枠）"
  ```

- [ ] 6. 提出が GitHub なら、リポジトリを作って push する（途中で PC が止まっても残る）

  ```bash
  git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
  git branch -M main
  git push -u origin main
  ```

## 雛形に入っているもの（覚えておく）

| 使いたいもの                              | 読み込み方                                                     |
| ----------------------------------------- | -------------------------------------------------------------- |
| 表（選択・並び替え・ページ送り・行の操作） | `import { DataTable, type DataTableColumn } from "@/shared/ui"` |
| 追加・編集のダイアログ                    | `import { DialogForm, useFormDialog } from "@/shared/ui"`       |
| フォームの入力欄（RHF とつなぐ）           | `import { FormTextField } from "@/shared/ui"`                   |
| 削除の確認                                | `import { ConfirmDialog } from "@/shared/ui"`                   |
| 通知（「追加しました」）                  | `import { notify } from "@/shared/ui"` → `notify("…")`          |
| 0 件・見つからない                        | `import { EmptyState } from "@/shared/ui"`                      |
| ページの見出し・パンくず・右のボタン       | `import { PageHeader } from "@/shared/ui"`                      |
| 詳細の項目一覧・集計のカード              | `DescriptionList`・`StatCard`                                   |
| localStorage のキー・保存データのチェック | `storageKey`（`@/shared/config`）・`mergeWithSchema`（`@/shared/lib`） |
| 日付（今日・日数の差・表示）               | `todayString`・`diffDays`・`formatDate`（`@/shared/lib`）        |

それぞれの使い方は [MUI 部品カタログの自作部品](https://munakoya.github.io/react-exam-samples/mui-catalog/data-table)。

## 終わりの確認

- [ ] `npm run dev` で「雛形が動いています」が出る。スマホ幅で ☰ が出て開閉できる
- [ ] ブラウザのタブにアプリ名が出る
- [ ] `git log` に「環境構築」のコミットがある
