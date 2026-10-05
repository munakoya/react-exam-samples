import Chip, { type ChipProps } from "@mui/material/Chip";
import {
  taskPriorityLabels,
  taskStatusLabels,
  type TaskPriority,
  type TaskStatus,
} from "../model/task";

/**
 * ステータス・優先度のラベル（MUI の Chip） ── entities/task/ui
 *
 * 値 → 色 の対応を Record で書いておくと、選択肢を増やしたときに書き忘れを型エラーで気付ける。
 * as const satisfies …：値の型（"success" など）を保ったまま、キーの書き忘れだけをチェックする
 */

const statusColors = {
  todo: "default",
  doing: "info",
  done: "success",
} as const satisfies Record<TaskStatus, ChipProps["color"]>;

const priorityColors = {
  high: "error",
  medium: "warning",
  low: "default",
} as const satisfies Record<TaskPriority, ChipProps["color"]>;

export const TaskStatusChip = ({ status }: { status: TaskStatus }) => (
  <Chip size="small" label={taskStatusLabels[status]} color={statusColors[status]} />
);

export const TaskPriorityChip = ({ priority }: { priority: TaskPriority }) => (
  <Chip
    size="small"
    variant="outlined"
    label={`優先度：${taskPriorityLabels[priority]}`}
    color={priorityColors[priority]}
  />
);
