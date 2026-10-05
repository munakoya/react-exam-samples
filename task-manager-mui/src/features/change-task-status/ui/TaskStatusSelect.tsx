import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { taskStatuses, taskStatusOptions, useTaskStore, type Task } from "@/entities/task";

/**
 * 一覧のカードの中で、ステータスをその場で変えるセレクト ── features/change-task-status/ui
 *
 * フォームではなく、選んだ瞬間に store を更新する（送信ボタンがない操作）。
 * このような「1つの値をすぐ変える」操作に React Hook Form は要らない。
 *
 *   <TaskStatusSelect task={task} />
 */
export const TaskStatusSelect = ({ task }: { task: Task }) => {
  const changeStatus = useTaskStore((state) => state.changeStatus);

  return (
    <TextField
      select
      size="small"
      label="ステータス"
      value={task.status}
      onChange={(event) => {
        // event.target.value は string。選択肢のどれかかを確かめてから渡す
        const status = taskStatuses.find((value) => value === event.target.value);
        if (status) changeStatus(task.id, status);
      }}
      sx={{ minWidth: 120 }}
    >
      {taskStatusOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
