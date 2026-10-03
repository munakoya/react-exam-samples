import { useState } from "react";
import { useCartStore } from "@/entities/cart";
import type { Product } from "@/entities/product";
import { Button, QuantityStepper, Stack, useToast } from "@/shared/ui";
import { toCartLine } from "../model/toCartLine";

/**
 * 数量を選んでカートに入れる ── features/add-to-cart/ui
 *
 * 商品詳細ページで使う。選べる数量の上限は「在庫数 − すでにカートにある数」。
 * 入力欄が1つ（数量）だけで、自由入力でもないので、React Hook Form は使わず useState で持つ。
 *
 *   <AddToCartForm product={product} />
 */
export const AddToCartForm = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const inCart = useCartStore(
    (state) => state.lines.find((line) => line.productId === product.id)?.quantity ?? 0,
  );
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);

  const remaining = product.stock - inCart; // あと何個入れられるか

  if (product.stock === 0) {
    return <p>申し訳ありません。この商品は売り切れです。</p>;
  }
  if (remaining <= 0) {
    return <p>在庫数（{product.stock}個）まですべてカートに入っています。</p>;
  }

  return (
    <Stack direction="row" gap={3} align="center" wrap>
      <QuantityStepper
        label={`${product.name}の数量`}
        value={Math.min(quantity, remaining)} // カートに入れた後で上限が下がっても、上限を超えて表示しない
        min={1}
        max={remaining}
        onChange={setQuantity}
      />
      <Button
        onClick={() => {
          const amount = Math.min(quantity, remaining);
          addToCart(toCartLine(product), amount);
          toast.show(`「${product.name}」を${amount}個カートに入れました`, "success");
          setQuantity(1);
        }}
      >
        カートに入れる
      </Button>
      {inCart > 0 && <span>（カートに{inCart}個）</span>}
    </Stack>
  );
};
