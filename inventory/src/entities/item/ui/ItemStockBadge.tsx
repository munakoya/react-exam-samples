import { Badge } from "@/shared/ui";
import { getStockStatus, stockStatusLabels, type Item, type StockStatus } from "../model/item";

/**
 * 在庫の状態（在庫あり / 在庫少 / 在庫切れ）のバッジ ── entities/item/ui
 *
 * entities/ui には、操作を持たない「商品の見せ方」を置く。
 * 判定（getStockStatus）を entities にまとめておくと、一覧・詳細・絞り込みのどこでも同じ結果になる。
 *
 *   <ItemStockBadge item={item} />
 */

const tones = {
  out: "danger",
  low: "warning",
  ok: "success",
} as const satisfies Record<StockStatus, string>;

export const ItemStockBadge = ({ item }: { item: Item }) => {
  const status = getStockStatus(item);
  return <Badge tone={tones[status]}>{stockStatusLabels[status]}</Badge>;
};
