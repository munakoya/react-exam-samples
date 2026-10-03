import { Link } from "react-router";
import { Container, PageHeader, Stack, Table, type TableColumn } from "@/shared/ui";

/**
 * 部品の一覧（/）
 *
 * 部品ごとに「どんなときに使うか」「どのお題で使いそうか」をまとめた表。
 * 試験のお題を見たら、ここで使える部品を探す。
 */

type PartRow = {
  name: string;
  category: string;
  /** カタログのどのページに見本があるか */
  to: string;
  usage: string;
  /** 使いそうなお題 */
  topics: string;
};

const parts: PartRow[] = [
  // ---------- アプリの枠・レイアウト ----------
  {
    name: "AppShell",
    category: "枠",
    to: "/",
    usage: "ヘッダー・サイドバー・メインを並べる",
    topics: "すべて",
  },
  {
    name: "Header",
    category: "枠",
    to: "/",
    usage: "アプリ名・☰・右側の要素（カート・ユーザー名）",
    topics: "すべて",
  },
  {
    name: "Sidebar",
    category: "枠",
    to: "/",
    usage: "ページのメニュー。狭い幅では ☰ で開閉",
    topics: "すべて",
  },
  {
    name: "Container",
    category: "レイアウト",
    to: "/",
    usage: "ページの最大幅（sm / md / lg）と中央寄せ",
    topics: "すべて",
  },
  {
    name: "Stack",
    category: "レイアウト",
    to: "/",
    usage: "縦・横に並べて間隔をそろえる",
    topics: "すべて",
  },
  {
    name: "Grid",
    category: "レイアウト",
    to: "/display",
    usage: "カードを入るだけ並べる",
    topics: "EC・アルバム・蔵書",
  },
  {
    name: "PageHeader",
    category: "レイアウト",
    to: "/",
    usage: "ページの見出し＋右のボタン",
    topics: "すべて",
  },
  // ---------- ナビゲーション ----------
  {
    name: "ButtonLink",
    category: "ナビゲーション",
    to: "/navigation",
    usage: "ボタンの見た目でページを移動",
    topics: "すべて",
  },
  {
    name: "Breadcrumb",
    category: "ナビゲーション",
    to: "/navigation",
    usage: "一覧 › 詳細 › 編集 の道すじ",
    topics: "詳細ページのあるお題",
  },
  {
    name: "Tabs",
    category: "ナビゲーション",
    to: "/navigation",
    usage: "同じ画面の中で内容を切り替え",
    topics: "ユーザ詳細・受講管理",
  },
  {
    name: "SegmentedControl",
    category: "ナビゲーション",
    to: "/navigation",
    usage: "絞り込み（すべて / 未完了 / 完了）",
    topics: "タスク・在庫・注文管理",
  },
  {
    name: "Pagination",
    category: "ナビゲーション",
    to: "/navigation",
    usage: "件数が多い一覧のページ送り",
    topics: "掲示板・蔵書・注文管理",
  },
  // ---------- 入力 ----------
  {
    name: "Button",
    category: "入力",
    to: "/inputs",
    usage: "保存・削除などの処理（loading で二重送信を防ぐ）",
    topics: "すべて",
  },
  {
    name: "IconButton",
    category: "入力",
    to: "/inputs",
    usage: "×・🗑 など記号だけのボタン",
    topics: "すべて",
  },
  {
    name: "TextField",
    category: "入力",
    to: "/inputs",
    usage: "1行の入力（文字・数値・日付・メール）",
    topics: "すべて",
  },
  {
    name: "TextAreaField",
    category: "入力",
    to: "/inputs",
    usage: "複数行の入力（本文・メモ）",
    topics: "掲示板・メモ・タスク",
  },
  {
    name: "SelectField",
    category: "入力",
    to: "/inputs",
    usage: "選択肢から1つ（選択肢が多いとき）",
    topics: "すべて",
  },
  {
    name: "RadioGroup",
    category: "入力",
    to: "/inputs",
    usage: "選択肢から1つ（全部見せたいとき）",
    topics: "EC（支払い方法）・予約",
  },
  {
    name: "Checkbox",
    category: "入力",
    to: "/inputs",
    usage: "1つのオン・オフ（同意・お気に入り）",
    topics: "EC・ユーザ管理",
  },
  {
    name: "CheckboxGroup",
    category: "入力",
    to: "/inputs",
    usage: "選択肢からいくつでも（タグ・科目）",
    topics: "受講管理・蔵書・掲示板",
  },
  {
    name: "Switch",
    category: "入力",
    to: "/inputs",
    usage: "押した瞬間に反映される設定",
    topics: "ユーザ管理（有効/無効）・絞り込み",
  },
  {
    name: "QuantityStepper",
    category: "入力",
    to: "/inputs",
    usage: "数量の ±",
    topics: "EC・在庫・注文管理",
  },
  {
    name: "RatingField",
    category: "入力",
    to: "/inputs",
    usage: "★ で評価を入力",
    topics: "蔵書（レビュー）・EC",
  },
  {
    name: "ImageField",
    category: "入力",
    to: "/inputs",
    usage: "画像を選ぶ・プレビュー（縮小して保存）",
    topics: "アルバム・ユーザ管理",
  },
  // ---------- 表示 ----------
  {
    name: "Card",
    category: "表示",
    to: "/display",
    usage: "見出し・本文・ボタンのまとまり",
    topics: "すべて",
  },
  {
    name: "Table",
    category: "表示",
    to: "/display",
    usage: "一覧表（列の定義＋配列）",
    topics: "在庫・ユーザ・注文・家計簿",
  },
  {
    name: "DescriptionList",
    category: "表示",
    to: "/display",
    usage: "詳細ページの「項目名：値」",
    topics: "詳細ページのあるお題",
  },
  {
    name: "Badge",
    category: "表示",
    to: "/display",
    usage: "状態のラベル（在庫切れ・進行中）",
    topics: "すべて",
  },
  {
    name: "Avatar",
    category: "表示",
    to: "/display",
    usage: "ユーザーのアイコン（画像 or 1文字目）",
    topics: "ユーザ管理・掲示板",
  },
  { name: "Rating", category: "表示", to: "/display", usage: "★ の評価の表示", topics: "蔵書・EC" },
  {
    name: "Stat",
    category: "表示",
    to: "/display",
    usage: "集計の数字（合計・件数）",
    topics: "家計簿・タスク・ダッシュボード",
  },
  {
    name: "ProgressBar",
    category: "表示",
    to: "/display",
    usage: "進み具合・使用率",
    topics: "受講管理・家計簿（予算）・タスク",
  },
  {
    name: "Accordion",
    category: "表示",
    to: "/display",
    usage: "開閉する見出し（FAQ・履歴の明細）",
    topics: "注文管理・EC",
  },
  // ---------- フィードバック・ダイアログ ----------
  {
    name: "Alert",
    category: "フィードバック",
    to: "/feedback",
    usage: "成功・エラーのメッセージ",
    topics: "すべて",
  },
  {
    name: "Toast",
    category: "フィードバック",
    to: "/feedback",
    usage: "画面の隅に数秒出る通知（useToast）",
    topics: "すべて",
  },
  {
    name: "EmptyState",
    category: "フィードバック",
    to: "/feedback",
    usage: "0件・見つからないときの案内",
    topics: "すべて",
  },
  {
    name: "Spinner",
    category: "フィードバック",
    to: "/feedback",
    usage: "読み込み中",
    topics: "API があるお題",
  },
  {
    name: "Modal",
    category: "ダイアログ",
    to: "/feedback",
    usage: "フォームなどを重ねて出す",
    topics: "タスク・在庫（入出庫）",
  },
  {
    name: "ConfirmDialog",
    category: "ダイアログ",
    to: "/feedback",
    usage: "削除などの確認",
    topics: "すべて",
  },
];

const columns: TableColumn<PartRow>[] = [
  { key: "category", header: "分類", render: (row) => row.category },
  {
    key: "name",
    header: "部品",
    rowHeader: true,
    render: (row) => <Link to={row.to}>{row.name}</Link>,
  },
  // 文章の列は wrap: true で折り返す（ほかの列は折り返さず、狭い画面では横スクロール）
  { key: "usage", header: "どんなときに使うか", render: (row) => row.usage, wrap: true },
  { key: "topics", header: "使いそうなお題", render: (row) => row.topics, wrap: true },
];

export const HomePage = () => {
  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader
          title="UI 部品の一覧"
          description={`全${parts.length}部品。import { 部品名 } from "@/shared/ui" で使う`}
        />
        <Table
          caption="UI 部品の一覧"
          columns={columns}
          rows={parts}
          getRowKey={(row) => row.name}
        />
      </Stack>
    </Container>
  );
};
