import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { orderSchema, type Order, type OrderInput } from "./order";

/**
 * 注文履歴の store（persist で localStorage に保存） ── entities/order/model
 */

type OrderStore = {
  orders: Order[];
  /** 注文を記録して、作った注文を返す（完了ページへ移動するときに id を使う） */
  addOrder: (input: OrderInput) => Order;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (input) => {
        const order: Order = {
          ...input,
          id: crypto.randomUUID(),
          // get()：action の中で今の state を読む。何件目の注文かで番号を作る（"A0001" の形）
          orderNumber: `A${String(get().orders.length + 1).padStart(4, "0")}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },
    }),
    {
      name: storageKey("orders"),
      partialize: (state) => ({ orders: state.orders }),
      merge: mergeWithSchema(z.object({ orders: z.array(orderSchema) })),
    },
  ),
);

/** id から注文を1件取り出す */
export const useOrder = (id: string | undefined) =>
  useOrderStore((state) => state.orders.find((order) => order.id === id));
