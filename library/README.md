# 蔵書管理（サンプル・MUI 版）

> [サンプル集の目次](../README.md)・MUI 版の共通の作りは目次の README を参照。
>
> **解説書**：[docs/](docs/README.md) … プロジェクトの作成・設計の考え方・モダン JS・ライブラリ（MUI を含む）・実装手順・つまずきまで、このアプリを例に説明している。
> MUI の部品ごとの使い方は [MUI 部品カタログ](../mui-catalog/)、画面の組み立て方は [MUI 画面構築ガイド](../mui-catalog/docs/README.md)。

## お題

社内の小さな図書コーナーの本を管理するアプリを作ってください。
本を登録し、誰に貸し出しているか・返却期限を過ぎていないかがひと目で分かるようにしてください。
UI には Material UI（MUI）を使ってください。データはブラウザを閉じても残るようにしてください。

### 要件

**必須**

- [ ] 本の一覧を表で表示する（タイトル・著者・ジャンル・評価・状態）
- [ ] 本を登録・編集・削除できる（削除の前に確認する）
- [ ] 入力チェック：タイトルは必須・50文字以内、著者は必須・30文字以内、ジャンルは必須、ISBN は任意（入力するなら13桁の数字。ハイフン可）、出版年は任意（1900年〜今年）
- [ ] 本を貸し出す（借りる人の名前・返却期限）・返却する。貸出中の本は貸し出せない
- [ ] 返却期限は今日以降・今日から30日以内
- [ ] 状態（貸出可・貸出中・期限切れ）を表示する。期限切れは目立たせる
- [ ] データを localStorage に保存する

**発展**

- [ ] 評価（星 0〜5）とタグ（5個まで・自由入力）を付けられる
- [ ] キーワード（タイトル・著者・タグ）検索、ジャンル・状態での絞り込み、並び替え（タイトル・評価・登録日時）、ページ送り。条件を URL に残す
- [ ] 本の詳細ページ（URL に本の id）。貸出の履歴を表示する
- [ ] ダッシュボード：蔵書数・貸出中・期限切れ・今月の貸出の件数、期限切れの一覧、返却期限が近い（3日以内）一覧
- [ ] 貸出一覧ページ：タブで「貸出中・期限切れ・返却済み・すべて」を切り替える
- [ ] 貸出中の本は削除できない。本を削除したら、その本の貸出の記録も消す
- [ ] 操作の結果を画面の下の通知（スナックバー）で知らせる

## 画面と URL

| URL                   | 画面                                                                          |
| --------------------- | ----------------------------------------------------------------------------- |
| `/`                   | ダッシュボード（集計・期限切れ・期限が近い・最近登録した本）                  |
| `/books`              | 本の一覧（`?q=漱石&genre=novel&status=overdue&sort=title&page=2` で絞り込み） |
| `/books/new`          | 本を登録                                                                      |
| `/books/:bookId`      | 本の詳細（貸出の履歴つき）                                                    |
| `/books/:bookId/edit` | 本を編集                                                                      |
| `/loans`              | 貸出一覧（`?tab=overdue` でタブ）                                             |
| （ダイアログ）        | 貸出：一覧・詳細の「貸し出す」から開く                                        |

ダッシュボードの「サンプルデータを入れる」は動作確認用（要件ではない）。期限切れ・期限間近・返却済みがそろったデータが入る。

## 実装の順番（コミットの単位）

1. 環境構築（Vite・MUI・テーマ）、ルーティングと共通レイアウト（AppShell）
2. `entities/book`：zod スキーマ・型・ジャンルの選択肢・store（persist）
3. 本の一覧（表・0件の表示）
4. 登録フォーム（`features/book-form`）と登録ページ
5. 詳細ページ・編集ページ（同じフォームを使い回す）
6. 削除（確認ダイアログ）と通知（Notifier）
7. `entities/loan` と貸出（`features/lend-book`）・返却（`features/return-book`）、状態の表示
8. 絞り込み・並び替え・ページ送り（URL に残す。`features/book-filter`）
9. 貸出一覧ページ（タブ）、ダッシュボード
10. 評価・タグ、削除の制限と貸出の記録の削除

## 解答の構成

```text
src/
├── app/                        App.tsx（ルーティング）・RootLayout・AppProviders（テーマ・Router・通知）・theme.ts
├── pages/
│   ├── dashboard/              ダッシュボード（集計はすべて計算）
│   ├── book-list/              本の一覧（URL の条件 → 絞り込み → 並び替え → ページの切り出し）
│   ├── book-detail/            本の詳細（今の貸出・貸出の履歴）
│   ├── book-new/・book-edit/   登録・編集（同じフォーム）
│   ├── loan-list/              貸出一覧（タブ）
│   └── not-found/
├── widgets/
│   ├── book-table/             本の表（並び替えの見出し・ページ送り・行の操作）
│   └── loan-table/             貸出の表（本のタイトル・返却ボタン）
├── features/
│   ├── book-form/              登録・編集フォーム（RHF ＋ zod ＋ MUI。Rating・Autocomplete は Controller）
│   ├── book-filter/            絞り込み・並び替え・ページの条件（URL ⇄ 条件）と操作部分
│   ├── lend-book/              貸出のダイアログ（スキーマの工場・setValue）
│   ├── return-book/            返却ボタン（確認つき）
│   ├── delete-book/            削除ボタン（本 ＋ 貸出の記録を消す。貸出中は押せない）
│   └── load-sample-data/       サンプルデータ（動作確認用）
├── entities/
│   ├── book/                   本の型・store・ジャンル・表紙の代わりのアイコン
│   └── loan/                   貸出の型・store・状態の判定（貸出中・期限切れ）・状態のラベル・履歴の表
└── shared/
    ├── ui/                     MUI で作った自作部品（元は _shared/mui-ui）
    ├── lib/                    日付（今日・n日後・日数の差）・日時の整形・persist の読み込みチェック
    └── config/                 localStorage のキー
```

## 学習ポイント

| ポイント                                                       | 見るところ                                                                                                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| テーマ（色・角丸・部品の初期値・日本語化 `jaJP`）              | [app/styles/theme.ts](src/app/styles/theme.ts)                                                                                                                                 |
| ThemeProvider・CssBaseline・Notifier を Provider にまとめる    | [app/providers/AppProviders.tsx](src/app/providers/AppProviders.tsx)                                                                                                           |
| AppBar ＋ Drawer のレスポンシブな枠（`useMediaQuery`）         | [shared/ui/AppShell](src/shared/ui/AppShell/AppShell.tsx)                                                                                                                      |
| MUI の TextField と RHF をつなぐ（`useController`）            | [shared/ui/FormTextField](src/shared/ui/FormTextField/FormTextField.tsx)                                                                                                       |
| Rating・Autocomplete を `Controller` でつなぐ                  | [features/book-form/ui/BookForm.tsx](src/features/book-form/ui/BookForm.tsx)                                                                                                   |
| 入力は文字列・保存は数値か null（`transform`）、`abort`        | [features/book-form/model/schema.ts](src/features/book-form/model/schema.ts)                                                                                                   |
| 今日の日付で変わるチェック（スキーマの工場）・`setValue`       | [features/lend-book](src/features/lend-book/)                                                                                                                                  |
| ダイアログの中のフォーム（閉じると作り直される）               | [LendBookButton](src/features/lend-book/ui/LendBookButton.tsx)・[LendBookForm](src/features/lend-book/ui/LendBookForm.tsx)                                                     |
| どこからでも出せる通知（Zustand の store ＋ `getState()`）     | [shared/ui/Notifier](src/shared/ui/Notifier/notifierStore.ts)                                                                                                                  |
| 保存しない状態（貸出中・期限切れ）を計算で求める               | [entities/loan/model/loan.ts](src/entities/loan/model/loan.ts)                                                                                                                 |
| `Map` で「本の id → 今の貸出」を作る                           | `getCurrentLoanMap`（同上）                                                                                                                                                    |
| 絞り込み・並び替え・ページを URL に持つ（URL が「正」）        | [features/book-filter/model](src/features/book-filter/model/)                                                                                                                  |
| TableSortLabel・TablePagination（page は 0 から）              | [widgets/book-table/ui/BookTable.tsx](src/widgets/book-table/ui/BookTable.tsx)                                                                                                 |
| 2つの store を features でまとめて動かす                       | [features/delete-book/ui/DeleteBookButton.tsx](src/features/delete-book/ui/DeleteBookButton.tsx)                                                                               |
| 押せない理由を Tooltip で出す（`<span>` で包む）               | 同上                                                                                                                                                                           |
| `as const satisfies Record<…>` で状態ごとの色                  | [entities/loan/ui/AvailabilityChip.tsx](src/entities/loan/ui/AvailabilityChip.tsx)                                                                                             |
| Tabs の選択を URL（`?tab=`）に持つ                             | [pages/loan-list/ui/LoanListPage.tsx](src/pages/loan-list/ui/LoanListPage.tsx)                                                                                                 |
| ダッシュボード（StatCard を Grid で並べる、集計はすべて計算）  | [pages/dashboard/ui/DashboardPage.tsx](src/pages/dashboard/ui/DashboardPage.tsx)                                                                                               |
| `useParams` と「見つからない」表示、削除後に `replace` で移動  | [pages/book-detail/ui/BookDetailPage.tsx](src/pages/book-detail/ui/BookDetailPage.tsx)                                                                                         |
| 日付の計算（n日後・日数の差）を文字列 `"YYYY-MM-DD"` のまま    | [shared/lib/date.ts](src/shared/lib/date.ts)                                                                                                                                   |

## 動かし方

```bash
cd frontend/exam/samples
npm install
npm run dev -w library
```
