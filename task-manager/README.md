# タスク管理（サンプル）

> [サンプル集の目次](../README.md)・共通の作りは目次の README を参照。
>
> **解説書**：[docs/](docs/README.md) … プロジェクトの作成・設計の考え方・モダン JS・ライブラリ・実装手順・つまずきまで、このアプリを例に詳しく説明している。

## お題

チームのタスクを管理するアプリを作ってください。
タスクには優先度・ステータス・期限があり、期限を過ぎた未完了のタスクがひと目で分かるようにしてください。
一覧に加えて、ステータスごとに列で並べた「ボード」でも確認できるようにしてください。
データはブラウザを閉じても残るようにしてください。

### 要件

**必須**

- [ ] タスクを追加・編集・削除できる（追加・編集は一覧の上に重なるモーダルで行う）
- [ ] 項目：タイトル（必須・50文字以内）、詳細（任意・500文字以内）、優先度（高・中・低）、ステータス（未着手・進行中・完了）、期限（任意）
- [ ] 一覧のカードから、ステータスをその場で変えられる
- [ ] ステータスで絞り込める
- [ ] 期限切れ（完了していない かつ 期限が今日より前）を目立たせる
- [ ] データを localStorage に保存する

**発展**

- [ ] 並び替え（期限が近い順・優先度が高い順・作成が新しい順）。期限なしは最後
- [ ] 絞り込み・並び替えの設定も保存し、再読み込みしても前回の表示で開く
- [ ] ステータスごとの件数と、期限切れの件数を表示する
- [ ] かんばんボード：ステータスごとの3列。ボタンで隣の列へ動かせる
- [ ] 完了したタスクをまとめて削除する

## 画面と URL

| URL      | 画面                                                   |
| -------- | ------------------------------------------------------ |
| `/tasks` | 一覧（集計・絞り込み・並び替え）。追加・編集はモーダル |
| `/board` | かんばんボード                                         |

## 実装の順番（コミットの単位）

1. 環境構築、ルーティング（`/tasks`・`/board`・404）
2. `entities/task`：ステータス・優先度の選択肢、zod スキーマ、store（persist）
3. タスクのカード（`TaskCard`）と一覧の表示
4. 追加・編集のモーダル（`features/task-form`）
5. 削除（確認ダイアログ）・完了の一括削除
6. ステータスの変更（一覧のセレクト）
7. 期限切れの判定と表示、集計
8. 絞り込み・並び替え（表示設定の store）
9. かんばんボード（同じ store を別の見せ方で）

## 解答の構成

```text
src/
├── app/                          App.tsx・RootLayout・AppProviders・styles
├── pages/
│   ├── task-list/                一覧（集計・絞り込み・モーダル）
│   ├── task-board/               ボード
│   └── not-found/
├── widgets/
│   ├── task-list/                カードの一覧（ステータス変更・編集・削除つき）
│   └── task-board/               3列のボード（移動ボタンつき）
├── features/
│   ├── task-form/                追加・編集のモーダル、開閉のフック
│   ├── task-filter/              絞り込み・並び替えの store と操作部分、並び替えの関数
│   ├── change-task-status/       ステータスのセレクト、ボードの移動ボタン
│   └── delete-task/              削除ボタン、完了の一括削除ボタン
├── entities/
│   └── task/                     型・store・期限切れの判定・カード・バッジ
└── shared/
```

## 学習ポイント

| ポイント                                                   | 見るところ                                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| モーダルのフォームを開くたびに `reset` する                | [features/task-form/ui/TaskFormModal.tsx](src/features/task-form/ui/TaskFormModal.tsx)                                    |
| `<form>` の外の送信ボタン（`form` 属性）                   | 同上（モーダルの footer のボタン）                                                                                        |
| ラジオボタン・任意の日付の zod                             | [features/task-form/model/schema.ts](src/features/task-form/model/schema.ts)                                              |
| 開閉の state をカスタムフックにまとめる                    | [features/task-form/model/useTaskFormModal.ts](src/features/task-form/model/useTaskFormModal.ts)                          |
| データの store と表示設定の store を分ける                 | [features/task-filter/model/taskFilterStore.ts](src/features/task-filter/model/taskFilterStore.ts)                        |
| 並び替え（比較関数・`toSorted`）                           | [features/task-filter/model/filterTasks.ts](src/features/task-filter/model/filterTasks.ts)                                |
| `"YYYY-MM-DD"` を文字列のまま比べる・今日の日付            | [shared/lib/date.ts](src/shared/lib/date.ts)・`isOverdue`（[task.ts](src/entities/task/model/task.ts)）                   |
| 数値を返すセレクター（`filter(...).length`）               | [features/delete-task/ui/DeleteDoneTasksButton.tsx](src/features/delete-task/ui/DeleteDoneTasksButton.tsx)                |
| 操作を外から差し込むカード（`actions`）                    | [entities/task/ui/TaskCard.tsx](src/entities/task/ui/TaskCard.tsx)                                                        |
| `as const satisfies Record<...>`                           | [entities/task/ui/TaskBadges.tsx](src/entities/task/ui/TaskBadges.tsx)                                                    |
| 同じ store を2つの画面で使う                               | [pages/task-list](src/pages/task-list/ui/TaskListPage.tsx)・[pages/task-board](src/pages/task-board/ui/TaskBoardPage.tsx) |
| 3列のボード（`minmax(0, 1fr)`）                            | [TaskBoard.module.css](src/widgets/task-board/ui/TaskBoard.module.css)                                                    |
| 集計（`Stat` を `Grid` で並べる）・完了率（`ProgressBar`） | [pages/task-list/ui/TaskListPage.tsx](src/pages/task-list/ui/TaskListPage.tsx)                                            |

## 動かし方

```bash
cd frontend/exam/samples
npm install
npm run dev -w task-manager
```
