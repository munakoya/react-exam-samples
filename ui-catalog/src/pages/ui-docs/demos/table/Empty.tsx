import { Table, type TableColumn } from "@/shared/ui";

type Order = { id: string; date: string; total: number };

const columns: TableColumn<Order>[] = [
  { key: "id", header: "注文番号", render: (order) => order.id, rowHeader: true },
  { key: "date", header: "注文日", render: (order) => order.date },
  { key: "total", header: "合計", render: (order) => `¥${order.total}`, align: "right" },
];

// rows が空のときは emptyMessage を表示する
export default function TableEmpty() {
  return (
    <Table
      caption="注文履歴"
      columns={columns}
      rows={[]}
      getRowKey={(order) => order.id}
      emptyMessage="まだ注文がありません"
    />
  );
}
