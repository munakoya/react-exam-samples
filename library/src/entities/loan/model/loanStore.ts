import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { isActiveLoan, loanSchema, type Loan, type LoanInput } from "./loan";

/**
 * 貸出の記録の store ── entities/loan/model
 *
 * 本の store（entities/book）とは別に作り、localStorage のキーも分ける。
 * 「本を消したら貸出の記録も消す」のように、2つの store をまとめて動かす処理は features に書く
 * （features/delete-book）。
 */

type LoanStore = {
  loans: Loan[];
  addLoan: (input: LoanInput) => void;
  /** 返却する（返却日を記録する） */
  returnLoan: (id: string, returnedAt: string) => void;
  /** 本を削除したときに、その本の貸出の記録をまとめて消す */
  removeLoansByBook: (bookId: string) => void;
  /** まとめて追加する（サンプルデータの読み込み用） */
  addLoans: (loans: Loan[]) => void;
};

export const useLoanStore = create<LoanStore>()(
  persist(
    (set) => ({
      loans: [],

      addLoan: (input) => {
        const loan: Loan = { ...input, id: crypto.randomUUID(), returnedAt: "" };
        set((state) => ({ loans: [loan, ...state.loans] })); // 新しい順
      },

      returnLoan: (id, returnedAt) =>
        set((state) => ({
          loans: state.loans.map((loan) => (loan.id === id ? { ...loan, returnedAt } : loan)),
        })),

      removeLoansByBook: (bookId) =>
        set((state) => ({ loans: state.loans.filter((loan) => loan.bookId !== bookId) })),

      addLoans: (loans) => set((state) => ({ loans: [...loans, ...state.loans] })),
    }),
    {
      name: storageKey("loans"), // 本とは別のキー
      partialize: (state) => ({ loans: state.loans }),
      merge: mergeWithSchema(z.object({ loans: z.array(loanSchema) })),
    },
  ),
);

/**
 * ある本の「今の貸出」（返却されていないもの）を取り出す。貸出中でなければ undefined
 *
 * find は配列の中の同じオブジェクトを返すので、セレクターで使ってよい。
 */
export const useCurrentLoan = (bookId: string | undefined) =>
  useLoanStore((state) => state.loans.find((loan) => loan.bookId === bookId && isActiveLoan(loan)));
