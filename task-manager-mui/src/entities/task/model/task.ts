import { z } from "zod";

/**
 * タスクの型と、タスクに関する判定 ── entities/task/model
 *
 * 選択肢（ステータス・優先度）は「値の配列」「表示名」「選択肢の配列」の3点セットで用意すると、
 * 型・画面表示・フォーム・絞り込みのすべてで同じものを使い回せる。
 */

// ---------- ステータス ----------

export const taskStatuses = ["todo", "doing", "done"] as const;
export type TaskStatus = (typeof taskStatuses)[number]; // "todo" | "doing" | "done"

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "未着手",
  doing: "進行中",
  done: "完了",
};

export const taskStatusOptions = taskStatuses.map((value) => ({
  value,
  label: taskStatusLabels[value],
}));

// ---------- 優先度 ----------

export const taskPriorities = ["high", "medium", "low"] as const;
export type TaskPriority = (typeof taskPriorities)[number];

export const taskPriorityLabels: Record<TaskPriority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const taskPriorityOptions = taskPriorities.map((value) => ({
  value,
  label: taskPriorityLabels[value],
}));

// ---------- タスク本体 ----------

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
  dueDate: z.string(), // 期限 "YYYY-MM-DD"。期限なしは ""
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

/** 登録・更新でフォームから受け取る値（id・日時は store で付ける） */
export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

// ---------- 判定（タスクの知識なので entities に置く） ----------

/**
 * 期限切れか（完了していない かつ 期限が今日より前）
 *
 * today を引数でもらうと、テストしやすく、一覧の中で何度も「今日」を計算しなくて済む。
 */
export const isOverdue = (task: Task, today: string) =>
  task.status !== "done" && task.dueDate !== "" && task.dueDate < today;
