/**
 * 商品の型と商品データ ── entities/product/model
 *
 * 商品は「お店が決めるデータ」で、画面から追加・変更しない。
 * なので store にも localStorage にも入れず、ただの定数の配列として持つ（マスタデータ）。
 * API がある問題なら、ここを fetch で取ってくる処理に置き換える。
 */

export const productCategories = ["fruit", "vegetable", "drink", "sweets"] as const;
export type ProductCategory = (typeof productCategories)[number];

export const productCategoryLabels: Record<ProductCategory, string> = {
  fruit: "果物",
  vegetable: "野菜",
  drink: "飲み物",
  sweets: "お菓子",
};

export const productCategoryOptions = productCategories.map((value) => ({
  value,
  label: productCategoryLabels[value],
}));

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // 税込価格（円）
  stock: number; // 在庫数。カートに入れられる上限
  emoji: string; // 画像の代わりに表示する絵文字
  description: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "りんご",
    category: "fruit",
    price: 180,
    stock: 10,
    emoji: "🍎",
    description: "シャキッとした食感の、甘酸っぱいりんご。",
  },
  {
    id: "p2",
    name: "バナナ",
    category: "fruit",
    price: 120,
    stock: 3,
    emoji: "🍌",
    description: "朝食にぴったりの完熟バナナ。",
  },
  {
    id: "p3",
    name: "ぶどう",
    category: "fruit",
    price: 480,
    stock: 0,
    emoji: "🍇",
    description: "粒が大きく、皮ごと食べられるぶどう。",
  },
  {
    id: "p4",
    name: "にんじん",
    category: "vegetable",
    price: 90,
    stock: 20,
    emoji: "🥕",
    description: "甘みが強く、サラダにも使えるにんじん。",
  },
  {
    id: "p5",
    name: "ブロッコリー",
    category: "vegetable",
    price: 160,
    stock: 8,
    emoji: "🥦",
    description: "茹でても色鮮やかなブロッコリー。",
  },
  {
    id: "p6",
    name: "緑茶",
    category: "drink",
    price: 150,
    stock: 12,
    emoji: "🍵",
    description: "すっきりとした味わいの緑茶。",
  },
  {
    id: "p7",
    name: "コーヒー豆",
    category: "drink",
    price: 980,
    stock: 5,
    emoji: "☕",
    description: "深煎りでコクのあるコーヒー豆 200g。",
  },
  {
    id: "p8",
    name: "クッキー",
    category: "sweets",
    price: 260,
    stock: 6,
    emoji: "🍪",
    description: "バターたっぷりのサクサククッキー。",
  },
  {
    id: "p9",
    name: "ショートケーキ",
    category: "sweets",
    price: 420,
    stock: 2,
    emoji: "🍰",
    description: "いちごをのせた定番のショートケーキ。",
  },
];

/** id から商品を探す（見つからなければ undefined） */
export const findProduct = (id: string | undefined) =>
  products.find((product) => product.id === id);
