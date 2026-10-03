import { useNavigate, useParams } from "react-router";
import { findProduct, productCategoryLabels } from "@/entities/product";
import { AddToCartForm } from "@/features/add-to-cart";
import { Button, ButtonLink, Container, EmptyState, Stack } from "@/shared/ui";
import { formatPrice } from "@/shared/lib";
import styles from "./ProductDetailPage.module.css";

/**
 * 商品詳細ページ（/products/:productId） ── pages/product-detail/ui
 */
export const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  // 商品は store ではなく定数なので、ただの関数で探せる
  const product = findProduct(productId);

  if (!product) {
    return (
      <Container size="sm">
        <EmptyState
          title="商品が見つかりません"
          action={<ButtonLink to="/products">商品一覧へ</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Stack gap={5}>
        {/* navigate(-1)：ブラウザの「戻る」と同じ。一覧の絞り込み条件（URL）を保ったまま戻れる */}
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← 戻る
          </Button>
        </div>

        <div className={styles.layout}>
          <div className={styles.image} aria-hidden="true">
            {product.emoji}
          </div>

          <Stack gap={4}>
            <p className={styles.category}>{productCategoryLabels[product.category]}</p>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            <p>{product.description}</p>
            <p className={styles.stock}>在庫：{product.stock}個</p>
            <AddToCartForm product={product} />
          </Stack>
        </div>
      </Stack>
    </Container>
  );
};
