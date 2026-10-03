import { Badge } from "@/shared/ui";
import {
  taskPriorityLabels,
  taskStatusLabels,
  type TaskPriority,
  type TaskStatus,
} from "../model/task";

/**
 * ステータス・優先度のバッジ ── entities/task/ui
 *
 * 値 → 色 の対応を Record で書いておくと、選択肢を増やしたときに書き忘れを型エラーで気付ける。
 */

const statusTones = {
  todo: "neutral",
  doing: "info",
  done: "success",
} as const satisfies Record<TaskStatus, string>;

const priorityTones = {
  high: "danger",
  medium: "warning",
  low: "neutral",
} as const satisfies Record<TaskPriority, string>;
// as const satisfies …：値の型（"danger" など）を保ったまま、キーの書き忘れだけをチェックする

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
  <Badge tone={statusTones[status]}>{taskStatusLabels[status]}</Badge>
);

export const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <Badge tone={priorityTones[priority]}>優先度：{taskPriorityLabels[priority]}</Badge>
);
