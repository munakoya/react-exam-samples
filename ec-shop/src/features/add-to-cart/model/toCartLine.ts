import type { CartLine } from "@/entities/cart";
import type { Product } from "@/entities/product";

/**
 * 商品 → カートの1行（数量以外） に変換する ── features/add-to-cart/model
 *
 * entities/cart は entities/product を知らない（同じ層は import し合わない）。
 * 2つをつなぐ変換は、両方を使える features に置く。
 */
export const toCartLine = (product: Product): Omit<CartLine, "quantity"> => ({
  productId: product.id,
  name: product.name,
  emoji: product.emoji,
  price: product.price,
  stock: product.stock,
});
