import { Link } from "react-router";
import { useCartCount } from "@/entities/cart";
import styles from "./HeaderCartLink.module.css";

/**
 * ヘッダー右のカートへのリンク（個数のバッジつき） ── widgets/header-cart-link/ui
 *
 * どのページにいても、カートに入れた瞬間に数が変わる。
 * 商品ページとヘッダーという「離れた場所」で同じカートを使う、store の典型的な使いどころ。
 */
export const HeaderCartLink = () => {
  const count = useCartCount();

  return (
    <Link to="/cart" className={styles.link} aria-label={`カート（${count}点）`}>
      🛒 カート
      {count > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {count}
        </span>
      )}
    </Link>
  );
};
