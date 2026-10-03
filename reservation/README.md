# 会議室予約（サンプル）

> [サンプル集の目次](../README.md)・共通の作りは目次の README を参照。

## お題

社内の会議室の予約システムを作ってください。
会議室は3つ（会議室A 4名・会議室B 8名・大会議室 20名）で、9:00〜21:00 の間を30分単位で予約できます。
同じ会議室で時間が重なる予約や、定員を超える予約はできないようにしてください。
1日分の予約状況を、会議室ごとの時間割で確認できるようにしてください。データはブラウザを閉じても残るようにしてください。

### 要件

**必須**

- [ ] 予約の登録・変更・取り消し（取り消しの前に確認する）
- [ ] 項目：会議室・日付・開始・終了・会議名（必須・50文字以内）・予約者名（必須）・人数・メモ（任意）
- [ ] 入力チェック：終了は開始より後、人数は会議室の定員以内、過去の日付は不可
- [ ] 同じ会議室・同じ日で時間が重なる予約はできない（変更のときは自分自身とは比べない）
- [ ] 予約一覧（日時の早い順）
- [ ] データを localStorage に保存する

**発展**

- [ ] 1日分のスケジュール表（列が会議室、行が30分ごと）。予約を時間の長さに合わせたブロックで表示する
- [ ] 前の日・今日・次の日の切り替え、日付の指定。表示中の日付を URL に残す
- [ ] スケジュール表の空き枠をクリックすると、その会議室・日付・時刻が入った状態で予約フォームを開く
- [ ] 予約一覧の会議室での絞り込み、過去の予約の表示切り替え（URL に残す）
- [ ] 過去の予約は変更・取り消しできない

## 画面と URL

| URL                                      | 画面                                               |
| ---------------------------------------- | -------------------------------------------------- |
| `/schedule?date=2026-10-03`              | 1日のスケジュール表（`?date` なしなら今日）        |
| `/reservations?room=a&past=1`            | 予約一覧                                           |
| `/reservations/new?date=&roomId=&start=` | 新規予約（スケジュール表の枠から初期値を受け取る） |
| `/reservations/:reservationId`           | 予約の詳細                                         |
| `/reservations/:reservationId/edit`      | 予約の変更                                         |

## 実装の順番（コミットの単位）

1. 環境構築、ルーティング
2. `entities/room`（会議室の固定データ）、`entities/reservation`（型・store・重なりの判定）
3. 日付・時刻の関数（`shared/lib/date.ts`・`time.ts`）
4. 予約フォーム：項目ごとのチェック
5. 予約フォーム：終了 > 開始・定員・重なりのチェック（`superRefine`）
6. 新規予約ページ・予約一覧
7. 詳細・変更・取り消し
8. スケジュール表（CSS Grid）、日付の切り替え（URL）
9. 空き枠から予約（URL で初期値を渡す）、一覧の絞り込み

## 解答の構成

```text
src/
├── app/                          App.tsx・RootLayout・AppProviders・styles
├── pages/
│   ├── schedule/                 1日のスケジュール（日付は URL）
│   ├── reservation-list/         予約一覧（絞り込みは URL）
│   ├── reservation-new/          新規予約（URL から初期値）
│   ├── reservation-detail/       詳細・取り消し
│   ├── reservation-edit/         変更
│   └── not-found/
├── widgets/
│   ├── day-schedule/             スケジュール表（会議室 × 30分の Grid）
│   └── reservation-table/        予約一覧の表（予約 ＋ 会議室名）
├── features/
│   ├── reservation-form/         予約フォーム（予約の一覧を使ってチェックするスキーマ）
│   └── cancel-reservation/       取り消しボタン
├── entities/
│   ├── room/                     会議室の型・固定データ
│   └── reservation/              予約の型・store・重なりの判定・予約できる時間帯
└── shared/
    └── lib/                      date.ts（日付の計算・曜日）・time.ts（"HH:mm" ⇔ 分）
```

## 学習ポイント

| ポイント                                               | 見るところ                                                                                                                                                |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 時間の重なりの判定（`A開始 < B終了 && B開始 < A終了`） | `isOverlapping`（[entities/reservation/model/reservation.ts](src/entities/reservation/model/reservation.ts)）                                             |
| 複数の項目を見比べるチェック（`superRefine`）          | [features/reservation-form/model/schema.ts](src/features/reservation-form/model/schema.ts)                                                                |
| 保存済みのデータを使うチェック（スキーマの工場）       | 同上・[ReservationForm.tsx](src/features/reservation-form/ui/ReservationForm.tsx)                                                                         |
| 時刻は「0時からの分」に直して計算する                  | [shared/lib/time.ts](src/shared/lib/time.ts)                                                                                                              |
| 日付の足し算・曜日（`Intl.DateTimeFormat`）            | [shared/lib/date.ts](src/shared/lib/date.ts)                                                                                                              |
| 30分刻みの選択肢を作る                                 | `createTimeList`（[time.ts](src/shared/lib/time.ts)）・[ReservationForm.tsx](src/features/reservation-form/ui/ReservationForm.tsx)                        |
| CSS Grid の線の番号でブロックを置く                    | [widgets/day-schedule/ui/DaySchedule.tsx](src/widgets/day-schedule/ui/DaySchedule.tsx)・[.module.css](src/widgets/day-schedule/ui/DaySchedule.module.css) |
| 列・行の数を CSS 変数で渡す（`repeat(var(--n), …)`）   | 同上                                                                                                                                                      |
| 日付を URL に持つ（戻るで前の日へ）                    | [pages/schedule/ui/SchedulePage.tsx](src/pages/schedule/ui/SchedulePage.tsx)                                                                              |
| URL の値をフォームの初期値にする（値の形を確かめる）   | [pages/reservation-new/ui/ReservationNewPage.tsx](src/pages/reservation-new/ui/ReservationNewPage.tsx)                                                    |
| 2つの entities を widgets で組み合わせる               | [widgets/reservation-table/ui/ReservationTable.tsx](src/widgets/reservation-table/ui/ReservationTable.tsx)                                                |

## 動かし方

```bash
cd frontend/exam/samples
npm install
npm run dev -w reservation
```
