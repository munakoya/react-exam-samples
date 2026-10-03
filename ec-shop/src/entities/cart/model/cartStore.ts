import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { cartLineSchema, type CartLine } from "./cart";

/**
 * カートの store（persist で localStorage に保存） ── entities/cart/model
 *
 * ヘッダーの件数・商品ページ・カートページ・購入手続きページと、離れた場所で同じカートを使うので store にする。
 * 再読み込みしてもカートの中身が消えないように persist で保存する。
 */

type CartStore = {
  lines: CartLine[];
  /** カートに入れる。同じ商品がすでにあれば数量を足す（在庫数を超えないようにする） */
  addToCart: (line: Omit<CartLine, "quantity">, quantity: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

// 1 〜 在庫数 の範囲に収める
const clamp = (quantity: number, stock: number) => Math.min(Math.max(quantity, 1), stock);

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],

      addToCart: (line, quantity) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          // まだカートにない → 末尾に追加
          if (!existing) {
            return { lines: [...state.lines, { ...line, quantity: clamp(quantity, line.stock) }] };
          }
          // すでにある → 数量を足す（価格などは最新の値で上書き）
          return {
            lines: state.lines.map((l) =>
              l.productId === line.productId
                ? { ...l, ...line, quantity: clamp(l.quantity + quantity, line.stock) }
                : l,
            ),
          };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, quantity: clamp(quantity, l.stock) } : l,
          ),
        })),

      removeFromCart: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      clearCart: () => set({ lines: [] }),
    }),
    {
      name: storageKey("cart"),
      partialize: (state) => ({ lines: state.lines }),
      merge: mergeWithSchema(z.object({ lines: z.array(cartLineSchema) })),
    },
  ),
);

/**
 * カートに入っている合計の個数（ヘッダーのバッジ用）
 *
 * セレクターで「数値」を返すので、個数が変わったときだけ再描画される。
 */
export const useCartCount = () =>
  useCartStore((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0));
