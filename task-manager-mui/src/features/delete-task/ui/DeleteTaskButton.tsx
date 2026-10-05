import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useTaskStore, type Task } from "@/entities/task";
import { ConfirmDialog, notify } from "@/shared/ui";

/**
 * 削除ボタン（ゴミ箱のアイコン） ＋ 確認ダイアログ ── features/delete-task/ui
 *
 *   <DeleteTaskButton task={task} />
 */
export const DeleteTaskButton = ({ task }: { task: Task }) => {
  // ダイアログの開閉はこのボタンの中だけで使うので useState（store に入れない）
  const [open, setOpen] = useState(false);
  const removeTask = useTaskStore((state) => state.removeTask);

  const handleConfirm = () => {
    setOpen(false);
    removeTask(task.id);
    notify(`「${task.title}」を削除しました`);
  };

  return (
    <>
      <Tooltip title="削除">
        {/* アイコンだけのボタンは aria-label で、どのタスクの削除かを伝える */}
        <IconButton color="error" aria-label={`「${task.title}」を削除`} onClick={() => setOpen(true)}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${task.title}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
