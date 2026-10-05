import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { transactionSchema, type Transaction, type TransactionInput } from "./transaction";

/**
 * 収支の記録の store（Zustand ＋ persist） ── entities/transaction/model
 *
 *   const transactions = useTransactionStore((state) => state.transactions);
 *   const addTransaction = useTransactionStore((state) => state.addTransaction);
 *
 * ⚠ セレクターの中で「今月の分」を filter しない（毎回新しい配列になり、無限に再描画される）。
 *   全部を選んでから、画面側で isInMonth で絞り込む。
 */

type TransactionStore = {
  transactions: Transaction[];
  addTransaction: (input: TransactionInput) => void;
  updateTransaction: (id: string, input: TransactionInput) => void;
  removeTransaction: (id: string) => void;
  /** まとめて追加する（サンプルデータ用） */
  addTransactions: (transactions: Transaction[]) => void;
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: [],

      addTransaction: (input) => {
        const transaction: Transaction = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        set((state) => ({ transactions: [transaction, ...state.transactions] }));
      },

      updateTransaction: (id, input) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...input } : t)),
        })),

      removeTransaction: (id) =>
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),

      addTransactions: (transactions) =>
        set((state) => ({ transactions: [...transactions, ...state.transactions] })),
    }),
    {
      name: storageKey("transactions"),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ transactions: state.transactions }),
      version: 1,
      merge: mergeWithSchema(z.object({ transactions: z.array(transactionSchema) })),
    },
  ),
);
