import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { taskSchema, type Task, type TaskInput, type TaskStatus } from "./task";

/**
 * タスク一覧の store（Zustand ＋ persist で localStorage に保存）
 *
 * 一覧ページ・ボード・追加モーダルなど、離れた場所から同じタスク一覧を読み書きするので store にする。
 *
 * 画面での使い方（必要なものだけをセレクターで選ぶ）:
 *   const tasks = useTaskStore((state) => state.tasks);
 *   const changeStatus = useTaskStore((state) => state.changeStatus);
 *
 * ⚠ セレクターの中で filter・sort しない（毎回新しい配列になり、無限に再描画される）。
 *   tasks を選んでから、画面側で絞り込む。
 */

type TaskState = {
  tasks: Task[];
};

type TaskActions = {
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  /** ステータスだけを変える（一覧のセレクト・ボードの移動ボタンから） */
  changeStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  /** 完了したタスクをまとめて削除 */
  removeDoneTasks: () => void;
};

// 1件だけ変える処理は、どの action でも「id が一致するものだけ差し替える」の形になる
const updateById = (tasks: Task[], id: string, changes: Partial<Task>) =>
  tasks.map((task) =>
    task.id === id ? { ...task, ...changes, updatedAt: new Date().toISOString() } : task,
  );

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (input) => {
        const now = new Date().toISOString();
        const task: Task = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
        set((state) => ({ tasks: [task, ...state.tasks] }));
      },

      updateTask: (id, input) => set((state) => ({ tasks: updateById(state.tasks, id, input) })),

      changeStatus: (id, status) =>
        set((state) => ({ tasks: updateById(state.tasks, id, { status }) })),

      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),

      removeDoneTasks: () =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.status !== "done") })),
    }),
    {
      name: storageKey("tasks"), // localStorage のキー → "task-manager-mui:tasks"
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }), // action（関数）は保存しない
      version: 1,
      // 読み込んだデータを zod でチェックし、形が崩れていれば使わない
      merge: mergeWithSchema(z.object({ tasks: z.array(taskSchema) })),
    },
  ),
);
