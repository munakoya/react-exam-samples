import { taskStatusOptions, useTaskStore, type Task, type TaskStatus } from "@/entities/task";
import { SelectField } from "@/shared/ui";

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
    <SelectField
      label="ステータス"
      options={taskStatusOptions}
      placeholder={false}
      value={task.status}
      onChange={(event) => changeStatus(task.id, event.target.value as TaskStatus)}
    />
  );
};
