import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import { taskStatuses, taskStatusLabels, useTaskStore, type Task } from "@/entities/task";

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
        <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => changeStatus(task.id, prev)}>
          {taskStatusLabels[prev]}
        </Button>
      )}
      {next && (
        <Button size="small" variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => changeStatus(task.id, next)}>
          {taskStatusLabels[next]}
        </Button>
      )}
    </>
  );
};
