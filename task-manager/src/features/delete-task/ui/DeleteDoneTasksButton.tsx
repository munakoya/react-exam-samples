import { useState } from "react";
import { useTaskStore } from "@/entities/task";
import { Button, ConfirmDialog, useToast } from "@/shared/ui";

/**
 * 完了したタスクをまとめて削除するボタン ── features/delete-task/ui
 *
 * 完了が0件のときは押せないようにする。
 * 件数はセレクターで「数」だけを選ぶ（数値は同じなら再描画されない）。
 */
export const DeleteDoneTasksButton = () => {
  const [open, setOpen] = useState(false);
  const doneCount = useTaskStore(
    (state) => state.tasks.filter((task) => task.status === "done").length,
  ); // filter しても、返すのは数値（length）なので毎回同じ値と判断でき、無限再描画にならない
  const removeDoneTasks = useTaskStore((state) => state.removeDoneTasks);
  const toast = useToast();

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} disabled={doneCount === 0}>
        完了したタスクを削除（{doneCount}件）
      </Button>
      <ConfirmDialog
        open={open}
        title="完了したタスクを削除しますか？"
        message={`完了したタスク ${doneCount}件 をまとめて削除します。`}
        onConfirm={() => {
          setOpen(false);
          removeDoneTasks();
          toast.show(`${doneCount}件 削除しました`, "success");
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
