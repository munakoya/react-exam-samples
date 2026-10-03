// shared/ui の窓口（Public API）
//
// ※ 元は samples/_shared/ui。直すときは _shared/ui を直して `npm run sync-ui` で各サンプルへコピーする
//
// CSS Modules + tokens.css（CSS 変数）で作った部品。MUI などの UI ライブラリは使わない。
// 1部品 = 1フォルダ（.tsx と .module.css）なので、フォルダごとコピーして流用できる。
// （ConfirmDialog は Button・Modal を、ButtonLink は Button の CSS を、Header は Sidebar を使うので、一緒にコピーする）
//
//   import { Button, Stack, TextField } from "@/shared/ui";

// ---------- アプリの枠 ----------
export { AppShell } from "./AppShell/AppShell"; // ヘッダー・サイドバー・メインを並べる枠
export { Header } from "./Header/Header"; // 上のヘッダー（☰・アプリ名・右側の要素）
export { Sidebar, type SidebarGroup, type SidebarNavItem } from "./Sidebar/Sidebar"; // 左のメニュー（狭い幅では開閉）

// ---------- レイアウト ----------
export { Container } from "./Container/Container"; // ページの最大幅・中央寄せ
export { Grid } from "./Grid/Grid"; // カードなどの格子状の並び
export { PageHeader } from "./PageHeader/PageHeader"; // ページの見出し＋ボタン
export { Stack } from "./Stack/Stack"; // 縦・横に並べて間隔をそろえる

// ---------- ナビゲーション ----------
export { Breadcrumb } from "./Breadcrumb/Breadcrumb"; // パンくずリスト
export { ButtonLink } from "./ButtonLink/ButtonLink"; // ボタンの見た目のリンク（ページ移動だけのボタン）
export { Pagination } from "./Pagination/Pagination"; // ページ送り
export { SegmentedControl } from "./SegmentedControl/SegmentedControl"; // つながったボタンで切り替え
export { Tabs } from "./Tabs/Tabs"; // タブ

// ---------- 入力 ----------
export { Button } from "./Button/Button";
export { Checkbox } from "./Checkbox/Checkbox";
export { CheckboxGroup } from "./CheckboxGroup/CheckboxGroup"; // 複数選択
export { IconButton } from "./IconButton/IconButton"; // アイコンだけのボタン
export { ImageField } from "./ImageField/ImageField"; // 画像の選択＋プレビュー
export { QuantityStepper } from "./QuantityStepper/QuantityStepper"; // 数量の ±
export { RadioGroup } from "./RadioGroup/RadioGroup";
export { Rating, RatingField } from "./Rating/Rating"; // 星の評価（表示・入力）
export { SelectField } from "./SelectField/SelectField";
export { Switch } from "./Switch/Switch"; // オン・オフ
export { TextAreaField } from "./TextAreaField/TextAreaField";
export { TextField } from "./TextField/TextField";

// ---------- 表示 ----------
export { Accordion } from "./Accordion/Accordion"; // 開閉する見出し
export { Avatar } from "./Avatar/Avatar"; // ユーザーのアイコン
export { Badge } from "./Badge/Badge"; // 状態のラベル
export { Card } from "./Card/Card";
export { DescriptionList } from "./DescriptionList/DescriptionList"; // 「項目名：値」の一覧（詳細ページ）
export { ProgressBar } from "./ProgressBar/ProgressBar"; // 進み具合のバー
export { Stat } from "./Stat/Stat"; // 集計の数字
export { Table, type TableColumn } from "./Table/Table"; // 表

// ---------- フィードバック ----------
export { Alert } from "./Alert/Alert"; // 成功・エラーのメッセージ
export { EmptyState } from "./EmptyState/EmptyState"; // 0件のときの案内
export { Spinner } from "./Spinner/Spinner"; // 読み込み中
export { useToast } from "./Toast/ToastContext"; // 画面の隅に出る通知を出す
export { ToastProvider } from "./Toast/ToastProvider"; // 通知の置き場所（アプリ全体を包む）

// ---------- ダイアログ ----------
export { ConfirmDialog } from "./ConfirmDialog/ConfirmDialog"; // 削除などの確認
export { Modal } from "./Modal/Modal"; // フォームなどを載せる汎用のモーダル
