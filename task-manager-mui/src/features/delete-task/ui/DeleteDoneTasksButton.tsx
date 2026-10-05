import Button from "@mui/material/Button";
import { useState } from "react";
import { useTaskStore } from "@/entities/task";
import { ConfirmDialog, notify } from "@/shared/ui";

/**
 * 完了したタスクをまとめて削除するボタン ── features/delete-task/ui
 *
 * 完了が0件のときは押せないようにする。
 * 件数はセレクターで「数」だけを選ぶ（数値は同じなら再描画されない）。
 */
export const DeleteDoneTasksButton = () => {
  const [open, setOpen] = useState(false);
  // filter しても、返すのは数値（length）なので毎回同じ値と判断でき、無限再描画にならない
  const doneCount = useTaskStore((state) => state.tasks.filter((task) => task.status === "done").length);
  const removeDoneTasks = useTaskStore((state) => state.removeDoneTasks);

  const handleConfirm = () => {
    setOpen(false);
    removeDoneTasks();
    notify(`完了したタスクを ${doneCount}件 削除しました`);
  };

  return (
    <>
      <Button color="error" size="small" onClick={() => setOpen(true)} disabled={doneCount === 0}>
        完了したタスクを削除（{doneCount}件）
      </Button>
      <ConfirmDialog
        open={open}
        title="完了したタスクを削除しますか？"
        message={`完了したタスク ${doneCount}件 をまとめて削除します。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
