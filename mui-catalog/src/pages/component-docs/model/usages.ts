import type { AppFile } from "./appLinks";

/**
 * 部品ごとの「サンプルアプリでの使用例」 ── pages/component-docs/model
 *
 * キーは部品の slug（muiDocs）。部品のページの「サンプルアプリでの使用例」に、ここのファイルが並ぶ。
 * path は samples からのパス。サンプルアプリのファイル名を変えたら、ここも直す（ないファイルは GitHub へのリンクになる）。
 */

const um = (path: string) => `user-management/src/${path}`;
const tm = (path: string) => `task-manager-mui/src/${path}`;

export const docUsages: Partial<Record<string, AppFile[]>> = {
  // ---------- レイアウト ----------
  grid: [
    { path: um("widgets/user-card-grid/ui/UserCardGrid.tsx"), note: "カードを スマホ 1列・600px〜 2列・900px〜 3列 で並べる" },
    { path: tm("pages/task-list/ui/TaskListPage.tsx"), note: "集計の StatCard を スマホ 2列・600px〜 4列 で並べる" },
  ],

  // ---------- ナビゲーション ----------
  link: [{ path: um("widgets/user-table/ui/UserTable.tsx"), note: "表のセルの名前を RouterLink にして詳細ページへ" }],

  // ---------- 入力 ----------
  "icon-button": [
    { path: um("features/delete-user/ui/DeleteUserButton.tsx"), note: "ゴミ箱のアイコン ＋ Tooltip ＋ aria-label。押すと確認ダイアログ" },
    { path: um("widgets/user-table/ui/UserTable.tsx"), note: "表の行の右端に、編集・削除のアイコンを並べる" },
  ],
  "text-field": [
    { path: um("features/user-filter/ui/UserFilterBar.tsx"), note: "検索欄（type=\"search\"・虫めがねのアイコン）と、select で権限の絞り込み" },
    { path: um("features/user-form/ui/UserFormDialog.tsx"), note: "フォームの入力欄は FormTextField（Controller でつなぐ）" },
  ],
  select: [
    { path: um("features/user-form/ui/UserFormDialog.tsx"), note: "FormTextField に select を付けて、権限・部署を選ぶ" },
    { path: um("features/user-filter/ui/UserFilterBar.tsx"), note: "絞り込みのセレクト（「すべて」を先頭に）" },
  ],
  checkbox: [
    { path: um("widgets/user-table/ui/UserTable.tsx"), note: "DataTable に selectedIds を渡し、行をチェックボックスで選ぶ（チェックボックス本体は shared/ui/DataTable）" },
  ],
  switch: [
    { path: um("features/change-user-status/ui/UserActiveSwitch.tsx"), note: "表の中で有効／無効をその場で切り替える" },
    { path: um("features/user-form/ui/UserFormDialog.tsx"), note: "フォームの中の Switch を Controller でつなぐ（checked と event.target.checked）" },
  ],
  "toggle-button": [{ path: um("pages/user-list/ui/UserListPage.tsx"), note: "表／カードの表示の切り替え。値は URL（?view=card）に持つ" }],

  // ---------- 表示 ----------
  card: [
    { path: um("entities/user/ui/UserCard.tsx"), note: "ユーザー1人分のカード。操作のボタンは actions で外から受け取る" },
    { path: um("widgets/user-card-grid/ui/UserCardGrid.tsx"), note: "カードに 詳細・編集・削除 のボタンを差し込む" },
    { path: tm("entities/task/ui/TaskCard.tsx"), note: "（別のお題）タスクのカード。期限切れで左に赤い線" },
  ],
  table: [
    { path: um("widgets/user-table/ui/UserTable.tsx"), note: "shared/ui の DataTable（Table を組み合わせた部品）で作った表" },
    { path: "library/src/widgets/book-table/ui/BookTable.tsx", note: "（別のお題）Table を直接書いた表。並び替え・ページ送りは URL に持つ" },
    { path: "household-budget/src/widgets/transaction-table/ui/TransactionTable.tsx", note: "（別のお題）金額を右寄せ・色分けした表" },
  ],
  chip: [
    { path: um("entities/user/ui/UserChips.tsx"), note: "権限・状態のラベル。色の決め方を entities にまとめる" },
    { path: tm("entities/task/ui/TaskChips.tsx"), note: "（別のお題）ステータス・優先度のラベル" },
  ],
  avatar: [{ path: um("entities/user/ui/UserAvatar.tsx"), note: "名前の1文字目を出すアイコン。無効なユーザーは灰色" }],
  tooltip: [{ path: um("features/delete-user/ui/DeleteUserButton.tsx"), note: "アイコンだけのボタンに「削除」の吹き出し" }],

  // ---------- ダイアログ ----------
  dialog: [
    { path: um("features/user-form/ui/UserFormDialog.tsx"), note: "Dialog の中に useForm を持つフォームを置く（開くたびに初期値から）" },
    { path: tm("features/task-form/ui/TaskFormDialog.tsx"), note: "（別のお題）タスクの追加・編集ダイアログ" },
    { path: "household-budget/src/features/transaction-form/ui/TransactionFormDialog.tsx", note: "（別のお題）種類で選択肢が変わるフォームのダイアログ" },
  ],

  // ---------- 自作部品 ----------
  "app-shell": [{ path: um("app/layouts/RootLayout.tsx"), note: "メニューの項目を渡して全ページの枠にする" }],
  "page-header": [
    { path: um("pages/user-list/ui/UserListPage.tsx"), note: "タイトル ＋ 説明 ＋ 右に「追加」ボタン" },
    { path: um("pages/user-detail/ui/UserDetailPage.tsx"), note: "パンくず ＋ 右に「編集」「削除」ボタン" },
  ],
  "form-text-field": [{ path: um("features/user-form/ui/UserFormDialog.tsx"), note: "名前・メール・権限（select）・入社日（date）を FormTextField で" }],
  "confirm-dialog": [
    { path: um("features/delete-user/ui/DeleteUserButton.tsx"), note: "1件の削除。開閉はボタンの中の useState(false)" },
    { path: um("features/delete-user/ui/DeleteUsersButton.tsx"), note: "選択したものをまとめて削除" },
    { path: tm("features/delete-task/ui/DeleteTaskButton.tsx"), note: "（別のお題）タスクの削除" },
  ],
  notifier: [
    { path: um("features/user-form/ui/UserFormDialog.tsx"), note: "追加・更新のあとに notify(\"…を追加しました\")" },
    { path: um("features/change-user-status/ui/UserActiveSwitch.tsx"), note: "色を変えた通知：notify(\"…\", \"info\")" },
    { path: um("app/providers/AppProviders.tsx"), note: "<Notifier /> をアプリに1つだけ置く" },
  ],
  "empty-state": [
    { path: um("pages/user-list/ui/UserListPage.tsx"), note: "「1人もいない」と「条件に合う人がいない」で文言を変える" },
    { path: um("pages/user-detail/ui/UserDetailPage.tsx"), note: "id のユーザーがいないとき（削除済み・URL の打ち間違い）" },
  ],
  "description-list": [{ path: um("pages/user-detail/ui/UserDetailPage.tsx"), note: "詳細ページの項目一覧。値に Chip も渡せる" }],
  "stat-card": [{ path: tm("pages/task-list/ui/TaskListPage.tsx"), note: "ステータスごとの件数・期限切れの数" }],
  "data-table": [
    { path: um("widgets/user-table/ui/UserTable.tsx"), note: "列の定義・選択・一括操作・行の編集／削除・並び替え・ページ送り" },
    { path: um("features/delete-user/ui/DeleteUsersButton.tsx"), note: "selectionActions に置く一括削除のボタン" },
    { path: um("features/change-user-status/ui/ChangeUsersStatusButtons.tsx"), note: "selectionActions に置く一括の有効／無効" },
  ],
  "dialog-form": [
    { path: um("features/user-form/ui/UserFormDialog.tsx"), note: "Dialog の中身に DialogForm を使う（追加・編集で共通）" },
    { path: um("pages/user-list/ui/UserListPage.tsx"), note: "useFormDialog で「追加」か「どれの編集」かを切り替え、ダイアログは1つだけ置く" },
    { path: um("pages/user-detail/ui/UserDetailPage.tsx"), note: "詳細ページからも同じダイアログで編集" },
  ],
};
