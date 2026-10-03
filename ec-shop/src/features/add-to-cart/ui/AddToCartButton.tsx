import { useCartStore } from "@/entities/cart";
import type { Product } from "@/entities/product";
import { Button, useToast } from "@/shared/ui";
import { toCartLine } from "../model/toCartLine";

/**
 * 「カートに入れる」ボタン（1個ずつ入れる） ── features/add-to-cart/ui
 *
 * 一覧のカードで使う。売り切れ・在庫数までカートに入っているときは押せない。
 *
 *   <AddToCartButton product={product} />
 */
export const AddToCartButton = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  // この商品がカートに何個入っているか（数値を返すセレクター）
  const inCart = useCartStore(
    (state) => state.lines.find((line) => line.productId === product.id)?.quantity ?? 0,
  );
  const toast = useToast();

  const soldOut = product.stock === 0;
  const reachedLimit = inCart >= product.stock;

  return (
    <Button
      size="sm"
      fullWidth
      variant={soldOut ? "secondary" : "primary"}
      disabled={soldOut || reachedLimit}
      onClick={() => {
        addToCart(toCartLine(product), 1);
        toast.show(`「${product.name}」をカートに入れました`, "success");
      }}
    >
      {soldOut ? "売り切れ" : reachedLimit ? "在庫の上限です" : "カートに入れる"}
    </Button>
  );
};
