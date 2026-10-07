/**
 * 部品ページの中身（説明・押さえどころ・見本・props） ── pages/component-docs/model
 *
 * 公式ドキュメント（https://mui.com/material-ui/）をもとに、よく使う部品と使い方を日本語でまとめたもの。
 * 部品を追加したら、ここに1件足し、demos/<slug>/ に見本ファイルを置く。
 *   - slug     … URL（/<slug>）と見本フォルダの名前
 *   - imports  … @mui/material から読み込む部品。省略すると [name]（自作部品では "@/shared/ui" から読み込む名前）
 *   - points   … 押さえどころ。`…` で囲んだ部分はコードとして表示する
 *   - demos    … demos/ からのパス（拡張子なし）
 *   - docsUrl  … 公式ドキュメントのページ
 *   - sharedUi … true なら shared/ui の自作部品。ソースコードも表示する
 */

export type PropDoc = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
};

export type MuiCategory =
  | "レイアウト"
  | "ナビゲーション"
  | "入力"
  | "表示"
  | "フィードバック"
  | "ダイアログ"
  | "自作部品（shared/ui）";

export type MuiDoc = {
  slug: string;
  name: string;
  category: MuiCategory;
  description: string;
  imports?: string[];
  /** アイコンや型など、ほかに読み込むもの（インポート文をそのまま書く） */
  extraImports?: string[];
  points: string[];
  demos: { title: string; file: string }[];
  props: PropDoc[];
  propsNote?: string;
  docsUrl?: string;
  sharedUi?: boolean;
};

export const muiCategories: MuiCategory[] = [
  "レイアウト",
  "ナビゲーション",
  "入力",
  "表示",
  "フィードバック",
  "ダイアログ",
  "自作部品（shared/ui）",
];

const docs = (page: string) => `https://mui.com/material-ui/${page}/`;

// 何度も出てくる props の説明
const sxProp: PropDoc = {
  name: "sx",
  type: "SxProps<Theme>",
  description: "その場で書くスタイル。p: 2（16px）・color: \"text.secondary\" のように theme の値を使える",
};
const childrenProp: PropDoc = { name: "children", type: "ReactNode", description: "中に表示する内容" };
const colorProp = (defaultValue: string): PropDoc => ({
  name: "color",
  type: '"primary" | "secondary" | "success" | "error" | "info" | "warning"',
  default: defaultValue,
  description: "theme の palette の色",
});
const openProp: PropDoc = { name: "open", type: "boolean", required: true, description: "開いているかどうか" };

/** 部品ページの「インポート」に出すコード */
export const getMuiImportCode = (doc: MuiDoc) => {
  if (doc.sharedUi) return `import { ${(doc.imports ?? [doc.name]).join(", ")} } from "@/shared/ui";`;
  const lines = (doc.imports ?? [doc.name]).map((name) => `import ${name} from "@mui/material/${name}";`);
  return [...(doc.extraImports ?? []), ...lines].join("\n");
};

export const muiDocs: MuiDoc[] = [
  // ==================== レイアウト ====================
  {
    slug: "box",
    name: "Box",
    category: "レイアウト",
    description: "sx でスタイルを書ける <div>。余白・背景・枠線・flex など、ちょっとした見た目をその場で付けるときに使う。",
    points: [
      "スタイルは `sx` に書く。`p: 2` は theme.spacing(2) = 16px、`borderRadius: 1` は 8px（theme.ts の基準値の倍数）になる",
      "色は `\"primary.main\"`・`\"text.secondary\"`・`\"divider\"` のように theme の名前で書く。直接 `#4f46e5` と書かない",
      "値を `{ xs: ..., md: ... }` にすると画面幅ごとに切り替わる（xs 0px〜 / sm 600px〜 / md 900px〜 / lg 1200px〜）",
      "`component=\"section\"` のように、出力する HTML のタグを変えられる",
      "v9 では `<Box mt={2}>` のような書き方（システム props）は使えない。必ず `sx={{ mt: 2 }}` に書く",
    ],
    demos: [
      { title: "sx の基本", file: "box/Sx" },
      { title: "横に並べる（flex）", file: "box/Flex" },
      { title: "画面幅で切り替える", file: "box/Responsive" },
    ],
    props: [
      sxProp,
      { name: "component", type: "ElementType", default: '"div"', description: "出力する HTML のタグや部品" },
      childrenProp,
    ],
    docsUrl: docs("react-box"),
  },
  {
    slug: "container",
    name: "Container",
    category: "レイアウト",
    description: "中身の最大幅を決めて、中央に寄せる枠。ページの一番外側に置く。",
    points: [
      "`maxWidth` で最大幅を選ぶ。1列のフォームは `\"sm\"`、一覧や表は `\"md\"`〜`\"lg\"` が目安",
      "左右の余白（スマホでは 16px、600px 以上では 24px）は Container が付ける",
      "上下の余白は `sx={{ py: 3 }}` で足す",
    ],
    demos: [{ title: "基本", file: "container/Basic" }],
    props: [
      {
        name: "maxWidth",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | false',
        default: '"lg"',
        description: "最大幅。xs 444px / sm 600px / md 900px / lg 1200px / xl 1536px。false で制限なし",
      },
      { name: "disableGutters", type: "boolean", default: "false", description: "左右の余白をなくす" },
      { name: "fixed", type: "boolean", default: "false", description: "画面幅に合わせて段階的に幅を固定する" },
      sxProp,
    ],
    docsUrl: docs("react-container"),
  },
  {
    slug: "stack",
    name: "Stack",
    category: "レイアウト",
    description: "子要素を縦・横に並べて、間隔をそろえる。画面の組み立てでいちばんよく使う。",
    points: [
      "`spacing` で間隔を決める（`spacing={2}` → 16px）。子要素に margin を付けなくてよい",
      "`direction=\"row\"` で横並び。`direction={{ xs: \"column\", sm: \"row\" }}` でスマホだけ縦にできる",
      "そろえ方は `sx={{ alignItems: \"center\", justifyContent: \"space-between\" }}` に書く（v9 では props に直接書けない）",
      "折り返すときは `useFlexGap` と `sx={{ flexWrap: \"wrap\" }}` をセットで使う",
      "`component=\"form\"` にすると、フォームをそのまま Stack で組める",
    ],
    demos: [
      { title: "縦に並べる", file: "stack/Vertical" },
      { title: "横に並べる・両端に寄せる", file: "stack/Row" },
      { title: "画面幅で向きを変える・区切り線", file: "stack/Responsive" },
      { title: "折り返す", file: "stack/Wrap" },
    ],
    props: [
      {
        name: "direction",
        type: '"column" | "row" | { xs, sm, ... }',
        default: '"column"',
        description: "並べる向き。画面幅ごとにも指定できる",
      },
      { name: "spacing", type: "number | { xs, sm, ... }", default: "0", description: "要素の間隔（theme.spacing の倍数）" },
      { name: "divider", type: "ReactNode", description: "要素の間に入れる区切り（<Divider /> など）" },
      { name: "useFlexGap", type: "boolean", default: "false", description: "間隔を CSS の gap で作る。折り返すときは必須" },
      { name: "component", type: "ElementType", default: '"div"', description: "出力するタグ（\"form\"・\"ul\" など）" },
      sxProp,
    ],
    docsUrl: docs("react-stack"),
  },
  {
    slug: "grid",
    name: "Grid",
    category: "レイアウト",
    description: "横幅を 12 等分した格子に並べる。カードの一覧や、2列・3列のレイアウトに使う。",
    points: [
      "親に `container`、子に `size` を付ける。`size={6}` は 12 マスのうち 6 マス（半分）",
      "`size={{ xs: 12, sm: 6, md: 4 }}` で、スマホ 1列・タブレット 2列・PC 3列になる",
      "`size=\"grow\"` で残りの幅を全部使い、`size=\"auto\"` で中身の幅だけ使う",
      "v9 の Grid は昔の `item`・`xs={6}` の書き方が使えない。古い記事のコードはそのまま動かない",
      "縦に並べるだけなら Grid ではなく Stack を使う（Grid の `direction=\"column\"` は廃止された）",
    ],
    demos: [
      { title: "size の基本", file: "grid/Basic" },
      { title: "画面幅で列の数を変える", file: "grid/Responsive" },
    ],
    props: [
      { name: "container", type: "boolean", default: "false", description: "格子の親にする" },
      {
        name: "size",
        type: 'number | "grow" | "auto" | { xs, sm, ... }',
        description: "子の幅（12 マスのうちいくつ使うか）",
      },
      { name: "spacing", type: "number | { xs, sm, ... }", default: "0", description: "子の間隔（container に付ける）" },
      { name: "columns", type: "number", default: "12", description: "横を何マスに分けるか" },
      { name: "offset", type: "number | { xs, sm, ... }", description: "左に空けるマス数" },
      sxProp,
    ],
    docsUrl: docs("react-grid"),
  },
  {
    slug: "paper",
    name: "Paper",
    category: "レイアウト",
    description: "白い面（背景は theme の background.paper）。Card・Dialog・Menu の土台にもなっている。",
    points: [
      "`elevation`（0〜24）で影の強さ、`variant=\"outlined\"` で影の代わりに枠線にする",
      "まとまりを囲むだけなら Paper、見出し・ボタンを持つまとまりなら Card を使う",
      "`TableContainer component={Paper}` のように、ほかの部品の見た目として使うことも多い",
    ],
    demos: [{ title: "影と枠線", file: "paper/Basic" }],
    props: [
      { name: "elevation", type: "0〜24", default: "1", description: "影の強さ" },
      { name: "variant", type: '"elevation" | "outlined"', default: '"elevation"', description: "影か枠線か" },
      { name: "square", type: "boolean", default: "false", description: "角丸をなくす" },
      sxProp,
    ],
    docsUrl: docs("react-paper"),
  },

  // ==================== ナビゲーション ====================
  {
    slug: "app-bar",
    name: "AppBar",
    category: "ナビゲーション",
    imports: ["AppBar", "Toolbar"],
    description: "画面上部のヘッダー。中身は Toolbar で横に並べる。",
    points: [
      "`AppBar > Toolbar` の形で使う。Toolbar が高さと左右の余白をそろえる",
      "タイトルに `sx={{ flexGrow: 1 }}` を付けると、右側のボタンが右端へ寄る",
      "`position=\"fixed\"` にすると、下の内容がヘッダーの裏に隠れる。メインの先頭に空の `<Toolbar />` を置いて高さ分ずらす",
      "AppBar の中のボタン・アイコンは `color=\"inherit\"` で白文字にそろえる",
      "shared/ui の AppShell（このカタログ・library の枠）は、AppBar ＋ Drawer を組み合わせて作っている",
    ],
    demos: [{ title: "基本", file: "app-bar/Basic" }],
    props: [
      {
        name: "position",
        type: '"fixed" | "absolute" | "sticky" | "static" | "relative"',
        default: '"fixed"',
        description: "fixed：画面上部に固定 / sticky：スクロールで上に貼り付く / static：普通に並ぶ",
      },
      colorProp('"primary"'),
      { name: "elevation", type: "number", default: "4", description: "影の強さ（0 で影なし）" },
    ],
    docsUrl: docs("react-app-bar"),
  },
  {
    slug: "drawer",
    name: "Drawer",
    category: "ナビゲーション",
    imports: ["Drawer", "List", "ListItem", "ListItemButton", "ListItemIcon", "ListItemText"],
    description: "画面の端から出てくるパネル。サイドメニューや、絞り込み条件のパネルに使う。",
    points: [
      "`open` と `onClose` で開閉する。onClose は背景のクリック・Esc キーで呼ばれる",
      "`variant=\"temporary\"`（初期値）は重ねて表示、`\"permanent\"` は常に表示（PC のサイドメニュー）",
      "PC では permanent、スマホでは temporary に切り替えるのが定番。`useMediaQuery(theme.breakpoints.up(\"md\"))` で判定する",
      "中身は List で作り、項目を押したら閉じる",
    ],
    demos: [{ title: "ボタンで開くメニュー", file: "drawer/Temporary" }],
    props: [
      { name: "open", type: "boolean", default: "false", description: "開いているかどうか（temporary のとき）" },
      { name: "onClose", type: "(event, reason) => void", description: "背景のクリック・Esc で呼ばれる" },
      { name: "anchor", type: '"left" | "right" | "top" | "bottom"', default: '"left"', description: "出てくる向き" },
      {
        name: "variant",
        type: '"temporary" | "persistent" | "permanent"',
        default: '"temporary"',
        description: "temporary：重ねて表示 / persistent：押し出して表示 / permanent：常に表示",
      },
    ],
    docsUrl: docs("react-drawer"),
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "ナビゲーション",
    imports: ["Tabs", "Tab"],
    description: "同じ画面の中で、表示する内容を切り替えるタブ。",
    points: [
      "`Tabs` の `value` と、各 `Tab` の `value` が一致したタブが選ばれる",
      "`onChange` の第2引数に押したタブの value が届く：`onChange={(_event, value) => setValue(value)}`",
      "Tabs が切り替えるのはタブの見た目だけ。中身（パネル）は自分で出し分ける",
      "Tab に `id`・`aria-controls`、パネルに `role=\"tabpanel\"`・`aria-labelledby` を付けると、読み上げでつながる",
      "ページの切り替えに使うときは `<Tab component={RouterLink} to=\"/...\" />` にし、value に今の URL を入れる",
    ],
    demos: [{ title: "基本", file: "tabs/Basic" }],
    props: [
      { name: "value", type: "any", required: true, description: "選ばれているタブの value" },
      { name: "onChange", type: "(event, value) => void", description: "タブが押されたときに呼ばれる" },
      { name: "variant", type: '"standard" | "scrollable" | "fullWidth"', default: '"standard"', description: "タブが多いときは scrollable" },
      { name: "<Tab> label", type: "ReactNode", description: "タブの文字" },
      { name: "<Tab> value", type: "any", description: "このタブの値。省略すると 0 から始まる番号" },
    ],
    docsUrl: docs("react-tabs"),
  },
  {
    slug: "breadcrumbs",
    name: "Breadcrumbs",
    category: "ナビゲーション",
    imports: ["Breadcrumbs", "Link", "Typography"],
    extraImports: ['import { Link as RouterLink } from "react-router";'],
    description: "パンくずリスト。今いるページの位置（一覧 > 詳細 など）を示す。",
    points: [
      "親ページは `Link`、今いるページはリンクにせず `Typography` で出す",
      "アプリ内のリンクは `component={RouterLink} to=\"/...\"` にする（Link の解説を参照）",
      "`aria-label=\"パンくずリスト\"` を付け、今のページには `aria-current=\"page\"` を付ける",
      "区切りは `separator` で変えられる（初期値は \"/\"）",
    ],
    demos: [{ title: "基本", file: "breadcrumbs/Basic" }],
    props: [
      { name: "separator", type: "ReactNode", default: '"/"', description: "区切りの文字やアイコン" },
      { name: "maxItems", type: "number", default: "8", description: "これを超えると途中を「…」で省略する" },
      childrenProp,
    ],
    docsUrl: docs("react-breadcrumbs"),
  },
  {
    slug: "link",
    name: "Link",
    category: "ナビゲーション",
    extraImports: ['import { Link as RouterLink } from "react-router";'],
    description: "テーマの色が付いたリンク。React Router のリンクとしても使える。",
    points: [
      "アプリ内のページへは `component={RouterLink} to=\"/notes\"` にする。`href` のままだとページ全体を読み込み直し、state が消える",
      "React Router の `Link` と名前がぶつかるので、`import { Link as RouterLink } from \"react-router\"` と別名で読み込む",
      "`Button`・`ListItemButton`・`Tab` も同じく `component={RouterLink}` でリンクにできる",
      "別タブで開く外部リンクは `target=\"_blank\"` と `rel=\"noopener\"` を付ける",
    ],
    demos: [
      { title: "下線と外部リンク", file: "link/Basic" },
      { title: "React Router とつなぐ", file: "link/WithRouter" },
    ],
    props: [
      { name: "href", type: "string", description: "外部サイトなどのリンク先" },
      { name: "component", type: "ElementType", default: '"a"', description: "RouterLink を渡すと to が使える" },
      { name: "underline", type: '"always" | "hover" | "none"', default: '"always"', description: "下線の出し方" },
      { name: "color", type: "string", default: '"primary"', description: "文字の色（\"inherit\" で親と同じ）" },
    ],
    docsUrl: docs("react-link"),
  },
  {
    slug: "menu",
    name: "Menu",
    category: "ナビゲーション",
    imports: ["Menu", "MenuItem"],
    description: "ボタンを押すと出るメニュー（︙ の操作メニューなど）。",
    points: [
      "「どの要素の下に出すか」を `anchorEl` の state に持つ。`null` なら閉じている",
      "開くときは `setAnchorEl(event.currentTarget)`、閉じるときは `setAnchorEl(null)`",
      "項目は `MenuItem`。押したときの処理のあとで、メニューを閉じる",
      "ボタンに `aria-haspopup`・`aria-expanded`・`aria-controls` を付けると、メニューが開くことが伝わる",
    ],
    demos: [{ title: "操作メニュー", file: "menu/Basic" }],
    props: [
      openProp,
      { name: "anchorEl", type: "HTMLElement | null", description: "メニューを出す基準の要素" },
      { name: "onClose", type: "() => void", description: "外側のクリック・Esc で呼ばれる" },
      { name: "<MenuItem> onClick", type: "() => void", description: "項目を押したときの処理" },
    ],
    docsUrl: docs("react-menu"),
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "ナビゲーション",
    description: "ページ送り。一覧を何件ずつかに分けて表示する。",
    points: [
      "`count`（全ページ数）・`page`（今のページ）・`onChange` を渡す",
      "page は 1 から数える（TablePagination は 0 から。混ぜないように注意）",
      "全ページ数は `Math.ceil(件数 / 1ページの件数)`、表示する分は `slice` で切り出す",
      "絞り込み条件が変わったら `setPage(1)` で最初のページへ戻す",
    ],
    demos: [{ title: "一覧を分けて表示する", file: "pagination/Basic" }],
    props: [
      { name: "count", type: "number", default: "1", description: "全部で何ページあるか" },
      { name: "page", type: "number", description: "今のページ（1 から）" },
      { name: "onChange", type: "(event, page: number) => void", description: "ページが押されたときに呼ばれる" },
      colorProp('"standard"'),
      { name: "shape", type: '"circular" | "rounded"', default: '"circular"', description: "ボタンの形" },
    ],
    docsUrl: docs("react-pagination"),
  },

  // ==================== 入力 ====================
  {
    slug: "button",
    name: "Button",
    category: "入力",
    description: "ボタン。variant で見た目の強さ、color で色を選ぶ。",
    points: [
      "`variant`：contained（主な操作）/ outlined（補助）/ text（控えめ。初期値）。主な操作は1画面に1つが目安",
      "削除などの危険な操作は `color=\"error\"` にする",
      "フォームの送信ボタンは `type=\"submit\"` を付ける",
      "`loading` を true にすると回転アイコンが出て押せなくなる。送信中の二重押しを防ぐ（RHF なら `loading={isSubmitting}`）",
      "アイコンは `startIcon={<DeleteIcon />}` のように付ける。アイコンは `@mui/icons-material/アイコン名` から読み込む",
    ],
    demos: [
      { title: "種類（variant）", file: "button/Variants" },
      { title: "色と大きさ", file: "button/ColorsAndSizes" },
      { title: "アイコン・処理中・押せない", file: "button/IconsAndLoading" },
    ],
    props: [
      { name: "variant", type: '"contained" | "outlined" | "text"', default: '"text"', description: "見た目の種類" },
      { name: "color", type: '"primary" | "secondary" | "success" | "error" | "info" | "warning" | "inherit"', default: '"primary"', description: "色" },
      { name: "size", type: '"small" | "medium" | "large"', default: '"medium"', description: "大きさ" },
      { name: "startIcon / endIcon", type: "ReactNode", description: "文字の左・右に置くアイコン" },
      { name: "loading", type: "boolean | null", default: "null", description: "true で処理中の表示にして押せなくする" },
      { name: "loadingPosition", type: '"start" | "center" | "end"', default: '"center"', description: "回転アイコンの位置。start なら文字を残す" },
      { name: "disabled", type: "boolean", default: "false", description: "押せなくする" },
      { name: "fullWidth", type: "boolean", default: "false", description: "親の幅いっぱいに広げる" },
      { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "フォームの送信ボタンは submit" },
    ],
    propsNote: "このカタログ・library の theme.ts では、影なし（disableElevation）と、文字を大文字にしない設定を初期値にしている。",
    docsUrl: docs("react-button"),
  },
  {
    slug: "icon-button",
    name: "IconButton",
    category: "入力",
    extraImports: ['import DeleteIcon from "@mui/icons-material/Delete";'],
    description: "アイコンだけのボタン（編集・削除・閉じる など）。",
    points: [
      "文字がないので、`aria-label=\"削除\"` を必ず付ける（読み上げで何のボタンか分かるように）",
      "`Tooltip` で包むと、マウスを乗せたときに説明が出る",
      "アイコンは `@mui/icons-material` から1つずつ読み込む。名前は公式の Material Icons 検索ページで探せる",
      "リストの右端など、端に置くときは `edge=\"end\"` で余白を詰める",
    ],
    demos: [{ title: "基本", file: "icon-button/Basic" }],
    props: [
      { name: "aria-label", type: "string", required: true, description: "何をするボタンか（読み上げ用）" },
      { name: "color", type: '"default" | "inherit" | "primary" | "error" | ...', default: '"default"', description: "色" },
      { name: "size", type: '"small" | "medium" | "large"', default: '"medium"', description: "大きさ" },
      { name: "edge", type: '"start" | "end" | false', default: "false", description: "端に置くとき、余白を詰める" },
      { name: "disabled", type: "boolean", default: "false", description: "押せなくする" },
    ],
    docsUrl: `${docs("react-button")}#icon-button`,
  },
  {
    slug: "text-field",
    name: "TextField",
    category: "入力",
    description: "ラベル・補足説明・エラー表示がそろった入力欄。select を付けるとセレクトボックスにもなる。",
    points: [
      "`value` と `onChange` で state とつなぐ。値は `event.target.value`（type=\"number\" でも文字列）",
      "エラーは `error`（赤枠）と `helperText`（下の文）の2つで出す",
      "`<input>` の属性（min・max など）は `slotProps={{ htmlInput: { min: 0 } }}`、左右のアイコンは `slotProps={{ input: { startAdornment } }}` に書く",
      "v9 では古い記事の `InputProps`・`inputProps`・`InputLabelProps` は使えない。`slotProps.input`・`slotProps.htmlInput`・`slotProps.inputLabel` に置き換える",
      "React Hook Form とは `Controller` でつなぐ。ref は `inputRef` に渡す（毎回書くなら shared/ui の FormTextField を使う）",
      "`type=\"date\"` は値がなくても「年/月/日」が出るので、`slotProps={{ inputLabel: { shrink: true } }}` でラベルを上に置く",
    ],
    demos: [
      { title: "基本・見た目の種類", file: "text-field/Basic" },
      { title: "エラーと補足説明", file: "text-field/Validation" },
      { title: "数値・パスワード・日付・複数行", file: "text-field/Types" },
      { title: "アイコン・単位を付ける", file: "text-field/Adornment" },
      { title: "React Hook Form（Controller）", file: "text-field/WithReactHookForm" },
    ],
    props: [
      { name: "label", type: "ReactNode", description: "ラベル" },
      { name: "value / onChange", type: "unknown / (event) => void", description: "入力値と、入力されたときの処理" },
      { name: "error", type: "boolean", default: "false", description: "赤枠にする" },
      { name: "helperText", type: "ReactNode", description: "下に出す補足説明・エラー文" },
      { name: "type", type: "string", default: '"text"', description: "\"number\"・\"password\"・\"email\"・\"date\" など" },
      { name: "required", type: "boolean", default: "false", description: "ラベルに * を付ける（チェックは自分で書く）" },
      { name: "multiline / minRows / maxRows", type: "boolean / number / number", description: "複数行の入力欄にする" },
      { name: "select", type: "boolean", default: "false", description: "セレクトボックスにする（中に MenuItem を並べる）" },
      { name: "variant", type: '"outlined" | "filled" | "standard"', default: '"outlined"', description: "見た目" },
      { name: "size", type: '"small" | "medium"', default: '"medium"', description: "大きさ" },
      { name: "fullWidth", type: "boolean", default: "false", description: "親の幅いっぱいに広げる" },
      { name: "slotProps", type: "{ input, htmlInput, inputLabel, select, formHelperText }", description: "中の部品へ props を渡す" },
      { name: "inputRef", type: "Ref", description: "中の <input> への ref（React Hook Form の field.ref を渡す）" },
    ],
    docsUrl: docs("react-text-field"),
  },
  {
    slug: "select",
    name: "Select",
    category: "入力",
    imports: ["TextField", "MenuItem"],
    description: "選択肢から選ぶセレクトボックス。1つ選ぶなら TextField の select、複数選ぶなら Select を直接使う。",
    points: [
      "1つ選ぶだけなら `<TextField select>` がいちばん手軽。ラベル・エラー表示も TextField と同じ書き方",
      "選択肢は `<MenuItem value=\"food\">食品</MenuItem>` で並べる。未選択は `\"\"` で表す",
      "複数選ぶときは `FormControl > InputLabel + Select multiple`。`labelId` と `label` の両方を書かないと、ラベルの位置がずれる",
      "multiple の値は配列。`renderValue` で選んだものを Chip で並べられる",
      "選択肢が多い・文字で絞り込みたいときは Autocomplete を使う",
    ],
    demos: [
      { title: "TextField の select（1つ選ぶ）", file: "select/TextFieldSelect" },
      { title: "複数選ぶ（Select multiple）", file: "select/Multiple" },
    ],
    props: [
      { name: "<TextField> select", type: "boolean", default: "false", description: "TextField をセレクトボックスにする" },
      { name: "value", type: "string | string[]", description: "選ばれている値（multiple なら配列）" },
      { name: "onChange", type: "(event: SelectChangeEvent) => void", description: "選んだ値は event.target.value" },
      { name: "<Select> multiple", type: "boolean", default: "false", description: "複数選べるようにする" },
      { name: "<Select> labelId / label", type: "string / ReactNode", description: "InputLabel の id と、枠に空けるラベルの文字" },
      { name: "<Select> renderValue", type: "(value) => ReactNode", description: "選んだ値の表示を変える" },
    ],
    docsUrl: docs("react-select"),
  },
  {
    slug: "autocomplete",
    name: "Autocomplete",
    category: "入力",
    imports: ["Autocomplete", "TextField"],
    description: "文字を入力して候補を絞り込めるセレクト。選択肢が多いとき（都道府県・商品名など）に使う。",
    points: [
      "入力欄は `renderInput={(params) => <TextField {...params} label=\"…\" />}` で作る。params は必ず全部渡す",
      "`onChange` の第2引数に選んだ値（オブジェクト）が入る。未選択は `null`",
      "選択肢がオブジェクトなら、`getOptionLabel`（表示する文字）と `isOptionEqualToValue`（同じものかの判定）を書く",
      "`multiple` で複数選択（値は配列）、`freeSolo` で候補にない文字も入力できる",
      "v9 では選んだ値の表示を変える `renderTags` は廃止され、`renderValue` になった",
    ],
    demos: [
      { title: "1つ選ぶ（オブジェクトの選択肢）", file: "autocomplete/Basic" },
      { title: "複数選ぶ・自由入力", file: "autocomplete/Multiple" },
    ],
    props: [
      { name: "options", type: "T[]", required: true, description: "選択肢" },
      { name: "renderInput", type: "(params) => ReactNode", required: true, description: "入力欄（TextField）を返す" },
      { name: "value / onChange", type: "T | null / (event, value) => void", description: "選んだ値と、選ばれたときの処理" },
      { name: "getOptionLabel", type: "(option: T) => string", description: "選択肢に表示する文字" },
      { name: "isOptionEqualToValue", type: "(option, value) => boolean", description: "選択肢と値が同じものかの判定" },
      { name: "multiple", type: "boolean", default: "false", description: "複数選べるようにする（値は配列）" },
      { name: "freeSolo", type: "boolean", default: "false", description: "候補にない文字も入力できる" },
      { name: "noOptionsText", type: "ReactNode", default: '"No options"', description: "候補がないときの文言" },
    ],
    docsUrl: docs("react-autocomplete"),
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "入力",
    imports: ["Checkbox", "FormControlLabel"],
    description: "チェックボックス。FormControlLabel と組み合わせてラベルを付ける。",
    points: [
      "ラベルは `<FormControlLabel control={<Checkbox />} label=\"…\" />` で付ける（文字を押しても切り替わる）",
      "値は `checked` で渡し、`event.target.checked`（true / false）で受け取る。value ではない",
      "複数選ぶときは選んだ値を配列で持ち、`FormControl component=\"fieldset\"` ＋ `FormLabel component=\"legend\"` で囲む",
      "React Hook Form では `Controller` で `checked={field.value}`・`onChange={(e) => field.onChange(e.target.checked)}` とつなぐ",
      "v9 では `inputProps`・`inputRef` が廃止された。中の <input> へは `slotProps={{ input: { ... } }}` で渡す",
    ],
    demos: [
      { title: "基本", file: "checkbox/Basic" },
      { title: "複数選ぶ（グループ）", file: "checkbox/Group" },
      { title: "React Hook Form（同意の必須チェック）", file: "checkbox/WithReactHookForm" },
    ],
    props: [
      { name: "checked", type: "boolean", description: "チェックされているか（state で持つとき）" },
      { name: "defaultChecked", type: "boolean", description: "最初にチェックしておく（state で持たないとき）" },
      { name: "onChange", type: "(event, checked: boolean) => void", description: "切り替わったときに呼ばれる" },
      { name: "indeterminate", type: "boolean", default: "false", description: "「一部だけ選択」の表示（全選択のチェックなど）" },
      colorProp('"primary"'),
      { name: "<FormControlLabel> label", type: "ReactNode", required: true, description: "横に出す文字" },
      { name: "<FormControlLabel> control", type: "ReactElement", required: true, description: "<Checkbox /> などを渡す" },
    ],
    docsUrl: docs("react-checkbox"),
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    category: "入力",
    imports: ["FormControl", "FormLabel", "RadioGroup", "FormControlLabel", "Radio"],
    description: "選択肢から1つ選ぶラジオボタンのグループ。",
    points: [
      "`RadioGroup` に `value` と `onChange` を渡す。選ばれた Radio の value が `event.target.value` に入る",
      "各選択肢は `<FormControlLabel value=\"free\" control={<Radio />} label=\"無料\" />`。value は FormControlLabel に書く",
      "見出しは `FormLabel` に id を付け、RadioGroup の `aria-labelledby` で結び付ける",
      "`row` で横に並べる",
      "React Hook Form では `<RadioGroup {...field}>` と渡すだけでつながる",
    ],
    demos: [
      { title: "基本", file: "radio-group/Basic" },
      { title: "React Hook Form（未選択のエラー）", file: "radio-group/WithReactHookForm" },
    ],
    props: [
      { name: "value", type: "string", description: "選ばれている値" },
      { name: "onChange", type: "(event, value: string) => void", description: "選ばれたときに呼ばれる" },
      { name: "row", type: "boolean", default: "false", description: "横に並べる" },
      { name: "name", type: "string", description: "ラジオボタンの name（省略すると自動で付く）" },
      { name: "<FormControl> error", type: "boolean", default: "false", description: "中の FormLabel・FormHelperText を赤にする" },
    ],
    docsUrl: docs("react-radio-button"),
  },
  {
    slug: "switch",
    name: "Switch",
    category: "入力",
    imports: ["Switch", "FormControlLabel"],
    description: "オン・オフの切り替え。押した瞬間に反映される設定に使う。",
    points: [
      "使い方は Checkbox と同じ。`checked` と `event.target.checked` で扱う",
      "ラベルは `FormControlLabel` で付ける",
      "「通知をオンにする」のようにすぐ反映される設定は Switch、「同意する」のように送信して決まる項目は Checkbox が目安",
    ],
    demos: [{ title: "基本", file: "switch/Basic" }],
    props: [
      { name: "checked", type: "boolean", description: "オンかどうか" },
      { name: "onChange", type: "(event, checked: boolean) => void", description: "切り替わったときに呼ばれる" },
      colorProp('"primary"'),
      { name: "size", type: '"small" | "medium"', default: '"medium"', description: "大きさ" },
      { name: "disabled", type: "boolean", default: "false", description: "押せなくする" },
    ],
    docsUrl: docs("react-switch"),
  },
  {
    slug: "toggle-button",
    name: "ToggleButtonGroup",
    category: "入力",
    imports: ["ToggleButtonGroup", "ToggleButton"],
    description: "つながったボタンで選択肢から選ぶ。一覧の絞り込みや表示の切り替えに使う。",
    points: [
      "`exclusive` を付けると1つだけ選べる（付けないと値が配列になり、複数選べる）",
      "選択中のボタンをもう一度押すと `null` が届く。必ずどれかを選ばせたいときは `if (next !== null)` で無視する",
      "アイコンだけのボタンには `aria-label` を付ける",
      "フォームで値を送るならラジオボタン、画面の表示を切り替えるなら ToggleButtonGroup が目安",
    ],
    demos: [
      { title: "絞り込み", file: "toggle-button/Filter" },
      { title: "アイコンで表示を切り替える", file: "toggle-button/ViewMode" },
    ],
    props: [
      { name: "value", type: "any", description: "選ばれている値（exclusive でなければ配列）" },
      { name: "onChange", type: "(event, value) => void", description: "押されたときに呼ばれる" },
      { name: "exclusive", type: "boolean", default: "false", description: "1つだけ選べるようにする" },
      { name: "size", type: '"small" | "medium" | "large"', default: '"medium"', description: "大きさ" },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "並べる向き" },
      { name: "<ToggleButton> value", type: "any", required: true, description: "このボタンの値" },
    ],
    docsUrl: docs("react-toggle-button"),
  },
  {
    slug: "slider",
    name: "Slider",
    category: "入力",
    description: "つまみを動かして数値を選ぶ。音量や、価格の範囲の指定に使う。",
    points: [
      "value を数値にすると1つのつまみ、`[最小, 最大]` の配列にすると範囲の指定になる",
      "`onChange` の第2引数に新しい値が届く（value と同じ型）",
      "`min`・`max`・`step` で範囲と刻みを決め、`marks` で目盛りを付ける",
      "`valueLabelDisplay=\"auto\"` で、動かしている間だけ値を吹き出しに出す",
      "文字のラベルと `aria-labelledby` で結び付ける",
    ],
    demos: [{ title: "1つの値・範囲", file: "slider/Basic" }],
    props: [
      { name: "value", type: "number | number[]", description: "今の値（配列なら範囲）" },
      { name: "onChange", type: "(event, value) => void", description: "動かしたときに呼ばれる" },
      { name: "min / max", type: "number", default: "0 / 100", description: "最小値・最大値" },
      { name: "step", type: "number | null", default: "1", description: "刻み" },
      { name: "marks", type: "boolean | { value, label }[]", default: "false", description: "目盛り" },
      { name: "valueLabelDisplay", type: '"on" | "auto" | "off"', default: '"off"', description: "値の吹き出し" },
    ],
    docsUrl: docs("react-slider"),
  },
  {
    slug: "rating",
    name: "Rating",
    category: "入力",
    description: "星の評価（レビューなど）。入力にも、平均点の表示にも使える。",
    points: [
      "値は `number | null`。選んでいる星をもう一度押すと null になる",
      "`readOnly` で表示だけにする。`precision={0.5}` で半分の星も出せる",
      "`name` を付けると、中のラジオボタンがグループになる",
    ],
    demos: [{ title: "評価する・表示する", file: "rating/Basic" }],
    props: [
      { name: "value", type: "number | null", description: "今の評価" },
      { name: "onChange", type: "(event, value: number | null) => void", description: "星が押されたときに呼ばれる" },
      { name: "max", type: "number", default: "5", description: "星の数" },
      { name: "precision", type: "number", default: "1", description: "刻み（0.5 で半分の星）" },
      { name: "readOnly", type: "boolean", default: "false", description: "表示だけにする" },
    ],
    docsUrl: docs("react-rating"),
  },

  // ==================== 表示 ====================
  {
    slug: "typography",
    name: "Typography",
    category: "表示",
    description: "文字を表示する。見出し・本文・注釈などの大きさと太さを theme に合わせてそろえる。",
    points: [
      "`variant` は見た目（h1〜h6・subtitle1/2・body1/2・caption・overline）",
      "`component` は HTML のタグ。`variant=\"h5\" component=\"h1\"` で「見た目は h5、タグは h1」にできる",
      "補足の文字は `color=\"text.secondary\"` にすることが多い",
      "太さ・文字の大きさなどは `sx={{ fontWeight: \"bold\" }}` で変える",
      "v9 では `paragraph` が廃止された。下の余白は `gutterBottom` か `sx={{ mb: 2 }}` で付ける",
    ],
    demos: [
      { title: "variant", file: "typography/Variants" },
      { title: "タグ・色・省略", file: "typography/ComponentAndColor" },
    ],
    props: [
      { name: "variant", type: '"h1"〜"h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "overline" | "button"', default: '"body1"', description: "見た目" },
      { name: "component", type: "ElementType", description: "HTML のタグ。省略すると variant に合ったタグ（h1〜h6・p・span）" },
      { name: "color", type: "string", description: "\"text.secondary\"・\"error\"・\"primary.main\" など theme の色" },
      { name: "align", type: '"inherit" | "left" | "center" | "right" | "justify"', default: '"inherit"', description: "文字のそろえ方" },
      { name: "gutterBottom", type: "boolean", default: "false", description: "下に余白を付ける" },
      { name: "noWrap", type: "boolean", default: "false", description: "1行に収め、はみ出した分を「…」にする" },
      sxProp,
    ],
    docsUrl: docs("react-typography"),
  },
  {
    slug: "card",
    name: "Card",
    category: "表示",
    imports: ["Card", "CardHeader", "CardContent", "CardActions"],
    description: "見出し・本文・ボタンを1つにまとめたカード。商品や記事の一覧に使う。",
    points: [
      "中は `CardHeader`（見出し）・`CardContent`（本文）・`CardActions`（ボタン）に分ける",
      "画像は `CardMedia`。`image` は背景画像として表示されるので、`sx={{ height: 160 }}` で高さを必ず決める",
      "カード全体を押せるようにするときは `CardActionArea` で包む",
      "一覧にするときは Grid で並べる",
      "このカタログ・library の theme.ts では、影ではなく枠線（variant=\"outlined\"）を初期値にしている",
    ],
    demos: [
      { title: "見出し・本文・ボタン", file: "card/Basic" },
      { title: "画像付き・カード全体を押せる", file: "card/WithMedia" },
    ],
    props: [
      { name: "variant", type: '"elevation" | "outlined"', default: '"elevation"', description: "影か枠線か（Paper と同じ）" },
      { name: "<CardHeader> title / subheader", type: "ReactNode", description: "見出しと、その下の小さな文字" },
      { name: "<CardHeader> action / avatar", type: "ReactNode", description: "右上に置くボタン / 左に置くアイコン" },
      { name: "<CardMedia> image", type: "string", description: "画像の URL（高さを sx で決める）" },
      sxProp,
    ],
    docsUrl: docs("react-card"),
  },
  {
    slug: "list",
    name: "List",
    category: "表示",
    imports: ["List", "ListItem", "ListItemButton", "ListItemIcon", "ListItemText"],
    description: "縦に並んだ項目の一覧。メニュー・設定項目・Todo リストなどに使う。",
    points: [
      "基本形は `List > ListItem > ListItemIcon ＋ ListItemText`",
      "`ListItemText` は `primary`（1行目）と `secondary`（2行目の薄い文字）を持てる",
      "行全体を押せるようにするときは `ListItemButton` を使う（ListItem の `button` は廃止された）",
      "右端のボタンは `ListItem` の `secondaryAction` に置く",
      "`divider` で項目の下に線、`dense` で詰めて表示",
    ],
    demos: [
      { title: "アイコンと2行の文字", file: "list/Basic" },
      { title: "押せる行・右端のボタン（Todo リスト）", file: "list/WithActions" },
    ],
    props: [
      { name: "<List> dense", type: "boolean", default: "false", description: "上下の余白を詰める" },
      { name: "<List> subheader", type: "ReactNode", description: "一覧の見出し（ListSubheader）" },
      { name: "<ListItem> secondaryAction", type: "ReactNode", description: "右端に置く要素（削除ボタンなど）" },
      { name: "<ListItem> divider", type: "boolean", default: "false", description: "下に区切り線を引く" },
      { name: "<ListItem> disablePadding", type: "boolean", default: "false", description: "中に ListItemButton を置くときに付ける" },
      { name: "<ListItemText> primary / secondary", type: "ReactNode", description: "1行目 / 2行目の文字" },
    ],
    docsUrl: docs("react-list"),
  },
  {
    slug: "table",
    name: "Table",
    category: "表示",
    imports: ["TableContainer", "Table", "TableHead", "TableBody", "TableRow", "TableCell", "Paper"],
    description: "表。HTML の <table> と同じ形で組み立てる。並び替え・ページ送りは自分で書く。",
    points: [
      "形は `TableContainer > Table > TableHead / TableBody > TableRow > TableCell`",
      "`TableContainer component={Paper}` で枠付きの白い面にする。狭い画面では表だけが横スクロールする",
      "数値の列は `align=\"right\"` で右寄せ。`size=\"small\"` で行を詰める",
      "並び替えは `TableSortLabel` で矢印を出し、データの並び替え（`toSorted`）は自分で書く",
      "ページ送りは `TablePagination`。page は 0 から数える。`labelRowsPerPage`・`labelDisplayedRows` で文言を日本語にできる",
      "行が多い・絞り込みや列の幅変更が要るときは、別パッケージの MUI X Data Grid（@mui/x-data-grid）も候補",
    ],
    demos: [
      { title: "基本", file: "table/Basic" },
      { title: "並び替え（TableSortLabel）", file: "table/Sort" },
      { title: "ページ送り（TablePagination）", file: "table/Pagination" },
    ],
    props: [
      { name: "<Table> size", type: '"small" | "medium"', default: '"medium"', description: "行の高さ" },
      { name: "<TableRow> hover", type: "boolean", default: "false", description: "マウスを乗せた行の色を変える" },
      { name: "<TableCell> align", type: '"left" | "center" | "right"', default: '"left"', description: "文字のそろえ方" },
      { name: "<TableSortLabel> active / direction", type: 'boolean / "asc" | "desc"', description: "並び替え中か / 向き" },
      { name: "<TablePagination> count / page / rowsPerPage", type: "number", required: true, description: "全件数 / 今のページ（0 から）/ 1ページの行数" },
      { name: "<TablePagination> onPageChange", type: "(event, page) => void", required: true, description: "ページが変わったときに呼ばれる" },
    ],
    docsUrl: docs("react-table"),
  },
  {
    slug: "chip",
    name: "Chip",
    category: "表示",
    description: "状態・カテゴリ・タグを示す小さなラベル。押せる Chip や、× で消せる Chip にもなる。",
    points: [
      "`label` に文字、`color` と `variant`（filled / outlined）で見た目を変える",
      "状態（未着手・完了など）と色の対応は、entities の ui にまとめておくと使い回せる（例：StockStatusChip）",
      "`onClick` を渡すと押せる Chip、`onDelete` を渡すと × ボタンが付く",
      "並べるときは Stack の `direction=\"row\"`・`useFlexGap`・`flexWrap: \"wrap\"` で折り返す",
    ],
    demos: [
      { title: "色と種類", file: "chip/Basic" },
      { title: "押せる Chip・消せる Chip", file: "chip/Actions" },
    ],
    props: [
      { name: "label", type: "ReactNode", description: "表示する文字" },
      { name: "color", type: '"default" | "primary" | "secondary" | "success" | "error" | "info" | "warning"', default: '"default"', description: "色" },
      { name: "variant", type: '"filled" | "outlined"', default: '"filled"', description: "塗りつぶしか枠線か" },
      { name: "size", type: '"small" | "medium"', default: '"medium"', description: "大きさ" },
      { name: "icon", type: "ReactElement", description: "左に置くアイコン" },
      { name: "onClick", type: "(event) => void", description: "渡すと押せる Chip になる" },
      { name: "onDelete", type: "(event) => void", description: "渡すと × ボタンが付く" },
    ],
    docsUrl: docs("react-chip"),
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "表示",
    imports: ["Avatar", "AvatarGroup"],
    description: "ユーザーのアイコン。画像・文字・アイコンを丸い枠に入れる。",
    points: [
      "画像があれば `src`、なければ名前の1文字やアイコンを中に入れる",
      "大きさは `sx={{ width: 56, height: 56 }}`、背景色は `sx={{ bgcolor: \"primary.main\" }}` で変える",
      "`AvatarGroup` で重ねて並べ、`max` を超えた分は「+2」のようにまとめる",
    ],
    demos: [{ title: "文字・アイコン・グループ", file: "avatar/Basic" }],
    props: [
      { name: "src", type: "string", description: "画像の URL" },
      { name: "alt", type: "string", description: "画像の説明（src を使うとき）" },
      { name: "variant", type: '"circular" | "rounded" | "square"', default: '"circular"', description: "形" },
      { name: "<AvatarGroup> max", type: "number", default: "5", description: "表示する最大数" },
      sxProp,
    ],
    docsUrl: docs("react-avatar"),
  },
  {
    slug: "badge",
    name: "Badge",
    category: "表示",
    description: "アイコンの右上に数や点を出す。カートの点数・未読の数などに使う。",
    points: [
      "`badgeContent` に数を渡す。0 のときは自動で隠れる（`showZero` で 0 も表示）",
      "`max` を超えると「99+」のようにまとめる",
      "`variant=\"dot\"` で数を出さず点だけにする",
      "数はアイコンの見た目だけなので、ボタンの `aria-label` にも数を入れる（例：「カート（3点）」）",
    ],
    demos: [{ title: "数・上限・点", file: "badge/Basic" }],
    props: [
      { name: "badgeContent", type: "ReactNode", description: "表示する数や文字" },
      colorProp('"default"'),
      { name: "max", type: "number", default: "99", description: "これを超えると「max+」と表示" },
      { name: "showZero", type: "boolean", default: "false", description: "0 のときも表示する" },
      { name: "variant", type: '"standard" | "dot"', default: '"standard"', description: "dot で点だけ" },
      { name: "invisible", type: "boolean", default: "false", description: "隠す" },
    ],
    docsUrl: docs("react-badge"),
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "表示",
    description: "マウスを乗せる・フォーカスすると出る説明の吹き出し。",
    points: [
      "`title` に文言を渡し、説明したい要素を1つだけ子要素にする",
      "アイコンボタンの説明によく使う。ただし Tooltip は読み上げの代わりにならないので、`aria-label` も付ける",
      "`disabled` のボタンはマウスの動きを受け取らないので、`<span>` で包む",
      "`placement` で位置、`arrow` で矢印を付ける",
    ],
    demos: [{ title: "基本", file: "tooltip/Basic" }],
    props: [
      { name: "title", type: "ReactNode", required: true, description: "吹き出しの文言（空文字なら出さない）" },
      { name: "children", type: "ReactElement", required: true, description: "説明する要素（1つだけ）" },
      { name: "placement", type: '"top" | "bottom" | "left" | "right" | "top-start" | ...', default: '"bottom"', description: "出す位置" },
      { name: "arrow", type: "boolean", default: "false", description: "矢印を付ける" },
    ],
    docsUrl: docs("react-tooltip"),
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "表示",
    imports: ["Accordion", "AccordionSummary", "AccordionDetails"],
    extraImports: ['import ExpandMoreIcon from "@mui/icons-material/ExpandMore";'],
    description: "見出しを押すと中身が開閉する。よくある質問や、長いフォームの区切りに使う。",
    points: [
      "`Accordion > AccordionSummary（見出し）＋ AccordionDetails（中身）` の形",
      "開閉の矢印は `expandIcon={<ExpandMoreIcon />}` で付ける",
      "開閉の state を持たなくても動く。最初から開くなら `defaultExpanded`",
      "「1つだけ開く」にするときは、開いている項目を state に持ち、`expanded` と `onChange` を渡す",
    ],
    demos: [
      { title: "よくある質問", file: "accordion/Basic" },
      { title: "1つだけ開く（state で持つ）", file: "accordion/Controlled" },
    ],
    props: [
      { name: "expanded", type: "boolean", description: "開いているか（state で持つとき）" },
      { name: "defaultExpanded", type: "boolean", default: "false", description: "最初に開いておく（state で持たないとき）" },
      { name: "onChange", type: "(event, expanded: boolean) => void", description: "開閉したときに呼ばれる" },
      { name: "disabled", type: "boolean", default: "false", description: "開閉できなくする" },
      { name: "<AccordionSummary> expandIcon", type: "ReactNode", description: "右側の開閉アイコン" },
    ],
    docsUrl: docs("react-accordion"),
  },

  // ==================== フィードバック ====================
  {
    slug: "alert",
    name: "Alert",
    category: "フィードバック",
    imports: ["Alert", "AlertTitle"],
    description: "操作の結果やエラーを知らせるメッセージ枠。",
    points: [
      "`severity` で色とアイコンが決まる：success（成功）/ info（お知らせ）/ warning（注意）/ error（エラー）",
      "`variant` で塗り方を選ぶ：standard（薄い色。初期値）/ outlined / filled",
      "`AlertTitle` で太字の見出し、`onClose` で × ボタン、`action` で右側にボタンを置ける",
      "数秒で消える通知にしたいときは、Snackbar の中に入れる",
      "通信エラーの表示には `severity=\"error\"` ＋「再読み込み」ボタン（action）がよく使われる",
    ],
    demos: [
      { title: "severity と variant", file: "alert/Severity" },
      { title: "見出し・閉じるボタン・操作ボタン", file: "alert/TitleAndAction" },
    ],
    props: [
      { name: "severity", type: '"success" | "info" | "warning" | "error"', default: '"success"', description: "種類（色とアイコン）" },
      { name: "variant", type: '"standard" | "outlined" | "filled"', default: '"standard"', description: "塗り方" },
      { name: "onClose", type: "(event) => void", description: "渡すと × ボタンが付く" },
      { name: "action", type: "ReactNode", description: "右側に置く要素（onClose より優先）" },
      { name: "icon", type: "ReactNode | false", description: "左のアイコンを変える。false で消す" },
      childrenProp,
    ],
    docsUrl: docs("react-alert"),
  },
  {
    slug: "snackbar",
    name: "Snackbar",
    category: "フィードバック",
    imports: ["Snackbar", "Alert"],
    description: "画面の端に数秒だけ出る通知（保存しました など）。",
    points: [
      "出す内容（文言と種類）を state に持ち、`open={message !== null}` で開く",
      "`autoHideDuration={3000}` で3秒後に `onClose` が呼ばれる。閉じる処理は自分で書く",
      "`onClose` の reason が `\"clickaway\"`（ほかの場所をクリック）のときは閉じないのが定番",
      "中に `Alert` を入れると、色とアイコンが付いた通知になる",
      "アプリのどこからでも出したいときは、出す内容を Zustand の store に置き、`notify(\"…\")` で出す（shared/ui の Notifier）",
    ],
    demos: [{ title: "成功・失敗の通知", file: "snackbar/Basic" }],
    props: [
      openProp,
      { name: "onClose", type: '(event, reason: "timeout" | "clickaway" | "escapeKeyDown") => void', description: "時間切れ・外側のクリック・Esc で呼ばれる" },
      { name: "autoHideDuration", type: "number | null", default: "null", description: "何ミリ秒で onClose を呼ぶか" },
      { name: "anchorOrigin", type: '{ vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" }', default: '{ vertical: "bottom", horizontal: "left" }', description: "出す位置" },
      { name: "message", type: "ReactNode", description: "Alert を入れないときの文言" },
    ],
    docsUrl: docs("react-snackbar"),
  },
  {
    slug: "progress",
    name: "Progress",
    category: "フィードバック",
    imports: ["CircularProgress", "LinearProgress"],
    description: "読み込み中・処理中を示す回転アイコン（CircularProgress）と横棒（LinearProgress）。",
    points: [
      "`value` を渡さなければ動き続ける（終わりが分からない読み込み）",
      "`variant=\"determinate\"` と `value`（0〜100）で進み具合を出す",
      "一覧の読み込み中は、一覧の代わりに中央へ CircularProgress を出すのが定番（TanStack Query なら `isPending` のとき）",
      "ボタンの処理中は Progress を自分で置かず、Button の `loading` を使う",
      "読み上げのため `aria-label` を付ける",
    ],
    demos: [
      { title: "CircularProgress", file: "progress/Circular" },
      { title: "LinearProgress", file: "progress/Linear" },
    ],
    props: [
      { name: "variant", type: '"indeterminate" | "determinate"', default: '"indeterminate"', description: "動き続けるか、value まで塗るか（Linear には buffer・query もある）" },
      { name: "value", type: "number", description: "進み具合（0〜100）" },
      colorProp('"primary"'),
      { name: "<CircularProgress> size", type: "number | string", default: "40", description: "大きさ（px）" },
      { name: "<CircularProgress> thickness", type: "number", default: "3.6", description: "線の太さ" },
    ],
    docsUrl: docs("react-progress"),
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "フィードバック",
    description: "読み込み中に、中身と同じ形の灰色の枠を出す。読み込み後にレイアウトがずれにくい。",
    points: [
      "`variant`：text（文字の行）/ circular（丸。アバター）/ rectangular・rounded（四角。画像など）",
      "`width`・`height` を中身と同じ大きさにすると、読み込み後のずれがなくなる",
      "`isPending ? <Skeleton /> : <本物 />` のように切り替える",
    ],
    demos: [{ title: "カードの読み込み中", file: "skeleton/Basic" }],
    props: [
      { name: "variant", type: '"text" | "circular" | "rectangular" | "rounded"', default: '"text"', description: "形" },
      { name: "width / height", type: "number | string", description: "大きさ" },
      { name: "animation", type: '"pulse" | "wave" | false', default: '"pulse"', description: "動き方" },
    ],
    docsUrl: docs("react-skeleton"),
  },

  // ==================== ダイアログ ====================
  {
    slug: "dialog",
    name: "Dialog",
    category: "ダイアログ",
    imports: ["Dialog", "DialogTitle", "DialogContent", "DialogContentText", "DialogActions"],
    description: "画面の上に重ねて出す小さな画面（モーダル）。確認・入力フォームに使う。",
    points: [
      "`open` で開閉し、`onClose`（Esc キー・背景のクリックで呼ばれる）で state を閉じる",
      "中は `DialogTitle`（見出し）・`DialogContent`（本文）・`DialogActions`（右下のボタン）に分ける",
      "フォームを載せるときは `<form>` で DialogContent と DialogActions を包み、送信ボタンを `type=\"submit\"` にする",
      "閉じたあとに入力をリセットするなら `slotProps={{ transition: { onExited: () => reset() } }}`（閉じるアニメーションが終わってから消す）",
      "v9 では `disableEscapeKeyDown` が廃止された。Esc で閉じたくないときは onClose の reason が `\"escapeKeyDown\"` なら何もしない",
      "削除の確認だけなら、shared/ui の ConfirmDialog を使う",
    ],
    demos: [
      { title: "基本", file: "dialog/Basic" },
      { title: "フォームを載せる（React Hook Form）", file: "dialog/Form" },
    ],
    props: [
      openProp,
      { name: "onClose", type: '(event, reason: "escapeKeyDown" | "backdropClick") => void', description: "Esc・背景のクリックで呼ばれる" },
      { name: "maxWidth", type: '"xs" | "sm" | "md" | "lg" | "xl" | false', default: '"sm"', description: "最大幅" },
      { name: "fullWidth", type: "boolean", default: "false", description: "maxWidth まで広げる" },
      { name: "fullScreen", type: "boolean", default: "false", description: "全画面で出す（スマホ向け）" },
      { name: "slotProps", type: "{ paper, backdrop, transition }", description: "中の部品へ props を渡す（古い PaperProps・TransitionProps の代わり）" },
    ],
    docsUrl: docs("react-dialog"),
  },

  // ==================== 自作部品（shared/ui） ====================
  // 元は samples/_shared/mui-ui。library などの MUI 版のアプリは、これをコピーして使っている
  {
    slug: "app-shell",
    name: "AppShell",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    imports: ["AppShell", "type AppShellNavItem"],
    description:
      "ヘッダー（AppBar）＋ サイドメニュー（Drawer）＋ メインのアプリ全体の枠。このカタログの枠そのもの。",
    points: [
      "React Router のレイアウトルートで使う：`<AppShell title=\"蔵書管理\" navItems={navItems}><Outlet /></AppShell>`",
      "PC（900px 以上）はメニューを常に表示（`variant=\"permanent\"`）、スマホは ☰ で開閉（`\"temporary\"`）",
      "画面幅の判定は `useMediaQuery(theme.breakpoints.up(\"md\"))`",
      "メニューは `ListItemButton component={NavLink}`。今のページのリンクに付く `active` クラスを `\"&.active\"` で強調している",
      "`end: true` を付けた項目は、URL が完全に一致したときだけ選択中になる（`/books` と `/books/new` を区別する）",
      "固定ヘッダーの下に中身が隠れないよう、メインの先頭に空の `<Toolbar />` を置いている",
    ],
    demos: [],
    props: [
      { name: "title", type: "string", required: true, description: "ヘッダーに出すアプリ名（押すと homeTo へ移動）" },
      {
        name: "navItems",
        type: "{ to; label; icon?; end?; group? }[]",
        required: true,
        description: "メニューの項目。group が変わるところに見出しを出す",
      },
      { name: "homeTo", type: "string", default: '"/"', description: "タイトルを押したときの移動先" },
      { name: "headerRight", type: "ReactNode", description: "ヘッダーの右側に置く要素" },
      { name: "children", type: "ReactNode", required: true, description: "メインに表示する内容（<Outlet />）" },
    ],
  },
  {
    slug: "page-header",
    name: "PageHeader",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    imports: ["PageHeader", "type BreadcrumbItem"],
    description: "ページの見出し。パンくず・タイトル・説明を左、操作ボタンを右に置く。",
    points: [
      "タイトルは `<h1>` で出す（見た目は h5）。1ページに1つだけ置く",
      "`breadcrumbs` を渡すとパンくずリストを出す。`to` のない項目は今のページ（リンクにしない）",
      "狭い画面では右のボタンが下へ折り返す",
    ],
    demos: [{ title: "パンくず・説明・ボタン", file: "page-header/Basic" }],
    props: [
      { name: "title", type: "string", required: true, description: "ページのタイトル" },
      { name: "description", type: "ReactNode", description: "タイトルの下の説明" },
      { name: "breadcrumbs", type: "{ label: string; to?: string }[]", description: "パンくずリスト" },
      { name: "action", type: "ReactNode", description: "右側に置く要素（ボタンなど）" },
    ],
  },
  {
    slug: "form-text-field",
    name: "FormTextField",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    description: "React Hook Form と MUI の TextField をつなぐ部品。Controller を毎回書かずに済む。",
    points: [
      "`control` と `name` を渡すだけで、値・onChange・エラー表示（helperText）までつながる",
      "`name` は型チェックされるので、フォームにない項目名は書けない",
      "`select` を付ければセレクトボックス、`multiline` で複数行。TextField の props はそのまま渡せる",
      "ref は中の <input> に渡しているので、送信時にエラーの入力欄へフォーカスが移る",
      "初期値で `fullWidth`（親の幅いっぱい）にしている",
    ],
    demos: [{ title: "基本", file: "form-text-field/Basic" }],
    props: [
      { name: "control", type: "Control", required: true, description: "useForm が返す control" },
      { name: "name", type: "FieldPath", required: true, description: "フォームの項目名" },
      { name: "helperText", type: "ReactNode", description: "エラーがないときに出す補足説明" },
    ],
    propsNote:
      "そのほかの props（label・type・select・multiline・slotProps など）は TextField にそのまま渡す。value・onChange・error は渡せない（自動で決まる）。",
  },
  {
    slug: "confirm-dialog",
    name: "ConfirmDialog",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    description: "「本当に実行しますか？」の確認ダイアログ。削除など、取り消せない操作の前に使う。",
    points: [
      "「どれを消すか」を `useState<Item | null>` で持ち、`open={target !== null}` で開くのが定番",
      "ボタンの中で開閉を持つなら `useState(false)` だけでよい（library の DeleteBookButton）",
      "Esc・背景のクリックはキャンセルと同じ扱い（onCancel）",
      "削除ではない確認（返却など）は `danger={false}` で実行ボタンを青にする",
    ],
    demos: [{ title: "削除の確認", file: "confirm-dialog/Delete" }],
    props: [
      openProp,
      { name: "title", type: "string", required: true, description: "見出し" },
      { name: "message", type: "string", required: true, description: "本文" },
      { name: "confirmLabel", type: "string", default: '"削除"', description: "実行ボタンの文言" },
      { name: "danger", type: "boolean", default: "true", description: "実行ボタンを赤にする" },
      { name: "loading", type: "boolean", default: "false", description: "実行ボタンを処理中にする" },
      { name: "onConfirm", type: "() => void", required: true, description: "実行ボタンで呼ばれる" },
      { name: "onCancel", type: "() => void", required: true, description: "キャンセル・Esc・背景のクリックで呼ばれる" },
    ],
  },
  {
    slug: "dialog-form",
    name: "DialogForm",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    imports: ["DialogForm", "useFormDialog"],
    description:
      "ダイアログ（モーダル）の中に置くフォームの枠。見出し・入力欄・キャンセル／送信ボタンをそろえる。開閉は useFormDialog で持つ。",
    points: [
      "`<Dialog>` の中に「useForm を持つ部品」を置き、その部品の中で `<DialogForm>` を返す。Dialog は閉じると中身を消すので、開くたびに defaultValues から始まる（`reset()` が要らない）",
      "`onSubmit` には `handleSubmit(onSubmit)` をそのまま渡す。送信ボタンは type=\"submit\" なので Enter でも送信できる",
      "`useFormDialog<User>()` が `open`・`target`・`openNew`・`openEdit(user)`・`close` を返す。target が undefined なら追加、値があれば編集",
      "ダイアログはページに 1つだけ置き、追加ボタンは `dialog.openNew`、カードや表の編集ボタンは `() => dialog.openEdit(user)` を呼ぶ",
      "初期値は `toFormInput(user?)` のような関数にすると、追加（空）と編集（今の値）で同じフォームを使い回せる",
      "閉じるときは open だけを false にし、target は残す（閉じるアニメーションの間に見出しが変わって見えないように）",
    ],
    demos: [
      { title: "追加と編集で同じフォームを使い回す", file: "patterns/edit-dialog/Basic" },
      { title: "追加だけ（0件のときの案内つき）", file: "patterns/add-dialog/Basic" },
    ],
    props: [
      { name: "title", type: "string", required: true, description: "見出し（「ユーザーを追加」など）" },
      { name: "submitLabel", type: "string", default: '"保存"', description: "送信ボタンの文言" },
      { name: "onSubmit", type: "FormEventHandler", required: true, description: "handleSubmit(onSubmit) をそのまま渡す" },
      { name: "onCancel", type: "() => void", required: true, description: "キャンセルボタンで呼ばれる（ダイアログを閉じる）" },
      { name: "submitting", type: "boolean", default: "false", description: "送信ボタンを処理中にして押せなくする" },
      childrenProp,
      { name: "useFormDialog<T>()", type: "{ open, target?, openNew, openEdit(item), close }", description: "追加・編集ダイアログの開閉と「どれを編集中か」を持つフック" },
    ],
  },
  {
    slug: "data-table",
    name: "DataTable",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    imports: ["DataTable", "type DataTableColumn"],
    description:
      "列の定義を渡すだけで作れる表。チェックボックスで選択・一括操作の帯・行の編集／削除ボタン・並び替え・ページ送りを、props を渡したときだけ出す。",
    points: [
      "列は `{ key, label, render: (row) => …, sortValue?, align? }` の配列で書く。コンポーネントの外に置くと描画のたびに作り直さない",
      "`selectedIds` と `onSelectedIdsChange` を渡すと、先頭にチェックボックスの列が出る。選択中の id は親が `useState<string[]>([])` で持つ",
      "見出しのチェックボックスは「rows のすべて」を選ぶ。一部だけ選んでいると `indeterminate`（−）になる",
      "1件以上選ぶと上に「n件選択中」の帯が出て、`selectionActions={(ids) => …}` のボタンが並ぶ（一括削除など）",
      "`rowActions={(row) => …}` で右端に「操作」の列が出る。編集・削除のアイコンボタンを置く",
      "`sortValue` を渡した列だけ見出しで並び替えられる。`pageSize` を渡すとページ送りが出る",
      "rows は `id: string` を持つオブジェクトの配列。絞り込みで見えなくなった行は「選択中」に数えない",
    ],
    demos: [
      { title: "表示だけ（列の定義・並び替え）", file: "data-table/Basic" },
      { title: "選択・一括操作・編集／削除ボタン・ページ送り", file: "patterns/selectable-table/Basic" },
    ],
    props: [
      { name: "rows", type: "T[]（T は { id: string } を持つ）", required: true, description: "表示する行" },
      { name: "columns", type: "DataTableColumn<T>[]", required: true, description: "列の定義（key・label・render・sortValue・align・minWidth）" },
      { name: "ariaLabel", type: "string", required: true, description: "表の名前（読み上げ用）" },
      { name: "getRowLabel", type: "(row: T) => string", description: "チェックボックスの読み上げ（「佐藤 を選択」）に使う行の名前" },
      { name: "selectedIds", type: "string[]", description: "選択中の id。onSelectedIdsChange と一緒に渡すとチェックボックスが出る" },
      { name: "onSelectedIdsChange", type: "(ids: string[]) => void", description: "選択が変わったときに呼ばれる" },
      { name: "selectionActions", type: "(selectedIds: string[]) => ReactNode", description: "選択中だけ上に出す操作（一括削除など）" },
      { name: "rowActions", type: "(row: T) => ReactNode", description: "行の右端に出す操作（編集・削除ボタン）" },
      { name: "defaultSort", type: '{ key: string; order: "asc" | "desc" }', description: "最初に並び替える列と向き" },
      { name: "pageSize", type: "number", description: "1ページの行数。渡すとページ送りが出る" },
    ],
  },
  {
    slug: "notifier",
    name: "Notifier",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    imports: ["Notifier", "notify"],
    description: "notify(\"保存しました\") で画面の下に通知（スナックバー）を出す。通知の中身は Zustand の store に置く。",
    points: [
      "`<Notifier />` をアプリに1つだけ置き（AppProviders）、`notify(\"…\")` をどこからでも呼ぶ",
      "store が Zustand なので、Provider で包まなくてよい。React の外（ふつうの関数）からも呼べる（`useNotifierStore.getState()`）",
      "2つ目の引数で色を選ぶ：`notify(\"失敗しました\", \"error\")`。初期値は \"success\"",
      "Snackbar の `key` に通知の番号を渡し、続けて出しても表示時間が数え直されるようにしている",
      "閉じても文言を残しておく（`open` だけを false にする）。閉じるアニメーションの間に文言が消えて見えないように",
    ],
    demos: [{ title: "通知を出す", file: "notifier/Basic" }],
    props: [
      { name: "notify(message, severity?)", type: '(string, "success" | "info" | "warning" | "error") => void', default: 'severity: "success"', description: "通知を出す。4秒で自動で消える" },
      { name: "<Notifier />", type: "—", description: "通知の表示場所。props はない" },
    ],
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    description: "一覧が0件・見つからないときに、一覧の代わりに表示する案内。",
    points: [
      "`items.length === 0 ? <EmptyState … /> : <Table>…</Table>` のように切り替える",
      "「まだ1件もない」と「条件に合うものがない」で文言と操作を変える（追加ボタン／条件をクリア）",
      "詳細ページで id の本がないとき（削除済み・URL の打ち間違い）にも使う",
    ],
    demos: [{ title: "基本", file: "empty-state/Basic" }],
    props: [
      { name: "title", type: "string", required: true, description: "案内の見出し" },
      { name: "description", type: "string", description: "補足の説明" },
      { name: "action", type: "ReactNode", description: "次に取れる操作（追加ボタンなど）" },
      { name: "icon", type: "ReactNode", description: "上に出すアイコン。省略すると空の箱" },
    ],
  },
  {
    slug: "description-list",
    name: "DescriptionList",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    imports: ["DescriptionList", "type DescriptionItem"],
    description: "「項目名：値」の一覧。詳細ページの情報欄に使う。PC は2列、スマホは項目名の下に値。",
    points: [
      "HTML の `<dl>`・`<dt>`・`<dd>`（説明リスト）で作り、CSS Grid で2列に並べている",
      "値には文字だけでなく、Chip・Rating などの部品も渡せる",
      "メモなど改行を含む値は `multiline: true` で改行をそのまま表示する",
    ],
    demos: [{ title: "詳細ページの情報欄", file: "description-list/Basic" }],
    props: [
      { name: "items", type: "{ term: string; description: ReactNode; multiline?: boolean }[]", required: true, description: "項目の一覧" },
    ],
  },
  {
    slug: "stat-card",
    name: "StatCard",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    description: "集計の数字を大きく見せるカード。ダッシュボードに Grid で並べる。",
    points: [
      "数字は store に保存せず、表示するときに計算して渡す（件数・合計・期限切れの数など）",
      "`color=\"error\"` で数字とアイコンを赤くする。0件のときは color を渡さず目立たせない",
      "`to` を渡すとカード全体がリンクになる（CardActionArea を RouterLink にしている）",
    ],
    demos: [{ title: "ダッシュボードの数字", file: "stat-card/Basic" }],
    props: [
      { name: "label", type: "string", required: true, description: "何の数字か" },
      { name: "value", type: "number | string", required: true, description: "数字" },
      { name: "unit", type: "string", description: "単位（冊・件など）" },
      { name: "icon", type: "ReactNode", description: "右上のアイコン" },
      { name: "color", type: '"primary" | "error" | …', description: "数字とアイコンの色" },
      { name: "caption", type: "string", description: "下に出す補足" },
      { name: "to", type: "string", description: "渡すとカード全体がリンクになる" },
    ],
  },
  {
    slug: "quantity-stepper",
    name: "QuantityStepper",
    category: "自作部品（shared/ui）",
    sharedUi: true,
    description: "「− 3 ＋」の形で数量を増減する。min・max の端ではボタンが押せなくなる。",
    points: [
      "値は持たず、親から `value` を受け取り、新しい値を `onChange` で返す（制御コンポーネント）",
      "在庫数を `max` に渡すと、在庫以上に増やせなくなる（EC のカートなど）",
      "`label` は読み上げ用。「りんごの数量」のように、何の数量かを書く",
    ],
    demos: [{ title: "カートの数量", file: "quantity-stepper/Basic" }],
    props: [
      { name: "label", type: "string", required: true, description: "何の数量か（読み上げ用）" },
      { name: "value", type: "number", required: true, description: "今の数量" },
      { name: "onChange", type: "(value: number) => void", required: true, description: "± を押したときに呼ばれる" },
      { name: "min", type: "number", default: "0", description: "最小値" },
      { name: "max", type: "number", default: "Infinity", description: "最大値（在庫数など）" },
      { name: "disabled", type: "boolean", default: "false", description: "両方のボタンを押せなくする" },
    ],
  },
];
