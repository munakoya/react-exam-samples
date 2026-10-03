import { z } from "zod";

/**
 * カートの1行（どの商品を何個）と、合計の計算 ── entities/cart/model
 *
 * 商品名・価格は、カートに入れた時点の値をコピーして持つ（スナップショット）。
 *   - entities 同士は import し合わないので、cart から product を探しに行けない
 *   - 実際の EC でも「カートに入れた後で価格が変わった」などを扱うため、コピーを持つことが多い
 */

export const cartLineSchema = z.object({
  productId: z.string(),
  name: z.string(),
  emoji: z.string(),
  price: z.number(),
  stock: z.number(), // 入れられる上限
  quantity: z.number().int().min(1),
});

export type CartLine = z.infer<typeof cartLineSchema>;

// ---------- 合計の計算 ----------

/** この金額以上で送料無料 */
export const FREE_SHIPPING_THRESHOLD = 3000;
export const SHIPPING_FEE = 500;

/**
 * 合計を計算する（React に関係しない、ただの関数）
 *
 * 合計は lines から毎回計算できるので、store に保存しない。
 * 保存すると、数量を変えたときに合計の更新し忘れが起きる。
 */
export const calcCartTotals = (lines: CartLine[]) => {
  // reduce：配列を1つの値（合計）にまとめる。第2引数の 0 が最初の値
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return {
    itemCount,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    /** 送料無料まであといくらか（0 なら達成済み） */
    remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
};

export type CartTotals = ReturnType<typeof calcCartTotals>;
