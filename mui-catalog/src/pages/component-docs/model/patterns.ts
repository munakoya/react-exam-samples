import type { AppFile } from "./appLinks";

/**
 * 画面パターン（試験でよく出る CRUD の UI）のページの中身 ── pages/component-docs/model
 *
 * 1 パターン = 1 ページ（/patterns/<slug>）。
 *   - demos   … このカタログの中で動く「1ファイル版」の見本（demos/ からのパス）
 *   - files   … 同じ UI を FSD で分けて作った、サンプルアプリ（ユーザー管理）の実際のファイル
 *   - appPath … 動くサンプルアプリで、そのパターンを試せる場所
 *   - related … 使っている部品のページ（muiDocs の slug）
 *
 * 見本は「1ファイルで全部書くとこうなる」、サンプルアプリは「層に分けるとこうなる」の対比になっている。
 */

export type PatternDoc = {
  slug: string;
  name: string;
  /** メニューに出す短い名前 */
  shortName: string;
  description: string;
  points: string[];
  demos: { title: string; file: string }[];
  files: AppFile[];
  app: string;
  appPath: string;
  related: string[];
};

const um = (path: string) => `user-management/src/${path}`;

// 何度も出てくるファイル
const listPage: AppFile = {
  path: um("pages/user-list/ui/UserListPage.tsx"),
  note: "追加ボタン・表／カードの切り替え・ダイアログを1つ置く（useFormDialog で追加か編集かを切り替える）",
};
const formDialog: AppFile = {
  path: um("features/user-form/ui/UserFormDialog.tsx"),
  note: "Dialog の中に useForm を持つフォームを置く。user があれば編集、なければ追加",
};
const formSchema: AppFile = {
  path: um("features/user-form/model/schema.ts"),
  note: "zod のスキーマ（メールの重複チェック付き）と、フォームの初期値 toFormInput(user)",
};
const userStore: AppFile = {
  path: um("entities/user/model/userStore.ts"),
  note: "addUser・updateUser・setActive・removeUsers（Zustand ＋ persist）",
};
const userTable: AppFile = {
  path: um("widgets/user-table/ui/UserTable.tsx"),
  note: "DataTable に列の定義・選択・一括操作・行の編集／削除ボタンを渡す。選択中の id は useState",
};
const deleteUserButton: AppFile = {
  path: um("features/delete-user/ui/DeleteUserButton.tsx"),
  note: "ゴミ箱ボタン ＋ ConfirmDialog。開閉はボタンの中の useState",
};
const deleteUsersButton: AppFile = {
  path: um("features/delete-user/ui/DeleteUsersButton.tsx"),
  note: "選択した id をまとめて削除するボタン ＋ ConfirmDialog",
};
const detailPage: AppFile = {
  path: um("pages/user-detail/ui/UserDetailPage.tsx"),
  note: "詳細ページでも同じダイアログ・削除ボタンを使い回す。削除したら一覧へ戻る",
};

export const patternDocs: PatternDoc[] = [
  {
    slug: "crud-overview",
    name: "CRUD 画面の全体像（FSD の置き場所）",
    shortName: "全体像（FSD）",
    description:
      "一覧（表・カード）・追加／編集のモーダル・削除の確認・絞り込みをそろえた CRUD 画面を、FSD の層に分けて作るとどこに何を置くか。",
    points: [
      "pages は「組み立て」と「ダイアログの開閉」だけ。処理は features・widgets に置く",
      "entities は見せ方（`UserCard`・`UserRoleChip`）と store だけを持ち、ボタンは持たない。操作は `actions` で外から差し込む",
      "features は操作 1つ分（`user-form`・`delete-user`・`change-user-status`・`user-filter`）。ボタンと確認ダイアログをセットで持つ",
      "widgets は entities の見せ方に features の操作を組み合わせる（`UserTable`・`UserCardGrid`）",
      "shared/ui は業務を知らない部品（`DataTable`・`DialogForm`・`ConfirmDialog`・`useFormDialog`）。どのお題でもそのまま使える",
      "import は下の層だけ：`pages → widgets → features → entities → shared`。同じ層の別フォルダは import しない",
      "下の見本は同じ画面を 1ファイルで書いたもの。まず 1ファイルで動かし、あとで層に分けてもよい",
    ],
    demos: [{ title: "1ファイル版：表 ＋ 追加・編集モーダル ＋ 削除の確認 ＋ 一括削除", file: "patterns/crud-overview/OneFile" }],
    files: [
      { path: um("app/App.tsx"), note: "/users（一覧）・/users/:id（詳細）のルーティング" },
      listPage,
      detailPage,
      userTable,
      { path: um("widgets/user-card-grid/ui/UserCardGrid.tsx"), note: "UserCard に詳細・編集・削除のボタンを差し込んで Grid に並べる" },
      formDialog,
      formSchema,
      deleteUserButton,
      deleteUsersButton,
      { path: um("features/change-user-status/ui/UserActiveSwitch.tsx"), note: "表の中でその場で切り替えるスイッチ" },
      { path: um("features/user-filter/model/useUserFilter.ts"), note: "検索・権限の条件を URL（?q=&role=）で持つ" },
      { path: um("entities/user/model/user.ts"), note: "ユーザーの型（zod）と、権限・部署の選択肢" },
      userStore,
      { path: um("entities/user/ui/UserCard.tsx"), note: "カード1枚の見せ方。ボタンは actions で受け取る" },
      { path: um("entities/user/index.ts"), note: "外から使うものだけを export する窓口（Public API）" },
    ],
    app: "user-management",
    appPath: "/users",
    related: ["data-table", "dialog-form", "confirm-dialog", "form-text-field", "notifier", "empty-state", "page-header"],
  },
  {
    slug: "add-dialog",
    name: "追加ボタン → モーダルのフォーム",
    shortName: "追加モーダル",
    description: "「＋ 追加」を押すとダイアログが開き、入力して「追加」で一覧に増える。エラーはその場で入力欄の下に出る。",
    points: [
      "開閉は `useFormDialog()`。`dialog.openNew` を追加ボタンの onClick に渡すだけ",
      "Dialog の中に「useForm を持つ部品」を置く。Dialog は閉じると中身を消すので、開くたびに初期値から始まる（`reset()` が要らない）",
      "フォームの枠（見出し・キャンセル・送信）は `DialogForm`。`onSubmit={handleSubmit(onSubmit)}` を渡す",
      "送信できたら store に追加 → `notify(\"…を追加しました\")` → ダイアログを閉じる、の順",
      "1件目がないときは、一覧の代わりに EmptyState にも同じ追加ボタンを置く",
      "最初の入力欄に `autoFocus` を付けると、開いてすぐ入力できる",
    ],
    demos: [{ title: "追加ボタン → モーダル", file: "patterns/add-dialog/Basic" }],
    files: [listPage, formDialog, formSchema, userStore],
    app: "user-management",
    appPath: "/users",
    related: ["dialog-form", "dialog", "form-text-field", "notifier", "button"],
  },
  {
    slug: "edit-dialog",
    name: "カードの「編集」→ 編集モーダル",
    shortName: "編集モーダル",
    description: "カード（や表の行）の「編集」を押すと、今の値が入ったダイアログが開く。追加と同じフォームを使い回す。",
    points: [
      "`dialog.openEdit(user)` で「どれを編集するか」を覚えて開く。`dialog.target` が undefined なら追加、値があれば編集",
      "フォームの初期値は `toFormInput(user)`。user があれば今の値、なければ空の値を返す関数にすると、追加と編集で同じフォームが使える",
      "カード（entities）は「編集」ボタンを持たない。widgets で `actions` に差し込み、押されたら `onEdit(user)` でページに伝える",
      "ダイアログはページに 1つだけ置く（カードの数だけ置かない）",
      "閉じるときは `open` だけを false にし、target は残す。閉じるアニメーションの途中で見出しが「追加」に変わって見えないように",
      "重複チェックは「自分以外」と比べる（編集で自分のメールのまま保存できるように）",
    ],
    demos: [{ title: "カードの編集ボタン → 編集モーダル", file: "patterns/edit-dialog/Basic" }],
    files: [
      { path: um("widgets/user-card-grid/ui/UserCardGrid.tsx"), note: "UserCard の actions に「編集」ボタンを差し込み、onEdit(user) を呼ぶ" },
      { path: um("entities/user/ui/UserCard.tsx"), note: "カード1枚の見せ方。ボタンは持たず actions で受け取る" },
      listPage,
      formDialog,
      formSchema,
      detailPage,
      { path: "task-manager-mui/src/features/task-form/ui/TaskFormDialog.tsx", note: "（別のお題）タスクの追加・編集ダイアログ。同じ形" },
    ],
    app: "user-management",
    appPath: "/users?view=card",
    related: ["dialog-form", "card", "dialog", "form-text-field", "grid"],
  },
  {
    slug: "delete-confirm",
    name: "削除ボタン → 確認ダイアログ",
    shortName: "削除の確認",
    description: "ゴミ箱を押すと「削除しますか？」の確認が出て、「削除」を押したときだけ消える。1件・選択したものをまとめて・詳細ページから、の 3 つの形。",
    points: [
      "ボタンと ConfirmDialog をセットにした部品（`DeleteUserButton`）を features に作る。開閉はボタンの中の `useState(false)`",
      "メッセージに「何を消すか」を入れる：`「佐藤 花子」を削除します。この操作は取り消せません。`",
      "アイコンだけのボタンは `aria-label={`「${user.name}」を削除`}` と Tooltip を付ける",
      "まとめて削除は、選択中の id の配列を受け取る（`DeleteUsersButton ids={selectedIds}`）。消したら選択を空にする",
      "詳細ページで消したら `onDeleted` で一覧へ戻る（`navigate(\"/users\", { replace: true })`）",
      "取り消せる操作（有効／無効の切り替えなど）には確認を出さない。確認は取り消せない操作だけ",
    ],
    demos: [{ title: "1件の削除・まとめて削除", file: "patterns/delete-confirm/Basic" }],
    files: [deleteUserButton, deleteUsersButton, userTable, detailPage, userStore],
    app: "user-management",
    appPath: "/users",
    related: ["confirm-dialog", "icon-button", "tooltip", "notifier"],
  },
  {
    slug: "selectable-table",
    name: "チェックボックスで選べる表（編集・削除ボタン付き）",
    shortName: "選択できる表",
    description:
      "先頭のチェックボックスで行を選び、上の帯から一括操作。行の右端には編集・削除ボタン。見出しで並び替え、下でページ送り。",
    points: [
      "shared/ui の `DataTable` に `columns`（列の定義）と `rows` を渡す。チェックボックス・操作列・ページ送りは props を渡したときだけ出る",
      "選択中の id は親が `useState<string[]>([])` で持ち、`selectedIds`・`onSelectedIdsChange` で渡す",
      "見出しのチェックボックスは、全部選ぶと ✔、一部だけなら `indeterminate`（−）になる",
      "1件以上選ぶと、上に「n件選択中」と `selectionActions`（一括削除など）が出る",
      "行の操作は `rowActions={(user) => …}`。編集は `onEdit(user)` でページに伝え、削除は確認ダイアログ付きのボタン",
      "並び替えたい列だけ `sortValue` を渡す。文字は日本語の辞書順、数値は大小で比べる",
      "絞り込みで見えなくなった行は「選択中」に数えない（隠れた行を一括削除しないように）",
      "セルの中にスイッチを置くと、フォームを開かずに 1項目だけ変えられる（有効／無効）",
    ],
    demos: [
      { title: "選択・一括削除・編集／削除ボタン・並び替え・ページ送り", file: "patterns/selectable-table/Basic" },
      { title: "DataTable を使わずに書く（Table ＋ Checkbox）", file: "patterns/selectable-table/Plain" },
    ],
    files: [
      userTable,
      { path: um("features/change-user-status/ui/ChangeUsersStatusButtons.tsx"), note: "選択した id をまとめて有効／無効にする（確認なし）" },
      { path: um("features/change-user-status/ui/UserActiveSwitch.tsx"), note: "行の中で有効／無効を切り替えるスイッチ" },
      deleteUsersButton,
      listPage,
      { path: "library/src/widgets/book-table/ui/BookTable.tsx", note: "（別のお題）DataTable を使わずに Table で書いた一覧" },
    ],
    app: "user-management",
    appPath: "/users",
    related: ["data-table", "table", "checkbox", "switch", "confirm-dialog"],
  },
  {
    slug: "search-filter",
    name: "検索・絞り込み ＋ 表／カードの切り替え",
    shortName: "検索・絞り込み",
    description: "キーワードと権限で一覧を絞り込み、表とカードを切り替える。条件は URL に入れて、再読み込みしても残す。",
    points: [
      "絞り込んだ結果は store に入れず、表示のたびに計算する（`filterUsers(users, keyword, role)`）",
      "条件は `useSearchParams` で URL（`?q=佐藤&role=admin&view=card`）に持つ。再読み込み・戻る・URL の共有で残る",
      "ほかの値を消さないように、`new URLSearchParams(prev)` でコピーしてから 1つだけ変える",
      "入力のたびに履歴が増えないよう `{ replace: true }` を付ける",
      "表／カードの切り替えは `ToggleButtonGroup exclusive`。選択中をもう一度押すと null が来るので無視する",
      "「1件もない」と「条件に合うものがない」で EmptyState の文言を変える",
    ],
    demos: [{ title: "検索・絞り込み・表示の切り替え", file: "patterns/search-filter/Basic" }],
    files: [
      { path: um("features/user-filter/model/useUserFilter.ts"), note: "URL の ?q=・?role= を読み書きするフック" },
      { path: um("features/user-filter/model/filterUsers.ts"), note: "条件に合うユーザーだけを返す（計算するだけ）" },
      { path: um("features/user-filter/ui/UserFilterBar.tsx"), note: "検索欄と権限のセレクト" },
      listPage,
      { path: "library/src/features/book-filter/model/useBookFilter.ts", note: "（別のお題）並び替え・ページも URL に持つ形" },
    ],
    app: "user-management",
    appPath: "/users?view=card",
    related: ["text-field", "toggle-button", "empty-state", "select"],
  },
];
