import { useState } from "react";
import type { Task } from "@/entities/task";

/**
 * TaskFormDialog の開閉と「どのタスクを編集中か」を持つフック ── features/task-form/model
 *
 * 一覧ページとボードの両方で同じ state と関数が要るので、カスタムフックにまとめる。
 * （カスタムフックは「処理の再利用」。呼んだページごとに state は別々になる。共有したいなら store）
 *
 *   const dialog = useTaskFormDialog();
 *   <Button onClick={dialog.openNew}>追加</Button>
 *   <TaskList onEdit={dialog.openEdit} />
 *   <TaskFormDialog open={dialog.open} task={dialog.task} onClose={dialog.close} />
 */
export const useTaskFormDialog = () => {
  const [open, setOpen] = useState(false);
  // undefined なら「追加」、Task が入っていれば「編集」
  const [task, setTask] = useState<Task>();

  return {
    open,
    task,
    openNew: () => {
      setTask(undefined);
      setOpen(true);
    },
    openEdit: (target: Task) => {
      setTask(target);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
};
