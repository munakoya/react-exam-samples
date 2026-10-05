import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";

/**
 * 月の予算（支出の上限）の store ── entities/budget/model
 *
 * 収支の記録とは別の store・別のキーにする（「データ」と「設定」を分ける）。
 * 0 は「予算を決めていない」。
 */

type BudgetStore = {
  monthlyBudget: number;
  setMonthlyBudget: (amount: number) => void;
};

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      monthlyBudget: 0,
      setMonthlyBudget: (amount) => set({ monthlyBudget: amount }), // 今の値を使わないので、オブジェクトを直接渡す
    }),
    {
      name: storageKey("budget"),
      partialize: (state) => ({ monthlyBudget: state.monthlyBudget }),
      merge: mergeWithSchema(z.object({ monthlyBudget: z.number().int().min(0) })),
    },
  ),
);
