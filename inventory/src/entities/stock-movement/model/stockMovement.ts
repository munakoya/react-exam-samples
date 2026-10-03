import { z } from "zod";

/**
 * 入出庫の履歴1件の型 ── entities/stock-movement/model
 *
 * 「どの商品が・いつ・何個 入った/出たか」を記録する。
 * 商品とは itemId（商品の id）でつなぐ。商品のデータを丸ごとコピーして持たないのは、
 * 商品名を変えたときに履歴側も直す手間をなくすため（表示するときに itemId で商品を探す）。
 */

export const movementTypes = ["in", "out"] as const;
export type MovementType = (typeof movementTypes)[number];

export const movementTypeLabels: Record<MovementType, string> = {
  in: "入庫",
  out: "出庫",
};

export const movementTypeOptions = movementTypes.map((value) => ({
  value,
  label: movementTypeLabels[value],
}));

export const stockMovementSchema = z.object({
  id: z.string(),
  itemId: z.string(), // どの商品の履歴か
  type: z.enum(movementTypes),
  quantity: z.number().int().min(1),
  note: z.string(),
  createdAt: z.string(),
});

export type StockMovement = z.infer<typeof stockMovementSchema>;
export type StockMovementInput = Omit<StockMovement, "id" | "createdAt">;
