# 家計簿（サンプル・MUI 版）

> [サンプル集の目次](../README.md)・MUI 版の共通の作りは目次の README を参照。
>
> 1 ページだけの、いちばん小さな形のサンプル。設計・ライブラリの解説は [蔵書管理の解説書（MUI 版）](../library/docs/README.md)。

## お題

毎日の収入と支出を記録する家計簿アプリを作ってください。
月ごとに、収入・支出・収支（収入 − 支出）の合計と、何にいくら使ったかが分かるようにしてください。
UI には Material UI（MUI）を使い、データはブラウザを閉じても残るようにしてください。

### 要件

**必須**

- [ ] 収支を記録・編集・削除できる（記録・編集はダイアログ。削除の前に確認する）
- [ ] 項目：日付（必須）、種類（支出・収入）、カテゴリ（必須。種類によって選択肢が変わる）、金額（必須・1〜9,999,999 円の整数）、メモ（任意・50文字以内）
- [ ] 表示している月の記録を、日付の新しい順に表で表示する
- [ ] 月の収入・支出・収支の合計を表示する
- [ ] 前の月・次の月に切り替えられる
- [ ] データを localStorage に保存する

**発展**

- [ ] カテゴリ別の支出の内訳（金額と割合のバー。多い順）
- [ ] 種類（すべて・支出・収入）で表を絞り込む
- [ ] 表示している月を URL に残す（`?month=2026-09`。再読み込み・共有しても同じ月）
- [ ] 月の予算（支出の上限）を設定し、使った割合を表示する。8 割を超えたら注意、超えたら赤
- [ ] 種類を変えたら、合わないカテゴリを選び直させる

## 画面と URL

| URL                | 画面                                                        |
| ------------------ | ----------------------------------------------------------- |
| `/`                | 家計簿（今月）                                              |
| `/?month=2026-09`  | 家計簿（その月）                                            |
| （ダイアログ）     | 記録・編集（「記録する」・表の編集ボタン）、予算の設定      |

最初の画面の「サンプルデータを入れる」は動作確認用（要件ではない）。今月と先月の記録・予算が入る。

## 実装の順番（コミットの単位）

1. 環境構築（MUI・テーマ）、ルーティングとヘッダー（AppBar）
2. `entities/transaction`：種類・カテゴリの選択肢、zod スキーマ、store（persist）
3. 記録の表（今月の分だけ）、0 件の表示
4. 記録・編集のダイアログ（`features/transaction-form`）、削除（確認つき）
5. 月の合計（`summarize`）と StatCard
6. 月の切り替え（`features/select-month`、URL に残す）
7. カテゴリ別の支出（`sumByCategory`）、種類の絞り込み
8. 予算（`entities/budget`・`features/set-budget`）と使った割合

## 解答の構成

```text
src/
├── app/                          App.tsx・RootLayout（AppBar だけ）・AppProviders・theme.ts
├── pages/
│   ├── budget-book/              家計簿（月の記録を計算 → まとめ・表へ渡す）
│   └── not-found/
├── widgets/
│   ├── monthly-summary/          収入・支出・収支、予算のバー、カテゴリ別の支出
│   └── transaction-table/        記録の表（編集・削除つき）
├── features/
│   ├── transaction-form/         記録・編集のダイアログ（種類でカテゴリの選択肢が変わる）
│   ├── delete-transaction/       削除ボタン（確認つき）
│   ├── select-month/             表示する月（URL の ?month）と ‹ › の切り替え
│   ├── set-budget/               予算の設定ダイアログ
│   └── load-sample-data/         サンプルデータ（動作確認用）
├── entities/
│   ├── transaction/              型・選択肢・store・集計の関数（summarize・sumByCategory）・金額の表示
│   └── budget/                   月の予算の store
└── shared/                       ui（MUI の自作部品）・lib（日付・月・金額の整形・persist）・config
```

## 学習ポイント

| ポイント                                                       | 見るところ                                                                                                     |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 種類によって変わる選択肢（`useWatch`）、種類を変えたら選び直し（`setValue`） | [features/transaction-form/ui/TransactionFormDialog.tsx](src/features/transaction-form/ui/TransactionFormDialog.tsx) |
| 項目同士を比べるチェック（`superRefine`）、文字列 → 数値（`transform` ＋ `pipe`） | [features/transaction-form/model/schema.ts](src/features/transaction-form/model/schema.ts)              |
| ToggleButtonGroup を Controller でつなぐ                       | 同上（TransactionFormDialog の「種類」）                                                                        |
| 合計・内訳を保存せず計算する（`reduce`・`Map`）                 | [entities/transaction/model/transaction.ts](src/entities/transaction/model/transaction.ts)                     |
| 種類ごとのカテゴリ（`Record<種類, 配列>`）・`as const` の配列をつなげる | 同上                                                                                                    |
| 月の計算（n か月後・"YYYY-MM"）、金額の整形（`Intl.NumberFormat`） | [shared/lib/date.ts](src/shared/lib/date.ts)・[shared/lib/format.ts](src/shared/lib/format.ts)            |
| 表示する月を URL に持つフック                                  | [features/select-month/model/useSelectedMonth.ts](src/features/select-month/model/useSelectedMonth.ts)         |
| 予算の割合（LinearProgress の色を割合で変える）                 | [widgets/monthly-summary/ui/MonthlySummary.tsx](src/widgets/monthly-summary/ui/MonthlySummary.tsx)             |
| 入力が 1 つだけの小さなダイアログのフォーム                    | [features/set-budget/ui/SetBudgetButton.tsx](src/features/set-budget/ui/SetBudgetButton.tsx)                   |
| ページが 1 つなら AppShell ではなく AppBar だけ                 | [app/layouts/RootLayout.tsx](src/app/layouts/RootLayout.tsx)                                                   |

## 動かし方

```bash
cd frontend/exam/samples
npm install
npm run dev -w household-budget
```
