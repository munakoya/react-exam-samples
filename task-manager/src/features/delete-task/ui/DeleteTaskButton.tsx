import { useState } from "react";
import { useTaskStore, type Task } from "@/entities/task";
import { Button, ConfirmDialog, useToast } from "@/shared/ui";

/**
 * 削除ボタン ＋ 確認ダイアログ（1件） ── features/delete-task/ui
 *
 *   <DeleteTaskButton task={task} />
 */
export const DeleteTaskButton = ({ task }: { task: Task }) => {
  // ダイアログの開閉はこのボタンの中だけで使うので useState（store に入れない）
  const [open, setOpen] = useState(false);
  const removeTask = useTaskStore((state) => state.removeTask);
  const toast = useToast();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`「${task.title}」を削除`} // 同じ「削除」が並ぶので、どれの削除かを読み上げで伝える
      >
        削除
      </Button>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${task.title}」を削除します。`}
        onConfirm={() => {
          setOpen(false);
          removeTask(task.id);
          toast.show(`「${task.title}」を削除しました`, "success");
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
