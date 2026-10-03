import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { stockMovementSchema, type StockMovement, type StockMovementInput } from "./stockMovement";

/**
 * 入出庫の履歴の store ── entities/stock-movement/model
 *
 * 商品の store（entities/item）とは別に作り、localStorage のキーも分ける。
 * entities 同士は import し合わないので、「在庫数を変えて、履歴も残す」のように
 * 2つの store をまとめて動かす処理は features（features/adjust-stock）に書く。
 */

type StockMovementStore = {
  movements: StockMovement[];
  addMovement: (input: StockMovementInput) => void;
  /** 商品を削除したときに、その商品の履歴もまとめて消す */
  removeMovementsByItem: (itemId: string) => void;
};

export const useStockMovementStore = create<StockMovementStore>()(
  persist(
    (set) => ({
      movements: [],

      addMovement: (input) => {
        const movement: StockMovement = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ movements: [movement, ...state.movements] })); // 新しい順
      },

      removeMovementsByItem: (itemId) =>
        set((state) => ({
          movements: state.movements.filter((movement) => movement.itemId !== itemId),
        })),
    }),
    {
      name: storageKey("stock-movements"), // 商品とは別のキー
      partialize: (state) => ({ movements: state.movements }),
      merge: mergeWithSchema(z.object({ movements: z.array(stockMovementSchema) })),
    },
  ),
);
