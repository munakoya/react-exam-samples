import type { ReactNode } from "react";
import { Link } from "react-router";
import { Badge } from "@/shared/ui";
import { formatPrice } from "@/shared/lib";
import { productCategoryLabels, type Product } from "../model/product";
import styles from "./ProductCard.module.css";

/**
 * 商品カード（一覧の1枚） ── entities/product/ui
 *
 * 見せ方だけを持ち、「カートに入れる」などの操作は actions で外から差し込む。
 *
 *   <ProductCard product={product} actions={<AddToCartButton product={product} />} />
 */

type ProductCardProps = {
  product: Product;
  actions?: ReactNode;
};

export const ProductCard = ({ product, actions }: ProductCardProps) => {
  const soldOut = product.stock === 0;

  return (
    <article className={styles.card} data-sold-out={soldOut}>
      {/* 絵文字は飾りなので読み上げない（商品名は下の見出しで伝わる） */}
      <div className={styles.image} aria-hidden="true">
        {product.emoji}
      </div>
      <div className={styles.body}>
        <p className={styles.category}>{productCategoryLabels[product.category]}</p>
        <h3 className={styles.name}>
          <Link to={`/products/${product.id}`} className={styles.link}>
            {product.name}
          </Link>
        </h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        {soldOut ? (
          <Badge tone="danger">売り切れ</Badge>
        ) : product.stock <= 3 ? (
          <Badge tone="warning">残り{product.stock}点</Badge>
        ) : (
          <Badge tone="success">在庫あり</Badge>
        )}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </article>
  );
};
