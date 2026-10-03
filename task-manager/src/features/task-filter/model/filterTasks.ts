import type { Task, TaskPriority } from "@/entities/task";
import type { TaskSortKey, TaskStatusFilter } from "./taskFilterStore";

/**
 * タスクを絞り込み・並び替えする（元の配列は変えない） ── features/task-filter/model
 *
 * React に関係しない「ただの関数」にしておくと、どの画面からも使え、動きも確かめやすい。
 *
 *   const visibleTasks = filterTasks(tasks, status, sortKey);
 */

const priorityRank: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

// sort に渡す比較関数：負の数なら a が前、正の数なら b が前
const compareFns: Record<TaskSortKey, (a: Task, b: Task) => number> = {
  // 期限が近い順。期限なし（""）は最後
  dueDate: (a, b) => {
    if (a.dueDate === b.dueDate) return 0;
    if (a.dueDate === "") return 1;
    if (b.dueDate === "") return -1;
    return a.dueDate.localeCompare(b.dueDate);
  },
  // 優先度が高い順
  priority: (a, b) => priorityRank[a.priority] - priorityRank[b.priority],
  // 新しく作った順（ISO 形式の日時は文字列のまま比べられる）
  createdAt: (a, b) => b.createdAt.localeCompare(a.createdAt),
};

export const sortLabels: Record<TaskSortKey, string> = {
  dueDate: "期限が近い順",
  priority: "優先度が高い順",
  createdAt: "作成が新しい順",
};

export const filterTasks = (tasks: Task[], status: TaskStatusFilter, sortKey: TaskSortKey) =>
  tasks
    .filter((task) => status === "all" || task.status === status)
    // toSorted：並び替えた「新しい配列」を返す。sort() は元の配列（store の state）を書き換えてしまうので使わない
    .toSorted(compareFns[sortKey]);
