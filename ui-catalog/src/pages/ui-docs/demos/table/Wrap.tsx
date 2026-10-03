import { Table, type TableColumn } from "@/shared/ui";

type Review = { id: string; title: string; author: string; comment: string };

const reviews: Review[] = [
  {
    id: "1",
    title: "リーダブルコード",
    author: "D. Boswell",
    comment: "名前の付け方・コメントの書き方がまとまっている。何度も読み返したい一冊。",
  },
  { id: "2", title: "達人プログラマー", author: "D. Thomas", comment: "考え方の本。" },
];

// セルは折り返さない（狭い画面では横スクロール）のが初期設定。
// 長い文章の列だけ wrap: true で折り返す
const columns: TableColumn<Review>[] = [
  { key: "title", header: "タイトル", render: (r) => r.title, rowHeader: true },
  { key: "author", header: "著者", render: (r) => r.author },
  { key: "comment", header: "感想", render: (r) => r.comment, wrap: true },
];

export default function TableWrap() {
  return <Table caption="レビュー" columns={columns} rows={reviews} getRowKey={(r) => r.id} />;
}
