import { useCartStore } from "@/entities/cart";
import { ButtonLink, Container, EmptyState, PageHeader, Stack } from "@/shared/ui";
import { CartLines } from "@/widgets/cart-lines";
import { CartSummary } from "@/widgets/cart-summary";
import styles from "./CartPage.module.css";

/**
 * カートページ（/cart） ── pages/cart/ui
 *
 *   ┌ カートの中身（CartLines）  ┐┌ 合計（CartSummary）┐
 *   │                          ││ [購入手続きへ]      │
 *   └──────────────────┘└────────────┘
 */
export const CartPage = () => {
  // 0件かどうかだけ分かればよいので、件数（数値）を選ぶ
  const lineCount = useCartStore((state) => state.lines.length);

  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader title="カート" />

        {lineCount === 0 ? (
          <EmptyState
            title="カートは空です"
            action={<ButtonLink to="/products">買い物を続ける</ButtonLink>}
          />
        ) : (
          <div className={styles.layout}>
            <CartLines />
            {/* 合計は div で包んで、スクロールしても画面に残す（sticky） */}
            <div className={styles.summary}>
              <CartSummary
                action={
                  <ButtonLink to="/checkout" fullWidth>
                    購入手続きへ
                  </ButtonLink>
                }
              />
            </div>
          </div>
        )}
      </Stack>
    </Container>
  );
};
