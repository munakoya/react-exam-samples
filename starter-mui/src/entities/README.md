# entities ── 扱う「もの」（型・選択肢・store・見せ方）

お題に出てくる「もの」（商品・ユーザー・予約…）ごとにフォルダを作る。**操作のボタンは置かない**（features に置く）。

```text
entities/item/
├── model/
│   ├── item.ts          型（zod）・選択肢・判定（期限切れか など）
│   └── itemStore.ts     一覧の store（Zustand ＋ persist）
├── ui/
│   ├── ItemCard.tsx     1件の見せ方（ボタンは actions で受け取る）
│   └── ItemChips.tsx    状態・種類のラベル（Chip）
└── index.ts             外から使うものだけを export する（窓口）
```

- 型は zod のスキーマから作る（`z.infer`）。保存データの読み込みチェックにも同じスキーマを使う
- 選択肢は「値の配列・表示名・`{ value, label }` の配列」の 3 点セット
- store に入れるのは**保存する値だけ**。件数・合計・絞り込み結果は画面で計算する
- 別の entities を import しない（`entities/order` から `entities/item` は NG）。両方使う処理は features へ

完成形の例：[ユーザー管理の entities/user](https://github.com/munakoya/react-exam-samples/tree/main/user-management/src/entities/user)

## model/item.ts（コピーして名前を変える）

```ts
import { z } from "zod";

// ---------- 選択肢（3 点セット） ----------
export const itemCategories = ["food", "daily", "other"] as const;
export type ItemCategory = (typeof itemCategories)[number]; // "food" | "daily" | "other"

export const itemCategoryLabels: Record<ItemCategory, string> = {
  food: "食品",
  daily: "日用品",
  other: "その他",
};

export const itemCategoryOptions = itemCategories.map((value) => ({ value, label: itemCategoryLabels[value] }));

// ---------- 本体 ----------
export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(itemCategories),
  price: z.number(),
  memo: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Item = z.infer<typeof itemSchema>;

/** 登録・更新でフォームから受け取る値（id・日時は store で付ける） */
export type ItemInput = Omit<Item, "id" | "createdAt" | "updatedAt">;
```

## model/itemStore.ts

```ts
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { itemSchema, type Item, type ItemInput } from "./item";

type ItemState = { items: Item[] };

type ItemActions = {
  addItem: (input: ItemInput) => Item;
  updateItem: (id: string, input: ItemInput) => void;
  /** まとめて削除（1件でも配列で渡す） */
  removeItems: (ids: string[]) => void;
};

export const useItemStore = create<ItemState & ItemActions>()(
  persist(
    (set) => ({
      items: [],

      addItem: (input) => {
        const now = new Date().toISOString();
        const item: Item = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
        set((state) => ({ items: [item, ...state.items] }));
        return item; // 登録後に詳細ページへ移動するときに使う
      },

      // id が一致するものだけ差し替える
      updateItem: (id, input) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...input, updatedAt: new Date().toISOString() } : item,
          ),
        })),

      removeItems: (ids) => set((state) => ({ items: state.items.filter((item) => !ids.includes(item.id)) })),
    }),
    {
      name: storageKey("items"), // localStorage のキー → "my-app:items"
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // action（関数）は保存しない
      version: 1,
      merge: mergeWithSchema(z.object({ items: z.array(itemSchema) })), // 読み込んだ値を zod でチェック
    },
  ),
);
```

画面での使い方：

```ts
const items = useItemStore((state) => state.items);            // 一覧
const item = useItemStore((state) => state.items.find((i) => i.id === id)); // 1件（find は OK）
const addItem = useItemStore((state) => state.addItem);         // action
// ⚠ セレクターの中で filter・map した配列を返さない（毎回新しい配列 → 無限に再描画）
```

## ui/ItemCard.tsx（ボタンは actions で受け取る）

```tsx
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { itemCategoryLabels, type Item } from "../model/item";

export const ItemCard = ({ item, actions }: { item: Item; actions?: ReactNode }) => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700 }}>
        {item.name}
      </Typography>
      <Chip size="small" label={itemCategoryLabels[item.category]} />
    </CardContent>
    {actions && <CardActions sx={{ justifyContent: "flex-end" }}>{actions}</CardActions>}
  </Card>
);
```

## index.ts（窓口）

```ts
export { itemCategoryLabels, itemCategoryOptions, itemCategories, itemSchema, type Item, type ItemInput } from "./model/item";
export { useItemStore } from "./model/itemStore";
export { ItemCard } from "./ui/ItemCard";
```
