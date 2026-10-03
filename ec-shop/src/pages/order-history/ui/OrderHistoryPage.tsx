import { OrderLinesTable, paymentMethodLabels, useOrderStore } from "@/entities/order";
import { Accordion, ButtonLink, Container, EmptyState, PageHeader, Stack } from "@/shared/ui";
import { formatDateTime, formatPrice } from "@/shared/lib";

/**
 * 注文履歴ページ（/orders） ── pages/order-history/ui
 *
 * 注文ごとに Accordion（開閉）にして、見出しに「番号・日時・合計」、中に明細を出す。
 */
export const OrderHistoryPage = () => {
  const orders = useOrderStore((state) => state.orders);

  return (
    <Container>
      <Stack gap={5}>
        <PageHeader title="注文履歴" />
        {orders.length === 0 ? (
          <EmptyState
            title="まだ注文はありません"
            action={<ButtonLink to="/products">商品を見る</ButtonLink>}
          />
        ) : (
          <Accordion
            items={orders.map((order, index) => ({
              title: `${order.orderNumber}　${formatDateTime(order.createdAt)}　${formatPrice(order.total)}`,
              content: (
                <Stack gap={3}>
                  <p>
                    お届け先：〒{order.customer.postalCode} {order.customer.address}（
                    {order.customer.name} 様）
                  </p>
                  <p>お支払い方法：{paymentMethodLabels[order.paymentMethod]}</p>
                  <OrderLinesTable order={order} />
                </Stack>
              ),
              defaultOpen: index === 0, // いちばん新しい注文だけ開いておく
            }))}
          />
        )}
      </Stack>
    </Container>
  );
};
