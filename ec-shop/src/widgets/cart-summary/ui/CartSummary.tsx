import type { ReactNode } from "react";
import { calcCartTotals, FREE_SHIPPING_THRESHOLD, useCartStore } from "@/entities/cart";
import { Card, ProgressBar } from "@/shared/ui";
import { formatPrice } from "@/shared/lib";
import styles from "./CartSummary.module.css";

/**
 * 合計金額のまとめ（カートページ・購入手続きページで共通） ── widgets/cart-summary/ui
 *
 * 合計は store に持たず、lines から毎回計算する（calcCartTotals）。
 *
 *   <CartSummary action={<Button>購入手続きへ</Button>} />
 */
export const CartSummary = ({ action }: { action?: ReactNode }) => {
  const lines = useCartStore((state) => state.lines);
  const totals = calcCartTotals(lines);

  return (
    <Card title="ご注文内容" footer={action}>
      <dl className={styles.totals}>
        <dt>商品（{totals.itemCount}点）</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
        <dt>送料</dt>
        <dd>{totals.shippingFee === 0 ? "無料" : formatPrice(totals.shippingFee)}</dd>
        <dt className={styles.total}>合計</dt>
        <dd className={styles.total}>{formatPrice(totals.total)}</dd>
      </dl>
      {/* 送料無料までの進み具合。達成したら緑にする */}
      <ProgressBar
        label="送料無料まで"
        value={totals.subtotal}
        max={FREE_SHIPPING_THRESHOLD}
        valueText={
          totals.remainingForFreeShipping > 0
            ? `あと ${formatPrice(totals.remainingForFreeShipping)}`
            : "達成！"
        }
        tone={totals.remainingForFreeShipping > 0 ? "primary" : "success"}
      />
    </Card>
  );
};
