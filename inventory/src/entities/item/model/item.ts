import { z } from "zod";

/**
 * 商品（在庫を管理する対象）の型 ── entities/item/model
 *
 * entities には「扱う対象」そのものの 型・状態（store）・表示 を置く。
 * 型は zod のスキーマから作る（z.infer）。こうすると
 *   - TypeScript の型
 *   - localStorage から読み込んだデータが正しい形かのチェック
 * を1つの定義で済ませられる。
 */

// ---------- カテゴリ（選択肢） ----------

// as const：["food", "daily", "other"] を string[] ではなく、値そのものの型として扱う
export const itemCategories = ["food", "daily", "other"] as const;

// "food" | "daily" | "other"
export type ItemCategory = (typeof itemCategories)[number];

// 画面に出す日本語。Record<ItemCategory, string> にすると、カテゴリを増やしたときに書き忘れを型エラーで気付ける
export const itemCategoryLabels: Record<ItemCategory, string> = {
  food: "食品",
  daily: "日用品",
  other: "その他",
};

// SelectField・SegmentedControl に渡す { value, label } の配列
export const itemCategoryOptions = itemCategories.map((value) => ({
  value,
  label: itemCategoryLabels[value],
}));

// ---------- 商品本体 ----------

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(itemCategories),
  quantity: z.number().int().min(0), // 今の在庫数
  minQuantity: z.number().int().min(0), // 発注点：この数以下になったら「在庫少」
  memo: z.string(),
  favorite: z.boolean(),
  createdAt: z.string(), // ISO 形式の日時（"2026-10-03T09:00:00.000Z"）。Date 型は JSON に保存できないので文字列で持つ
  updatedAt: z.string(),
});

export type Item = z.infer<typeof itemSchema>;

/**
 * 登録・更新のときに画面（フォーム）から受け取る値
 *
 * id・日時はアプリ側（store）で付けるので、フォームからは受け取らない。
 * Omit<型, "キー"> で、指定したキーを除いた型を作れる。
 */
export type ItemInput = Omit<Item, "id" | "createdAt" | "updatedAt">;

// ---------- 在庫の状態（商品の知識なので entities に置く） ----------

export type StockStatus = "out" | "low" | "ok";

export const stockStatusLabels: Record<StockStatus, string> = {
  out: "在庫切れ",
  low: "在庫少",
  ok: "在庫あり",
};

/** 在庫数と発注点から、在庫の状態を求める */
export const getStockStatus = (item: Item): StockStatus => {
  if (item.quantity === 0) return "out";
  if (item.quantity <= item.minQuantity) return "low";
  return "ok";
};
