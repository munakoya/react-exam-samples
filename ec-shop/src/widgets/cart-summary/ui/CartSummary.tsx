import type { ReactNode } from "react";
import { calcCartTotals, useCartStore } from "@/entities/cart";
import { Card } from "@/shared/ui";
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
      {/* 送料無料まであと少しなら知らせる */}
      {totals.remainingForFreeShipping > 0 && (
        <p className={styles.note}>
          あと {formatPrice(totals.remainingForFreeShipping)} で送料無料
        </p>
      )}
    </Card>
  );
};
