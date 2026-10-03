import { taskStatuses, taskStatusLabels, useTaskStore, type Task } from "@/entities/task";
import { Button } from "@/shared/ui";

/**
 * ボードで、タスクを隣の列（前後のステータス）へ動かすボタン ── features/change-task-status/ui
 *
 *   未着手 ⇄ 進行中 ⇄ 完了
 *
 * 前後のステータスは、taskStatuses の配列の「何番目か」から求める。
 * 端の列では、その方向のボタンを出さない。
 */
export const MoveTaskButtons = ({ task }: { task: Task }) => {
  const changeStatus = useTaskStore((state) => state.changeStatus);

  const index = taskStatuses.indexOf(task.status);
  const prev = taskStatuses[index - 1]; // 範囲外なら undefined
  const next = taskStatuses[index + 1];

  return (
    <>
      {prev && (
        <Button variant="ghost" size="sm" onClick={() => changeStatus(task.id, prev)}>
          ← {taskStatusLabels[prev]}
        </Button>
      )}
      {next && (
        <Button variant="secondary" size="sm" onClick={() => changeStatus(task.id, next)}>
          {taskStatusLabels[next]} →
        </Button>
      )}
    </>
  );
};
