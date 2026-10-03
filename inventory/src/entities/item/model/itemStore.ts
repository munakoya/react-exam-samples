import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { itemSchema, type Item, type ItemInput } from "./item";

/**
 * Item の一覧を持つ store（Zustand ＋ persist ミドルウェア）
 *
 * store ＝ 「共有する値（state）」と「その値の変え方（action）」をまとめたもの。
 * どのコンポーネントから useItemStore を呼んでも、同じ一覧を見る。
 *
 * persist ミドルウェアを挟むと、
 *   - state が変わるたびに localStorage へ自動で保存し
 *   - ページを開いたときに localStorage から自動で読み込む（rehydrate）
 * ので、保存・読み込みのコードを自分で書かなくてよい。
 *
 * ---------- 画面での使い方 ----------
 *   // 値も関数も「セレクター」で必要なものだけ選ぶ（選んだ値が変わったときだけ再描画される）
 *   const items = useItemStore((state) => state.items);
 *   const addItem = useItemStore((state) => state.addItem);
 *
 *   // ⚠ セレクターの中で filter / map をしない。
 *   //    毎回新しい配列が返り「値が変わった」と判断され、無限に再描画される。
 *   //    絞り込みは、選んだ items に対して画面側で行う。
 *   const items = useItemStore((state) => state.items.filter(...)); // NG
 *
 *   // 複数の値をまとめて選ぶなら useShallow（"zustand/react/shallow"）で包む
 *   const { items, removeItem } = useItemStore(
 *     useShallow((state) => ({ items: state.items, removeItem: state.removeItem })),
 *   );
 *
 * ---------- 保存しない store にしたいとき ----------
 *   create<ItemStore>()((set) => ({ ... })) のように persist(...) を外すだけ。
 */

// ---------- 型 ----------

/** 共有する値 */
type ItemState = {
  items: Item[];
};

/** 値の変え方 */
type ItemActions = {
  /** 追加して、作った Item を返す（追加後に詳細ページへ移動するときなどに id を使える） */
  addItem: (input: ItemInput) => Item;
  updateItem: (id: string, input: ItemInput) => void;
  removeItem: (id: string) => void;
  /** 在庫数を増減する（入庫ならプラス、出庫ならマイナスの delta を渡す） */
  adjustQuantity: (id: string, delta: number) => void;
};

type ItemStore = ItemState & ItemActions;

// ---------- store ----------

// TypeScript では create<型>()(...) と、() を2回書く（ミドルウェアの型を正しく推論させるため）
export const useItemStore = create<ItemStore>()(
  persist(
    (set) => ({
      // ----- state の初期値（localStorage に何もないときに使われる） -----
      items: [],

      // ----- action -----
      // set((state) => ({ ... })) で、今の state から次の state を作る。
      // 元の配列・オブジェクトは書き換えず、新しく作って返す（イミュータブルに更新）。
      // 返したキーだけが上書きされる（他のキーはそのまま残る）。

      addItem: (input) => {
        const now = new Date().toISOString();
        const newItem: Item = {
          ...input,
          id: crypto.randomUUID(), // 重複しない id をブラウザに作ってもらう
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ items: [newItem, ...state.items] })); // 先頭に追加（新しい順）
        return newItem;
      },

      updateItem: (id, input) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...input, updatedAt: new Date().toISOString() } : item,
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      adjustQuantity: (id, delta) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  // 念のため 0 未満にならないようにする（出庫数のチェックはフォーム側で済ませている）
                  quantity: Math.max(0, item.quantity + delta),
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),
    }),

    // ----- persist の設定 -----
    {
      // localStorage のキー。アプリ内で store ごとに重複しない名前にする
      name: storageKey("items"),

      // 保存先。省略しても localStorage になるが、明示しておく（sessionStorage にも変えられる）
      storage: createJSONStorage(() => localStorage),

      // 保存する値だけを選ぶ。関数（action）は JSON にできないので、state の値だけを返す
      partialize: (state) => ({ items: state.items }),

      // 保存する形を変えたら数字を上げる。数字が違う古いデータは migrate で変換する（なければ使われない）
      version: 1,

      /*
       * localStorage から読み込んだ値のチェック。
       * persist は読み込んだ値をチェックせずにそのまま使うので、形が崩れていると画面が壊れる。
       * zod でチェックし、正しい形のときだけ使う（中身は shared/lib/persist.ts）。
       * スキーマは partialize で保存している形（{ items }）と同じにする。
       */
      merge: mergeWithSchema(z.object({ items: z.array(itemSchema) })),
    },
  ),
);

// ---------- よく使う選び方をフックにしておく ----------

/**
 * id から Item を1件取り出す（見つからなければ undefined）
 *
 *   const item = useItem(itemId);
 *
 * find は配列の中の「同じオブジェクト」を返すので、セレクターで使っても無限再描画にならない。
 */
export const useItem = (id: string | undefined) =>
  useItemStore((state) => state.items.find((item) => item.id === id));
