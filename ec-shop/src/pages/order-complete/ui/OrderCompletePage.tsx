import { Link, useParams } from "react-router";
import { OrderLinesTable, paymentMethodLabels, useOrder } from "@/entities/order";
import { Alert, Card, Container, EmptyState, PageHeader, Stack } from "@/shared/ui";

/**
 * 注文完了ページ（/orders/:orderId/complete） ── pages/order-complete/ui
 *
 * 注文の id を URL に入れておくと、再読み込みしても同じ注文を表示できる
 * （navigate の state で渡す方法だと、再読み込みで消える）。
 */
export const OrderCompletePage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = useOrder(orderId);

  if (!order) {
    return (
      <Container size="sm">
        <EmptyState title="注文が見つかりません" action={<Link to="/products">商品一覧へ</Link>} />
      </Container>
    );
  }

  return (
    <Container>
      <Stack gap={5}>
        <PageHeader title="ご注文ありがとうございました" />
        <Alert tone="success" title={`注文番号：${order.orderNumber}`}>
          {order.customer.email} に確認メールを送りました（という想定です）。
        </Alert>
        <Card title="ご注文内容">
          <Stack gap={3}>
            <p>お支払い方法：{paymentMethodLabels[order.paymentMethod]}</p>
            <OrderLinesTable order={order} />
          </Stack>
        </Card>
        <Stack direction="row" gap={4}>
          <Link to="/products">買い物を続ける</Link>
          <Link to="/orders">注文履歴を見る</Link>
        </Stack>
      </Stack>
    </Container>
  );
};
