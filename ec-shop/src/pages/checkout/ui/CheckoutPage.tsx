import { Navigate } from "react-router";
import { useCartStore } from "@/entities/cart";
import { CheckoutForm } from "@/features/checkout";
import { Container, PageHeader, Stack } from "@/shared/ui";
import { CartSummary } from "@/widgets/cart-summary";
import styles from "./CheckoutPage.module.css";

/**
 * 購入手続きページ（/checkout） ── pages/checkout/ui
 *
 * カートが空のときに URL を直接開かれても困るので、カートページへ戻す。
 * <Navigate> は描画されると、その場で指定の URL へ移動する（ガードの書き方）。
 */
export const CheckoutPage = () => {
  const lineCount = useCartStore((state) => state.lines.length);

  if (lineCount === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader title="購入手続き" description="お届け先とお支払い方法を入力してください" />
        <div className={styles.layout}>
          <CheckoutForm />
          <div className={styles.summary}>
            <CartSummary />
          </div>
        </div>
      </Stack>
    </Container>
  );
};
