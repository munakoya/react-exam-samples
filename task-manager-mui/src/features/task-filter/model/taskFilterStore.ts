import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { taskStatuses, type TaskStatus } from "@/entities/task";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";

/**
 * 絞り込み・並び替えの設定を持つ store ── features/task-filter/model
 *
 * タスク本体（entities/task）とは別の store にする。
 *   - タスク本体   … アプリのデータ
 *   - 表示の設定   … 見せ方の好み。再読み込みしても前回の設定で開けるように、これも persist で保存する
 * このように「データ」と「画面の設定」を分けておくと、片方だけ消したり、作り直したりしやすい。
 *
 * 一覧ページとボードの両方で同じ設定を使いたいので、useState ではなく store にしている。
 */

export type TaskStatusFilter = "all" | TaskStatus;
export const taskSortKeys = ["dueDate", "priority", "createdAt"] as const;
export type TaskSortKey = (typeof taskSortKeys)[number];

type TaskFilterStore = {
  status: TaskStatusFilter;
  sortKey: TaskSortKey;
  setStatus: (status: TaskStatusFilter) => void;
  setSortKey: (sortKey: TaskSortKey) => void;
};

export const useTaskFilterStore = create<TaskFilterStore>()(
  persist(
    (set) => ({
      status: "all",
      sortKey: "dueDate",
      // 値をそのまま入れ替えるだけなら set({ ... }) でよい（今の state を使わないので関数にしなくてよい）
      setStatus: (status) => set({ status }),
      setSortKey: (sortKey) => set({ sortKey }),
    }),
    {
      name: storageKey("task-filter"), // タスク本体とは別のキーにする
      // storage を省略すると localStorage に保存される
      partialize: (state) => ({ status: state.status, sortKey: state.sortKey }),
      merge: mergeWithSchema(
        z.object({
          status: z.enum(["all", ...taskStatuses]),
          sortKey: z.enum(taskSortKeys),
        }),
      ),
    },
  ),
);
