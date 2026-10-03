import { z } from "zod";
import { movementTypes } from "@/entities/stock-movement";

/**
 * 入出庫フォームの入力チェック ── features/adjust-stock/model
 *
 * 「出庫数は今の在庫数まで」というチェックは、商品ごとに上限が違う。
 * そこで、今の在庫数を受け取ってスキーマを作る関数（スキーマの工場）にしている。
 *
 *   const schema = createAdjustStockSchema(item.quantity);
 */
export const createAdjustStockSchema = (currentQuantity: number) =>
  z
    .object({
      type: z.enum(movementTypes),
      quantity: z
        .number({ error: "数量を入力してください" })
        .int("整数で入力してください")
        .min(1, "1以上で入力してください"),
      note: z.string().trim().max(100, "100文字以内で入力してください"),
    })
    /*
     * refine：複数の項目を見比べるチェック（ここでは type と quantity）。
     * 各項目のチェックがすべて通った後に動く。
     * path でエラーを出す項目を指定すると、errors.quantity.message に入る。
     */
    .refine((values) => values.type === "in" || values.quantity <= currentQuantity, {
      error: `出庫できるのは今の在庫数（${currentQuantity}）までです`,
      path: ["quantity"],
    });

export type AdjustStockValues = z.output<ReturnType<typeof createAdjustStockSchema>>;
