import type { z } from "zod";

/**
 * Zustand の persist に渡す merge（読み込んだ値のチェック）を作る
 *
 * persist は localStorage から読み込んだ値をチェックせずに、そのまま state に入れる。
 * 手で書き換えた・型を変える前の古いデータが残っている、などで形が崩れていると画面が壊れるので、
 * zod でチェックし、正しい形のときだけ使う。崩れていれば初期値のまま始める。
 *
 * 使い方（partialize で保存している形のスキーマを渡す）:
 *   persist(
 *     (set) => ({ ... }),
 *     {
 *       name: storageKey("items"),
 *       partialize: (state) => ({ items: state.items }),
 *       merge: mergeWithSchema(z.object({ items: z.array(itemSchema) })),
 *     },
 *   )
 */
export const mergeWithSchema =
  <T extends object>(schema: z.ZodType<T>) =>
  <S extends T>(persisted: unknown, current: S): S => {
    // 初めて開いたとき（まだ何も保存されていない）は undefined が来る
    if (persisted === undefined) return current;

    const result = schema.safeParse(persisted);
    if (!result.success) {
      console.warn("保存データの形が正しくないため、初期状態で始めます", result.error);
      return current;
    }
    // current（action を含む今の state）に、読み込んだ値を上書きする
    return { ...current, ...result.data };
  };
