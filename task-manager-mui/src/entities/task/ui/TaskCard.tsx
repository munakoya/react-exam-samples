import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { formatDate } from "@/shared/lib";
import { isOverdue, type Task } from "../model/task";
import { TaskPriorityChip, TaskStatusChip } from "./TaskChips";

/**
 * タスク1件の表示（MUI の Card） ── entities/task/ui
 *
 * entities の UI は「見せ方」だけを持ち、操作（ボタン）は持たない。
 * 操作は外から actions で差し込む。一覧とボードで、違うボタンを付けて使い回せる。
 *
 *   <TaskCard task={task} today={today} actions={<DeleteTaskButton task={task} />} />
 */

type TaskCardProps = {
  task: Task;
  /** 期限切れの判定に使う今日の日付（"YYYY-MM-DD"） */
  today: string;
  /** true ならステータスのラベルを出さない（ボードは列でステータスが分かるため） */
  hideStatus?: boolean;
  /** 下部に置くボタンなど */
  actions?: ReactNode;
};

export const TaskCard = ({ task, today, hideStatus = false, actions }: TaskCardProps) => {
  const overdue = isOverdue(task, today);
  const done = task.status === "done";

  return (
    <Card
      component="article"
      sx={{
        // 完了なら薄く、期限切れなら左に赤い線（状態ごとの見た目は sx の中で分ける）
        opacity: done ? 0.6 : 1,
        borderLeft: overdue ? 4 : undefined,
        borderLeftColor: overdue ? "error.main" : undefined,
      }}
    >
      <CardContent sx={{ pb: actions ? 1 : undefined }}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center", mb: 1 }}>
          {/* 完了は取り消し線。component="h3"：一覧の中の見出し */}
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{ fontWeight: 700, mr: "auto", textDecoration: done ? "line-through" : "none", overflowWrap: "anywhere" }}
          >
            {task.title}
          </Typography>
          {!hideStatus && <TaskStatusChip status={task.status} />}
          <TaskPriorityChip priority={task.priority} />
        </Stack>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="body2" color={overdue ? "error" : "text.secondary"}>
            期限：{task.dueDate ? formatDate(task.dueDate) : "なし"}
          </Typography>
          {overdue && <Chip size="small" color="error" label="期限切れ" />}
        </Stack>
      </CardContent>

      {actions && (
        <CardActions sx={{ flexWrap: "wrap", gap: 1, px: 2, pb: 2 }} disableSpacing>
          {actions}
        </CardActions>
      )}
    </Card>
  );
};
