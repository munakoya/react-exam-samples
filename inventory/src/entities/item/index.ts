// entities/item の窓口（Public API）
//
// 外（features・widgets・pages）からは、このファイル経由で読み込む。
//   import { useItemStore, type Item } from "@/entities/item";
// model/・ui/ の中のファイルを直接 import しない（中の構成を変えても、外に影響しないように）。

export {
  getStockStatus,
  itemCategories,
  itemCategoryLabels,
  itemCategoryOptions,
  itemSchema,
  stockStatusLabels,
  type Item,
  type ItemCategory,
  type ItemInput,
  type StockStatus,
} from "./model/item";
export { useItem, useItemStore } from "./model/itemStore";
export { ItemStockBadge } from "./ui/ItemStockBadge";
