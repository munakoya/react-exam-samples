# タスク管理（サンプル・MUI 版）

> [サンプル集の目次](../README.md)・MUI 版の共通の作りは目次の README を参照。
>
> **お題・要件は [CSS 版のタスク管理](../task-manager/README.md) と同じ**。見た目を MUI にしたもの。CSS 版と見比べると、MUI での書き方の違いが分かる。
> 設計・ライブラリの解説は [タスク管理の解説書](../task-manager/docs/README.md)（考え方は同じ）と、[蔵書管理の解説書（MUI 版）](../library/docs/README.md)。

## お題

チームのタスクを管理するアプリを作ってください。
タスクには優先度・ステータス・期限があり、期限を過ぎた未完了のタスクがひと目で分かるようにしてください。
一覧に加えて、ステータスごとに列で並べた「ボード」でも確認できるようにしてください。
UI には Material UI（MUI）を使い、データはブラウザを閉じても残るようにしてください。

### 要件

**必須**

- [ ] タスクを追加・編集・削除できる（追加・編集は一覧の上に重なるダイアログで行う）
- [ ] 項目：タイトル（必須・50文字以内）、詳細（任意・500文字以内）、優先度（高・中・低）、ステータス（未着手・進行中・完了）、期限（任意）
- [ ] 一覧のカードから、ステータスをその場で変えられる
- [ ] ステータスで絞り込める
- [ ] 期限切れ（完了していない かつ 期限が今日より前）を目立たせる
- [ ] データを localStorage に保存する

**発展**

- [ ] 並び替え（期限が近い順・優先度が高い順・作成が新しい順）。期限なしは最後
- [ ] 絞り込み・並び替えの設定も保存し、再読み込みしても前回の表示で開く
- [ ] ステータスごとの件数・期限切れの件数・完了率を表示する
- [ ] かんばんボード：ステータスごとの3列。ボタンで隣の列へ動かせる
- [ ] 完了したタスクをまとめて削除する

## 画面と URL

| URL      | 画面                                                     |
| -------- | -------------------------------------------------------- |
| `/tasks` | 一覧（集計・完了率・絞り込み・並び替え）。追加・編集はダイアログ |
| `/board` | かんばんボード                                           |

## 実装の順番（コミットの単位）

1. 環境構築（MUI・テーマ）、ルーティング（`/tasks`・`/board`・404）と共通の枠（AppShell）
2. `entities/task`：選択肢・zod スキーマ・store（persist）
3. タスクのカード（`TaskCard`：MUI の Card ＋ Chip）と一覧の表示
4. 追加・編集のダイアログ（`features/task-form`）
5. 削除（確認ダイアログ）・完了の一括削除、通知（Notifier）
6. ステータスの変更（カードのセレクト）
7. 期限切れの判定と表示、集計（StatCard）・完了率（LinearProgress）
8. 絞り込み・並び替え（ToggleButtonGroup・セレクト、表示設定の store）
9. かんばんボード（Grid の 3 列、移動ボタン）

## 解答の構成

```text
src/
├── app/                          App.tsx・RootLayout（AppShell）・AppProviders（テーマ・Router・通知）・theme.ts
├── pages/
│   ├── task-list/                一覧（集計・完了率・絞り込み・ダイアログ）
│   ├── task-board/               ボード
│   └── not-found/
├── widgets/
│   ├── task-list/                カードの一覧（ステータス変更・編集・削除つき）
│   └── task-board/               3列のボード（移動ボタンつき）
├── features/
│   ├── task-form/                追加・編集のダイアログ、開閉のフック
│   ├── task-filter/              絞り込み・並び替えの store と操作部分、並び替えの関数
│   ├── change-task-status/       ステータスのセレクト、ボードの移動ボタン
│   └── delete-task/              削除ボタン（アイコン）、完了の一括削除ボタン
├── entities/
│   └── task/                     型・store・期限切れの判定・カード・ラベル（Chip）
└── shared/                       ui（MUI の自作部品）・lib（日付・persist）・config
```

## CSS 版との違い

`entities/task/model`・`features/task-filter/model`（型・store・並び替えの関数）は **CSS 版と同じファイル**。違うのは見た目とフォームのつなぎ方だけ。

| やること                         | CSS 版（task-manager）                                  | MUI 版（このアプリ）                                                   |
| -------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| 追加・編集の入れ物               | `Modal`（`<dialog>`）                                    | `Dialog`                                                               |
| 開くたびに入力を空にする         | `useEffect` で `reset(toFormInput(task))`               | **要らない**。Dialog は閉じると中身を消すので、開くたびにフォームが作り直される |
| 送信ボタン                       | フォームの外（footer）にあり、`form={formId}` で結びつける | `<form>` で DialogTitle・DialogContent・DialogActions を包む             |
| 入力欄とフォーム                 | `{...register("title")}`                                | `<FormTextField control={control} name="title" />`（Controller）         |
| ラジオボタン（優先度）           | `{...register("priority")}`                             | `Controller` で `<RadioGroup {...field}>`                              |
| ステータス・優先度のラベル       | `Badge` ＋ `tone`                                        | `Chip` ＋ `color`                                                      |
| 期限切れ・完了の見た目           | CSS の `data-overdue`・`data-done`                       | `sx` で `borderLeft`・`opacity` を出し分ける                           |
| 集計・完了率                     | `Stat`・`ProgressBar`                                    | `StatCard`・`LinearProgress variant="determinate"`                     |
| 絞り込み                         | `SegmentedControl`                                       | `ToggleButtonGroup exclusive`（`null` が届くので無視する）              |
| ボードの 3 列                    | CSS Grid（`repeat(3, minmax(0, 1fr))`）                  | `Grid container` ＋ `size={{ xs: 12, md: 4 }}`                         |
| 通知                             | `useToast().show()`（Context）                           | `notify()`（Zustand の store。Provider 不要）                           |

## 学習ポイント

| ポイント                                                 | 見るところ                                                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| ダイアログの中のフォーム（reset が要らない形）           | [features/task-form/ui/TaskFormDialog.tsx](src/features/task-form/ui/TaskFormDialog.tsx)           |
| 開閉の state をカスタムフックにまとめる                  | [features/task-form/model/useTaskFormDialog.ts](src/features/task-form/model/useTaskFormDialog.ts) |
| 操作を外から差し込むカード（`actions`）、状態で見た目を変える `sx` | [entities/task/ui/TaskCard.tsx](src/entities/task/ui/TaskCard.tsx)                       |
| `as const satisfies Record<…, ChipProps["color"]>`       | [entities/task/ui/TaskChips.tsx](src/entities/task/ui/TaskChips.tsx)                               |
| フォームを使わない「その場で変える」セレクト             | [features/change-task-status/ui/TaskStatusSelect.tsx](src/features/change-task-status/ui/TaskStatusSelect.tsx) |
| データの store と表示設定の store を分ける               | [features/task-filter/model/taskFilterStore.ts](src/features/task-filter/model/taskFilterStore.ts) |
| ToggleButtonGroup の `null` を無視する                   | [features/task-filter/ui/TaskFilterBar.tsx](src/features/task-filter/ui/TaskFilterBar.tsx)         |
| 数値を返すセレクター（`filter(...).length`）             | [features/delete-task/ui/DeleteDoneTasksButton.tsx](src/features/delete-task/ui/DeleteDoneTasksButton.tsx) |
| 集計（`Object.fromEntries`）・完了率のバー               | [pages/task-list/ui/TaskListPage.tsx](src/pages/task-list/ui/TaskListPage.tsx)                     |
| Grid で 3 列のボード                                     | [widgets/task-board/ui/TaskBoard.tsx](src/widgets/task-board/ui/TaskBoard.tsx)                     |

## 動かし方

```bash
cd frontend/exam/samples
npm install
npm run dev -w task-manager-mui
```
