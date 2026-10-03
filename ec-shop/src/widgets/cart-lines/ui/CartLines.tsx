import { Link } from "react-router";
import { useCartStore } from "@/entities/cart";
import { Button, QuantityStepper } from "@/shared/ui";
import { formatPrice } from "@/shared/lib";
import styles from "./CartLines.module.css";

/**
 * カートの中身の一覧（数量の変更・削除つき） ── widgets/cart-lines/ui
 *
 *   ┌──┬───────────┬─────────┬───────┐
 *   │🍎│ りんご ¥180    │ − 2 ＋  │ ¥360 削除│
 *   └──┴───────────┴─────────┴───────┘
 */
export const CartLines = () => {
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <ul className={styles.list}>
      {lines.map((line) => (
        <li key={line.productId} className={styles.line}>
          <span className={styles.emoji} aria-hidden="true">
            {line.emoji}
          </span>
          <div className={styles.info}>
            <Link to={`/products/${line.productId}`} className={styles.name}>
              {line.name}
            </Link>
            <span className={styles.unitPrice}>{formatPrice(line.price)}</span>
          </div>
          <div className={styles.stepper}>
            <QuantityStepper
              label={`${line.name}の数量`}
              value={line.quantity}
              min={1}
              max={line.stock}
              onChange={(quantity) => setQuantity(line.productId, quantity)}
            />
          </div>
          <span className={styles.subtotal}>{formatPrice(line.price * line.quantity)}</span>
          <div className={styles.remove}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFromCart(line.productId)}
              aria-label={`${line.name}をカートから削除`}
            >
              削除
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
