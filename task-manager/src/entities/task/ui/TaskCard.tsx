import type { ReactNode } from "react";
import { Badge } from "@/shared/ui";
import { formatDate } from "@/shared/lib";
import { isOverdue, type Task } from "../model/task";
import { TaskPriorityBadge, TaskStatusBadge } from "./TaskBadges";
import styles from "./TaskCard.module.css";

/**
 * タスク1件の表示 ── entities/task/ui
 *
 * entities の UI は「見せ方」だけを持ち、操作（ボタン）は持たない。
 * 操作は外から actions で差し込む。こうすると一覧とボードで、違うボタンを付けて使い回せる。
 *
 *   <TaskCard task={task} today={today} actions={<DeleteTaskButton task={task} />} />
 */

type TaskCardProps = {
  task: Task;
  /** 期限切れの判定に使う今日の日付（"YYYY-MM-DD"） */
  today: string;
  /** true ならステータスのバッジを出さない（ボードは列でステータスが分かるため） */
  hideStatus?: boolean;
  /** 下部に置くボタンなど */
  actions?: ReactNode;
};

export const TaskCard = ({ task, today, hideStatus = false, actions }: TaskCardProps) => {
  const overdue = isOverdue(task, today);

  return (
    // data-* で状態を CSS に伝える（完了なら薄く、期限切れなら左に赤い線）
    <article className={styles.card} data-done={task.status === "done"} data-overdue={overdue}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div className={styles.badges}>
          {!hideStatus && <TaskStatusBadge status={task.status} />}
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      {task.description && <p className={styles.description}>{task.description}</p>}

      <p className={styles.due}>
        期限：{task.dueDate ? formatDate(task.dueDate) : "なし"}
        {overdue && <Badge tone="danger">期限切れ</Badge>}
      </p>

      {actions && <div className={styles.actions}>{actions}</div>}
    </article>
  );
};
