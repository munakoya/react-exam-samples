import { useState } from "react";
import type { Task } from "@/entities/task";

/**
 * TaskFormModal の開閉と「どのタスクを編集中か」を持つフック ── features/task-form/model
 *
 * 一覧ページとボードの両方で同じ state と関数が要るので、カスタムフックにまとめる。
 * （カスタムフックは「処理の再利用」。呼んだページごとに state は別々になる。共有したいなら store）
 *
 *   const modal = useTaskFormModal();
 *   <Button onClick={modal.openNew}>追加</Button>
 *   <TaskList onEdit={modal.openEdit} />
 *   <TaskFormModal open={modal.open} task={modal.task} onClose={modal.close} />
 */
export const useTaskFormModal = () => {
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
