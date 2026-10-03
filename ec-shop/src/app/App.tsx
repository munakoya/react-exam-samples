import { Navigate, Route, Routes } from "react-router";
import { CartPage } from "@/pages/cart";
import { CheckoutPage } from "@/pages/checkout";
import { NotFoundPage } from "@/pages/not-found";
import { OrderCompletePage } from "@/pages/order-complete";
import { OrderHistoryPage } from "@/pages/order-history";
import { ProductDetailPage } from "@/pages/product-detail";
import { ProductListPage } from "@/pages/product-list";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /                           → /products へ移動
 *   /products                   → 商品一覧（?q=&category=&sort= で絞り込み）
 *   /products/:productId        → 商品詳細
 *   /cart                       → カート
 *   /checkout                   → 購入手続き（カートが空なら /cart へ戻す）
 *   /orders                     → 注文履歴
 *   /orders/:orderId/complete   → 注文完了
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:orderId/complete" element={<OrderCompletePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
