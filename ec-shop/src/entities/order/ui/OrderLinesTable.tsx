import { Table, type TableColumn } from "@/shared/ui";
import { formatPrice } from "@/shared/lib";
import type { Order, OrderLine } from "../model/order";
import styles from "./OrderLinesTable.module.css";

/**
 * 注文の明細と合計の表 ── entities/order/ui
 *
 *   <OrderLinesTable order={order} />
 */

const columns: TableColumn<OrderLine>[] = [
  { key: "name", header: "商品", rowHeader: true, render: (line) => `${line.emoji} ${line.name}` },
  { key: "price", header: "単価", align: "right", render: (line) => formatPrice(line.price) },
  { key: "quantity", header: "数量", align: "right", render: (line) => line.quantity },
  {
    key: "subtotal",
    header: "小計",
    align: "right",
    render: (line) => formatPrice(line.price * line.quantity),
  },
];

export const OrderLinesTable = ({ order }: { order: Order }) => {
  return (
    <div className={styles.wrapper}>
      <Table
        caption="注文の明細"
        columns={columns}
        rows={order.lines}
        getRowKey={(line) => line.productId}
      />
      <dl className={styles.totals}>
        <dt>小計</dt>
        <dd>{formatPrice(order.subtotal)}</dd>
        <dt>送料</dt>
        <dd>{order.shippingFee === 0 ? "無料" : formatPrice(order.shippingFee)}</dd>
        <dt className={styles.total}>合計</dt>
        <dd className={styles.total}>{formatPrice(order.total)}</dd>
      </dl>
    </div>
  );
};
