/**
 * 部品ページの中身（説明・見本・props）
 *
 * 部品を追加したら、ここに1件足し、demos/<slug>/ に見本ファイルを置く。
 *   - slug      … URL（/<slug>）と見本フォルダの名前
 *   - name      … 部品名（ページの見出し）
 *   - folder    … shared/ui/ のフォルダ名。省略すると name と同じ。ソースの表示に使う
 *   - imports   … インポートする名前。省略すると [name]
 *   - topics    … 使いそうなお題（一覧の表示と検索に使う）
 *   - dependsOn … 一緒にコピーが必要な shared/ui/ のフォルダ
 *   - demos     … demos/ からのパス（拡張子なし）
 */

export type Category =
  | "アプリの枠"
  | "レイアウト"
  | "ナビゲーション"
  | "入力"
  | "表示"
  | "フィードバック"
  | "ダイアログ";

export type PropDoc = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
};

export type ComponentDoc = {
  slug: string;
  name: string;
  folder?: string;
  imports?: string[];
  category: Category;
  description: string;
  topics: string;
  dependsOn?: string[];
  demos: { title: string; file: string }[];
  props: PropDoc[];
  /** props の表の下に出す補足（「残りの props は <button> へ渡す」など） */
  propsNote?: string;
};

export const categories: Category[] = [
  "アプリの枠",
  "レイアウト",
  "ナビゲーション",
  "入力",
  "表示",
  "フィードバック",
  "ダイアログ",
];

// 何度も出てくる props の説明
const childrenProp: PropDoc = {
  name: "children",
  type: "ReactNode",
  required: true,
  description: "中に表示する内容",
};
const gapProp: PropDoc = {
  name: "gap",
  type: "0〜7",
  default: "3",
  description: "要素の間隔。tokens.css の --space-1〜7 の番号（0 は間隔なし）",
};
const labelProp: PropDoc = {
  name: "label",
  type: "string",
  required: true,
  description: "入力欄の上に出すラベル",
};
const hintProp: PropDoc = { name: "hint", type: "string", description: "入力欄の下に出す補足説明" };
const errorProp: PropDoc = {
  name: "error",
  type: "string",
  description: "エラーメッセージ。渡すと赤枠になり、hint の代わりに表示される",
};
const optionsProp: PropDoc = {
  name: "options",
  type: "{ value: string; label: string }[]",
  required: true,
  description: "選択肢の一覧",
};

export const componentDocs: ComponentDoc[] = [
  // ==================== アプリの枠 ====================
  {
    slug: "app-shell",
    name: "AppShell",
    category: "アプリの枠",
    description:
      "ヘッダー・サイドバー・メインを並べるだけの枠。中身（Header・Sidebar）は外から渡す。枠の幅が 768px 未満になると、Sidebar は ☰ で開閉するメニューに切り替わる。",
    topics: "すべて（app/layouts/RootLayout.tsx で使う）",
    demos: [
      { title: "ヘッダー＋サイドバー", file: "app-shell/Basic" },
      { title: "サイドバーなし", file: "app-shell/NoSidebar" },
    ],
    props: [
      {
        name: "header",
        type: "ReactNode",
        required: true,
        description: "上に置く要素（<Header />）",
      },
      {
        name: "sidebar",
        type: "ReactNode",
        description: "左に置く要素（<Sidebar />）。省略するとメインが横幅いっぱいになる",
      },
      { name: "minHeight", type: "string", default: '"100dvh"', description: "枠の最低の高さ" },
      { ...childrenProp, description: "メインに表示する内容（React Router なら <Outlet />）" },
    ],
    propsNote:
      "☰ の開閉の state（menuOpen）は Header と Sidebar の両方で使うので、AppShell を使う側（RootLayout）で useState で持つ。",
  },
  {
    slug: "header",
    name: "Header",
    category: "アプリの枠",
    description:
      "画面の上のヘッダー。アプリ名・☰ ボタン・右側の要素（ユーザー名・カートなど）を並べる。☰ は onMenuClick を渡したときだけ作られ、AppShell の幅が狭いときだけ表示される。",
    topics: "すべて",
    dependsOn: ["Sidebar"],
    demos: [{ title: "右側に要素を置く", file: "header/Basic" }],
    props: [
      { name: "title", type: "string", required: true, description: "アプリ名" },
      {
        name: "homeTo",
        type: "string",
        description: "渡すと、アプリ名がそのページへのリンクになる",
      },
      { name: "right", type: "ReactNode", description: "右端に置く要素" },
      {
        name: "menuOpen",
        type: "boolean",
        default: "false",
        description: "サイドバーが開いているか（読み上げ用）",
      },
      {
        name: "onMenuClick",
        type: "() => void",
        description: "☰ が押されたとき。省略すると ☰ を出さない",
      },
      {
        name: "menuId",
        type: "string",
        default: '"app-sidebar"',
        description: "開閉する Sidebar の id。1画面に Sidebar を2つ置くときだけ変える",
      },
    ],
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    category: "アプリの枠",
    imports: ["Sidebar", "type SidebarNavItem"],
    description:
      "左のメニュー。今のページのリンクを強調する（NavLink）。狭い幅では open のときだけ重ねて表示し、暗い背景・リンク・Esc で閉じる。メニューが長いときは中だけスクロールする。",
    topics: "すべて（管理画面は groups で分ける）",
    demos: [{ title: "見出しつきのグループ", file: "sidebar/Groups" }],
    props: [
      {
        name: "navItems",
        type: "{ to: string; label: string; end?: boolean }[]",
        description: "見出しのないリンク。end: true で、URL が完全に一致するときだけ選択中にする",
      },
      {
        name: "groups",
        type: "{ title: string; items: SidebarNavItem[] }[]",
        description: "見出しつきのリンクのグループ",
      },
      { name: "open", type: "boolean", default: "false", description: "狭い幅で開いているか" },
      {
        name: "onClose",
        type: "() => void",
        description: "狭い幅で閉じるとき（暗い背景・リンク・Esc）",
      },
      {
        name: "footer",
        type: "ReactNode",
        description: "メニューの下に置く要素（ログイン中のユーザーなど）",
      },
      {
        name: "id",
        type: "string",
        default: '"app-sidebar"',
        description: "Header の menuId と同じ値にする",
      },
    ],
  },

  // ==================== レイアウト ====================
  {
    slug: "container",
    name: "Container",
    category: "レイアウト",
    description: "ページの中身の最大幅を決めて、中央に寄せる枠。ページの一番外側に置く。",
    topics: "すべて",
    demos: [{ title: "基本", file: "container/Basic" }],
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "最大幅。sm 640px（フォーム・1列の画面）/ md 960px / lg 1200px（表など）",
      },
      childrenProp,
    ],
  },
  {
    slug: "stack",
    name: "Stack",
    category: "レイアウト",
    description:
      "子要素を縦・横に並べて間隔をそろえる。margin の代わりに、親の gap で間隔を決める。",
    topics: "すべて",
    demos: [
      { title: "縦に並べる", file: "stack/Vertical" },
      { title: "横に並べる", file: "stack/Row" },
      { title: "両端に寄せる", file: "stack/SpaceBetween" },
      { title: "折り返す", file: "stack/Wrap" },
    ],
    props: [
      {
        name: "direction",
        type: '"column" | "row"',
        default: '"column"',
        description: "並べる向き",
      },
      gapProp,
      {
        name: "align",
        type: '"start" | "center" | "end" | "stretch"',
        default: '"stretch"',
        description: "並べる向きと直角方向のそろえ方（横並びなら上下）",
      },
      {
        name: "justify",
        type: '"start" | "center" | "end" | "between"',
        default: '"start"',
        description: "並べる向きのそろえ方（横並びなら左右）。between は両端に寄せる",
      },
      {
        name: "wrap",
        type: "boolean",
        default: "false",
        description: "入りきらない要素を折り返す",
      },
    ],
    propsNote: "そのほかの props（className・role など）は <div> にそのまま渡す。",
  },
  {
    slug: "grid",
    name: "Grid",
    category: "レイアウト",
    description: "カードなどを格子状に並べる。最小幅を決めると、画面幅に入る数だけ自動で並ぶ。",
    topics: "EC（商品）・アルバム・蔵書・ダッシュボード",
    demos: [{ title: "カードを並べる", file: "grid/Cards" }],
    props: [
      { name: "min", type: "number", default: "220", description: "1つあたりの最小幅（px）" },
      { ...gapProp, type: "1〜7", default: "4" },
      childrenProp,
    ],
  },
  {
    slug: "page-header",
    name: "PageHeader",
    category: "レイアウト",
    description: "ページの見出し。タイトルと説明を左、操作ボタンを右に置く。",
    topics: "すべて",
    demos: [{ title: "基本", file: "page-header/Basic" }],
    props: [
      { name: "title", type: "string", required: true, description: "ページのタイトル（<h1>）" },
      { name: "description", type: "string", description: "タイトルの下の説明" },
      { name: "action", type: "ReactNode", description: "右側に置く要素（ボタンなど）" },
    ],
  },

  // ==================== ナビゲーション ====================
  {
    slug: "button-link",
    name: "ButtonLink",
    category: "ナビゲーション",
    description:
      "ボタンの見た目をしたリンク（React Router の Link）。ページを移動するだけのボタンに使う。保存・削除など処理をするものは Button。",
    topics: "すべて（新規登録・編集・一覧へ戻る）",
    dependsOn: ["Button"],
    demos: [{ title: "基本", file: "button-link/Basic" }],
    props: [
      { name: "to", type: "string", required: true, description: "移動先の URL" },
      {
        name: "variant",
        type: '"primary" | "secondary" | "danger" | "ghost"',
        default: '"primary"',
        description: "見た目（Button と同じ）",
      },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "大きさ" },
      { name: "fullWidth", type: "boolean", default: "false", description: "横幅いっぱいに広げる" },
    ],
    propsNote:
      "そのほかの props（replace・aria-label など）は Link にそのまま渡す。見た目は Button.module.css を使い回している。",
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "ナビゲーション",
    description:
      "パンくずリスト（今いるページまでの道すじ）。最後の項目は今のページなのでリンクにしない。",
    topics: "詳細・編集ページのあるお題",
    demos: [{ title: "基本", file: "breadcrumb/Basic" }],
    props: [
      {
        name: "items",
        type: "{ label: string; to?: string }[]",
        required: true,
        description: "項目の一覧。今のページ（最後）には to を書かない",
      },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "ナビゲーション",
    description: "同じ画面の中で、表示する内容を切り替えるタブ。← → キーでも移動できる。",
    topics: "ユーザ詳細・受講管理・商品詳細",
    demos: [{ title: "基本", file: "tabs/Basic" }],
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "タブ全体の名前（読み上げ用）",
      },
      {
        name: "items",
        type: "{ id: string; label: string; content: ReactNode }[]",
        required: true,
        description: "タブの一覧",
      },
      {
        name: "value",
        type: "string",
        description: "選ばれているタブの id（親で持つとき）。省略すると最初のタブ",
      },
      {
        name: "onChange",
        type: "(id: string) => void",
        description: "タブが切り替わったときに呼ばれる",
      },
    ],
  },
  {
    slug: "segmented-control",
    name: "SegmentedControl",
    category: "ナビゲーション",
    description:
      "つながったボタンで選択肢から1つ選ぶ。絞り込みや表示の切り替えに使う（フォームの送信には RadioGroup）。",
    topics: "タスク・在庫・注文管理（絞り込み）",
    demos: [{ title: "絞り込み", file: "segmented-control/Filter" }],
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "何を切り替えるか（読み上げ用）",
      },
      {
        name: "options",
        type: "{ value: T; label: string }[]",
        required: true,
        description: "選択肢",
      },
      { name: "value", type: "T", required: true, description: "選ばれている値" },
      {
        name: "onChange",
        type: "(value: T) => void",
        required: true,
        description: "選択が変わったときに呼ばれる",
      },
    ],
    propsNote:
      'T は options の value の型（"all" | "active" など）。value・onChange の型もそれに合わせて決まる。',
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "ナビゲーション",
    description: "ページ送り。最初・最後・今のページの前後を表示し、間は「…」で省略する。",
    topics: "掲示板・蔵書・注文管理（件数が多い一覧）",
    demos: [{ title: "一覧を分けて表示する", file: "pagination/Basic" }],
    props: [
      { name: "page", type: "number", required: true, description: "今のページ（1 から数える）" },
      {
        name: "pageCount",
        type: "number",
        required: true,
        description: "全部で何ページあるか（1以下なら表示しない）",
      },
      {
        name: "onChange",
        type: "(page: number) => void",
        required: true,
        description: "ページを押したときに呼ばれる",
      },
    ],
  },

  // ==================== 入力 ====================
  {
    slug: "button",
    name: "Button",
    category: "入力",
    description:
      'ボタン。type の初期値は "button" なので、フォームの送信ボタンには type="submit" を付ける。ページの移動だけなら ButtonLink。',
    topics: "すべて",
    demos: [
      { title: "種類", file: "button/Variants" },
      { title: "大きさ", file: "button/Sizes" },
      { title: "状態", file: "button/States" },
    ],
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "danger" | "ghost"',
        default: '"primary"',
        description:
          "primary：主な操作 / secondary：補助 / danger：削除 / ghost：枠なしの控えめな操作",
      },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "大きさ" },
      { name: "fullWidth", type: "boolean", default: "false", description: "横幅いっぱいに広げる" },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "「処理中…」と表示して押せなくする",
      },
      {
        name: "type",
        type: '"button" | "submit" | "reset"',
        default: '"button"',
        description: "ボタンの種類",
      },
    ],
    propsNote:
      "そのほかの props（onClick・disabled・aria-label・form など）は <button> にそのまま渡す。",
  },
  {
    slug: "icon-button",
    name: "IconButton",
    category: "入力",
    description:
      "アイコン（記号・絵文字・SVG）だけのボタン。文字がないので label（読み上げ用の名前）は必須。",
    topics: "すべて（閉じる・削除・編集）",
    demos: [{ title: "基本", file: "icon-button/Basic" }],
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "何をするボタンか（aria-label・title になる）",
      },
      { name: "children", type: "ReactNode", required: true, description: "アイコン" },
      {
        name: "variant",
        type: '"ghost" | "secondary" | "danger"',
        default: '"ghost"',
        description: "見た目の種類",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "大きさ（md 36px / sm 28px）",
      },
    ],
    propsNote: "そのほかの props（onClick・disabled など）は <button> にそのまま渡す。",
  },
  {
    slug: "text-field",
    name: "TextField",
    category: "入力",
    description:
      "ラベル・補足説明・エラー表示つきの入力欄。文字・数値・日付・メールなど。React Hook Form の register をそのまま渡せる。",
    topics: "すべて",
    demos: [
      { title: "基本", file: "text-field/Basic" },
      { title: "補足説明とエラー", file: "text-field/HintAndError" },
      { title: "React Hook Form", file: "text-field/WithReactHookForm" },
    ],
    props: [labelProp, hintProp, errorProp],
    propsNote:
      'そのほかの props（type・value・onChange・placeholder・{...register()} など）は <input> にそのまま渡す。数値は register("name", { valueAsNumber: true })。',
  },
  {
    slug: "text-area-field",
    name: "TextAreaField",
    category: "入力",
    description: "複数行の入力欄（TextField の textarea 版）。",
    topics: "掲示板（本文）・メモ・タスク（詳細）・レビュー",
    demos: [{ title: "文字数を表示する", file: "text-area-field/Basic" }],
    props: [
      labelProp,
      hintProp,
      errorProp,
      { name: "rows", type: "number", default: "4", description: "表示する行数" },
    ],
    propsNote: "そのほかの props は <textarea> にそのまま渡す。",
  },
  {
    slug: "select-field",
    name: "SelectField",
    category: "入力",
    description: "ラベル・エラー表示つきのセレクトボックス。選択肢は配列で渡す。",
    topics: "すべて（カテゴリ・並び順）",
    demos: [
      { title: "基本", file: "select-field/Basic" },
      { title: "「選択してください」なし（並び替え）", file: "select-field/NoPlaceholder" },
    ],
    props: [
      labelProp,
      optionsProp,
      {
        name: "placeholder",
        type: "string | false",
        default: '"選択してください"',
        description: '未選択のときの文言（value="" の選択肢として先頭に入る）。false なら入れない',
      },
      errorProp,
    ],
    propsNote:
      "そのほかの props（value・onChange・{...register()} など）は <select> にそのまま渡す。",
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    category: "入力",
    description:
      "選択肢から1つ選ぶラジオボタンのグループ。選択肢を全部見せたいときに使う。React Hook Form の register をそのまま渡せる。",
    topics: "EC（支払い方法）・タスク（優先度）・アンケート",
    demos: [
      { title: "基本", file: "radio-group/Basic" },
      { title: "React Hook Form（Switch も一緒に）", file: "radio-group/WithReactHookForm" },
    ],
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "グループの見出し（<legend>）",
      },
      optionsProp,
      { name: "value", type: "string", description: "選ばれている値（useState で持つとき）" },
      {
        name: "defaultValue",
        type: "string",
        description: "最初に選んでおく値（state で持たないとき）",
      },
      {
        name: "direction",
        type: '"column" | "row"',
        default: '"column"',
        description: "並べる向き",
      },
      errorProp,
    ],
    propsNote:
      "そのほかの props（name・onChange・{...register()} など）は、すべてのラジオボタンに渡す。",
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "入力",
    description:
      "ラベルつきのチェックボックス（1つのオン・オフ）。文字をクリックしても切り替わる。",
    topics: "EC（規約に同意）・在庫（お気に入り）",
    demos: [{ title: "基本", file: "checkbox/Basic" }],
    props: [
      { name: "label", type: "string", required: true, description: "チェックボックスの横の文字" },
    ],
    propsNote:
      'そのほかの props（checked・onChange・{...register()} など）は <input type="checkbox"> にそのまま渡す。',
  },
  {
    slug: "checkbox-group",
    name: "CheckboxGroup",
    category: "入力",
    description:
      "チェックボックスのグループ（選択肢からいくつでも選ぶ）。React Hook Form の register を渡すと、選んだ値の配列で届く。",
    topics: "受講管理（科目）・蔵書（ジャンル）・掲示板（タグ）",
    demos: [
      { title: "useState で持つ", file: "checkbox-group/Basic" },
      { title: "React Hook Form", file: "checkbox-group/WithReactHookForm" },
    ],
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "グループの見出し（<legend>）",
      },
      optionsProp,
      {
        name: "value",
        type: "string[]",
        description: "選ばれている値の配列（useState で持つとき）",
      },
      {
        name: "direction",
        type: '"column" | "row"',
        default: '"column"',
        description: "並べる向き",
      },
      errorProp,
    ],
    propsNote:
      "そのほかの props（onChange・{...register()} など）は、すべてのチェックボックスに渡す。React Hook Form の defaultValues は [] にする。",
  },
  {
    slug: "switch",
    name: "Switch",
    category: "入力",
    description:
      "オン・オフを切り替えるスイッチ。押した瞬間に反映される設定に使う（同意などは Checkbox）。",
    topics: "ユーザ管理（有効・無効）・設定・絞り込み",
    demos: [{ title: "基本", file: "switch/Basic" }],
    props: [{ name: "label", type: "string", required: true, description: "スイッチの横の文字" }],
    propsNote:
      'そのほかの props（checked・onChange・disabled・{...register()} など）は <input type="checkbox"> にそのまま渡す。',
  },
  {
    slug: "quantity-stepper",
    name: "QuantityStepper",
    category: "入力",
    description: "「− 3 ＋」の形で数量を増減する。min・max の端ではボタンが押せなくなる。",
    topics: "EC（カート）・在庫・注文管理",
    demos: [{ title: "カートの数量", file: "quantity-stepper/Basic" }],
    props: [
      { name: "label", type: "string", required: true, description: "何の数量か（読み上げ用）" },
      { name: "value", type: "number", required: true, description: "今の数量" },
      {
        name: "onChange",
        type: "(value: number) => void",
        required: true,
        description: "± を押したときに呼ばれる",
      },
      { name: "min", type: "number", default: "0", description: "最小値" },
      { name: "max", type: "number", default: "Infinity", description: "最大値（在庫数など）" },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "両方のボタンを押せなくする",
      },
    ],
  },
  {
    slug: "rating",
    name: "Rating / RatingField",
    folder: "Rating",
    imports: ["Rating", "RatingField"],
    category: "入力",
    description:
      "星の評価。Rating は表示用、RatingField は入力用（中身はラジオボタン）。RatingField の値は文字列で届くので、zod の z.coerce.number() で数値にする。",
    topics: "蔵書（レビュー）・EC（商品の評価）",
    demos: [
      { title: "表示（Rating）", file: "rating/Display" },
      { title: "入力（RatingField ＋ React Hook Form）", file: "rating/WithReactHookForm" },
    ],
    props: [
      {
        name: "value（Rating）",
        type: "number",
        required: true,
        description: "0〜5 の点数（小数は四捨五入）",
      },
      {
        name: "label（RatingField）",
        type: "string",
        required: true,
        description: "グループの見出し",
      },
      {
        name: "value（RatingField）",
        type: "number",
        description: "選ばれている点数（useState で持つとき）",
      },
      { name: "error（RatingField）", type: "string", description: "エラーメッセージ" },
    ],
    propsNote:
      "RatingField のそのほかの props（name・onChange・{...register()} など）は、すべてのラジオボタンに渡す。",
  },
  {
    slug: "image-field",
    name: "ImageField",
    category: "入力",
    description:
      "画像を選んでプレビューする。選んだ画像は縮小した JPEG の data URL（文字列）で受け取るので、そのまま localStorage に保存できる。値を親が持つ部品なので、React Hook Form では Controller でつなぐ。",
    topics: "アルバム・ユーザ管理（プロフィール画像）",
    demos: [
      { title: "useState で持つ", file: "image-field/Basic" },
      { title: "React Hook Form（Controller）", file: "image-field/WithController" },
    ],
    props: [
      labelProp,
      {
        name: "value",
        type: "string",
        required: true,
        description: '選ばれている画像の data URL。未選択は ""',
      },
      {
        name: "onChange",
        type: "(dataUrl: string) => void",
        required: true,
        description: "画像を選んだ・取り消したときに呼ばれる",
      },
      hintProp,
      errorProp,
      {
        name: "maxSize",
        type: "number",
        default: "800",
        description: "縮小後の長い辺のピクセル数",
      },
    ],
    propsNote:
      "localStorage は合計 5MB ほどしか保存できない。たくさん保存するなら maxSize を小さくする。",
  },

  // ==================== 表示 ====================
  {
    slug: "card",
    name: "Card",
    category: "表示",
    description:
      "見出し・本文・フッター（ボタン置き場）を持つカード。Grid で並べると高さがそろう。",
    topics: "すべて",
    demos: [{ title: "基本", file: "card/Basic" }],
    props: [
      { name: "title", type: "string", description: "カードの見出し" },
      { name: "footer", type: "ReactNode", description: "下部に右寄せで置く要素（ボタンなど）" },
      childrenProp,
    ],
  },
  {
    slug: "table",
    name: "Table",
    category: "表示",
    imports: ["Table", "type TableColumn"],
    description:
      "列の定義とデータの配列を渡して作る表。セルは折り返さず、狭い画面では表だけが横スクロールする。",
    topics: "在庫・ユーザ管理・注文管理・家計簿・予約一覧",
    demos: [
      { title: "基本", file: "table/Basic" },
      { title: "長い文章の列を折り返す", file: "table/Wrap" },
      { title: "0件のとき", file: "table/Empty" },
    ],
    props: [
      {
        name: "columns",
        type: "TableColumn<T>[]",
        required: true,
        description: "列の定義：{ key, header, render: (row) => 中身, align?, rowHeader?, wrap? }",
      },
      { name: "rows", type: "T[]", required: true, description: "表示するデータの配列" },
      {
        name: "getRowKey",
        type: "(row: T) => string",
        required: true,
        description: "行ごとに重複しない key（id など）を返す",
      },
      { name: "caption", type: "string", description: "表の名前（読み上げ用。画面には出ない）" },
      {
        name: "emptyMessage",
        type: "string",
        default: '"データがありません"',
        description: "0件のときの文言",
      },
    ],
    propsNote:
      'rowHeader: true の列は「行の見出し」（<th scope="row">）になる。wrap: true の列だけは文字を折り返す（メモ・感想など）。',
  },
  {
    slug: "description-list",
    name: "DescriptionList",
    category: "表示",
    description:
      "「項目名：値」を並べる（詳細ページ・確認画面）。置かれた場所が狭いと、項目名の下に値を置く1列になる。",
    topics: "詳細ページのあるお題",
    demos: [{ title: "基本", file: "description-list/Basic" }],
    props: [
      {
        name: "items",
        type: "{ term: string; description: ReactNode; multiline?: boolean }[]",
        required: true,
        description: "項目の一覧。multiline: true で改行をそのまま表示する",
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "表示",
    description: "状態やカテゴリを示す小さなラベル。",
    topics: "すべて（在庫切れ・進行中・完了）",
    demos: [{ title: "色", file: "badge/Tones" }],
    props: [
      {
        name: "tone",
        type: '"neutral" | "info" | "success" | "warning" | "danger"',
        default: '"neutral"',
        description: "色（灰・メイン・緑・橙・赤）",
      },
      childrenProp,
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "表示",
    description:
      "ユーザーのアイコン。画像がなければ名前の1文字目を出す（背景色は名前から決まる）。",
    topics: "ユーザ管理・掲示板（投稿者）",
    demos: [{ title: "基本", file: "avatar/Basic" }],
    props: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "名前（読み上げ・1文字目・色に使う）",
      },
      { name: "src", type: "string", description: "画像の URL（data URL も可）" },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "大きさ（28 / 40 / 64px）",
      },
    ],
  },
  {
    slug: "stat",
    name: "Stat",
    category: "表示",
    description: "集計の数字を大きく見せる枠。いくつか並べるときは Grid で包む。",
    topics: "家計簿・タスク（件数）・ダッシュボード",
    demos: [{ title: "Grid で並べる", file: "stat/Basic" }],
    props: [
      { name: "label", type: "string", required: true, description: "何の数字か" },
      { name: "value", type: "ReactNode", required: true, description: "数字" },
      { name: "note", type: "string", description: "数字の下の補足" },
      {
        name: "tone",
        type: '"neutral" | "success" | "danger"',
        default: '"neutral"',
        description: "danger：注意が必要（赤字・期限切れ）/ success：よい状態",
      },
    ],
  },
  {
    slug: "progress-bar",
    name: "ProgressBar",
    category: "表示",
    description: "進み具合のバー。value / max の割合で伸び、max を超えても 100% で止まる。",
    topics: "受講管理（進捗）・家計簿（予算）・タスク（完了率）",
    demos: [{ title: "基本", file: "progress-bar/Basic" }],
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        description: "何の進み具合か（表示・読み上げ）",
      },
      { name: "value", type: "number", required: true, description: "今の値" },
      { name: "max", type: "number", default: "100", description: "最大値" },
      { name: "valueText", type: "string", description: "右上の文字。省略するとパーセント" },
      {
        name: "tone",
        type: '"primary" | "success" | "warning" | "danger"',
        default: '"primary"',
        description: "バーの色",
      },
    ],
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "表示",
    description:
      "見出しをクリックすると中身が開閉する。ブラウザ標準の <details> を使うので、開閉の state を持たなくてよい。",
    topics: "注文管理（明細）・EC（よくある質問）",
    demos: [
      { title: "よくある質問", file: "accordion/Basic" },
      { title: "1つだけ開く", file: "accordion/Exclusive" },
    ],
    props: [
      {
        name: "items",
        type: "{ title: string; content: ReactNode; defaultOpen?: boolean }[]",
        required: true,
        description: "項目の一覧。defaultOpen で最初から開いておける",
      },
      {
        name: "exclusive",
        type: "boolean",
        default: "false",
        description: "1つ開くと、ほかを自動で閉じる",
      },
    ],
  },

  // ==================== フィードバック ====================
  {
    slug: "alert",
    name: "Alert",
    category: "フィードバック",
    description: "操作の結果や通信エラーを知らせるメッセージ枠。",
    topics: "すべて",
    demos: [
      { title: "色", file: "alert/Tones" },
      { title: "閉じられるメッセージ", file: "alert/Closable" },
    ],
    props: [
      {
        name: "tone",
        type: '"info" | "success" | "error"',
        default: '"info"',
        description: "色と読み上げ方",
      },
      { name: "title", type: "string", description: "太字の見出し" },
      { name: "onClose", type: "() => void", description: "渡すと右上に × ボタンを出す" },
      childrenProp,
    ],
  },
  {
    slug: "toast",
    name: "Toast",
    category: "フィードバック",
    folder: "Toast",
    imports: ["ToastProvider", "useToast"],
    description:
      "画面の右下に数秒だけ出る通知。アプリ全体を ToastProvider で1回包み、どこからでも useToast().show() で出す。",
    topics: "すべて（登録しました・削除しました）",
    demos: [
      { title: "通知を出す", file: "toast/Basic" },
      { title: "Provider で包む", file: "toast/Setup" },
    ],
    props: [
      {
        name: "show(message, tone?)",
        type: '(string, "info" | "success" | "error") => void',
        default: 'tone: "success"',
        description: "useToast() が返す関数。通知を出し、4秒後に自動で消す",
      },
      {
        name: "<ToastProvider>",
        type: "{ children: ReactNode }",
        required: true,
        description: "アプリ全体を包む。中で useToast() が使えるようになる",
      },
    ],
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    category: "フィードバック",
    description: "一覧が0件のときや、データが見つからないときに表示する案内。",
    topics: "すべて",
    demos: [{ title: "基本", file: "empty-state/Basic" }],
    props: [
      { name: "title", type: "string", required: true, description: "案内の見出し" },
      { name: "description", type: "string", description: "補足の説明" },
      { name: "action", type: "ReactNode", description: "次に取れる操作（ButtonLink など）" },
    ],
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "フィードバック",
    description: "読み込み中を示す回転アイコン。",
    topics: "API・非同期処理があるお題",
    demos: [{ title: "基本", file: "spinner/Basic" }],
    props: [
      {
        name: "label",
        type: "string",
        default: '"読み込み中"',
        description: "読み上げ用の文言（画面には出ない）",
      },
    ],
  },

  // ==================== ダイアログ ====================
  {
    slug: "modal",
    name: "Modal",
    category: "ダイアログ",
    description: "ブラウザ標準の <dialog> を使ったモーダル。Esc キー・背景のクリックで閉じる。",
    topics: "タスク（追加・編集）・在庫（入出庫）",
    demos: [{ title: "フォームを載せる", file: "modal/Basic" }],
    props: [
      { name: "open", type: "boolean", required: true, description: "開いているかどうか" },
      {
        name: "onClose",
        type: "() => void",
        required: true,
        description: "Esc・背景のクリックで呼ばれる",
      },
      { name: "title", type: "string", required: true, description: "モーダルの見出し" },
      { name: "footer", type: "ReactNode", description: "下部に右寄せで置く要素（ボタンなど）" },
      childrenProp,
    ],
  },
  {
    slug: "confirm-dialog",
    name: "ConfirmDialog",
    category: "ダイアログ",
    description: "「本当に実行しますか？」の確認ダイアログ。削除など、取り消せない操作の前に使う。",
    topics: "すべて（削除の確認）",
    dependsOn: ["Modal", "Button"],
    demos: [{ title: "削除の確認", file: "confirm-dialog/Delete" }],
    props: [
      { name: "open", type: "boolean", required: true, description: "開いているかどうか" },
      { name: "title", type: "string", required: true, description: "見出し" },
      { name: "message", type: "string", required: true, description: "本文" },
      { name: "confirmLabel", type: "string", default: '"削除"', description: "実行ボタンの文言" },
      { name: "danger", type: "boolean", default: "true", description: "実行ボタンを赤にする" },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "実行ボタンを「処理中…」にする",
      },
      {
        name: "onConfirm",
        type: "() => void",
        required: true,
        description: "実行ボタンで呼ばれる",
      },
      {
        name: "onCancel",
        type: "() => void",
        required: true,
        description: "キャンセル・Esc・背景のクリックで呼ばれる",
      },
    ],
  },
];
