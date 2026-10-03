import { Badge, Table, type TableColumn } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib";
import { movementTypeLabels, type StockMovement } from "../model/stockMovement";

/**
 * 入出庫の履歴の表 ── entities/stock-movement/ui
 *
 *   <StockMovementTable movements={movementsOfThisItem} />
 */

const columns: TableColumn<StockMovement>[] = [
  { key: "createdAt", header: "日時", render: (m) => formatDateTime(m.createdAt) },
  {
    key: "type",
    header: "種類",
    render: (m) => (
      <Badge tone={m.type === "in" ? "info" : "warning"}>{movementTypeLabels[m.type]}</Badge>
    ),
  },
  {
    key: "quantity",
    header: "数量",
    align: "right",
    // 入庫は +、出庫は − を付けて、増えたのか減ったのかを分かりやすくする
    render: (m) => `${m.type === "in" ? "+" : "−"}${m.quantity}`,
  },
  { key: "note", header: "メモ", render: (m) => m.note || "—" },
];

export const StockMovementTable = ({ movements }: { movements: StockMovement[] }) => {
  return (
    <Table
      caption="入出庫の履歴"
      columns={columns}
      rows={movements}
      getRowKey={(m) => m.id}
      emptyMessage="入出庫の履歴はまだありません"
    />
  );
};
