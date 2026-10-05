import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { TaskCard, type Task } from "@/entities/task";
import { TaskStatusSelect } from "@/features/change-task-status";
import { DeleteTaskButton } from "@/features/delete-task";

/**
 * タスクの一覧（カードを縦に並べる） ── widgets/task-list/ui
 *
 * entities の TaskCard に、features の操作（ステータス変更・削除）を差し込んで組み立てる。
 * 「編集」のダイアログはページが持っているので、押されたことを onEdit で伝えるだけにする。
 *
 *   <TaskList tasks={visibleTasks} today={today} onEdit={dialog.openEdit} />
 */

type TaskListProps = {
  tasks: Task[];
  today: string;
  onEdit: (task: Task) => void;
};

export const TaskList = ({ tasks, today, onEdit }: TaskListProps) => {
  return (
    // component="ul"：一覧であることを伝える。リストの点は消す
    <Stack component="ul" spacing={2} sx={{ m: 0, p: 0, listStyle: "none" }}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            today={today}
            actions={
              <>
                <TaskStatusSelect task={task} />
                {/* 右へ寄せるための空き */}
                <Box sx={{ flexGrow: 1 }} />
                <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => onEdit(task)}>
                  編集
                </Button>
                <DeleteTaskButton task={task} />
              </>
            }
          />
        </li>
      ))}
    </Stack>
  );
};
