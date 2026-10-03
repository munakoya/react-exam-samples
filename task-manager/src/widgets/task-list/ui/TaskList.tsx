import { TaskCard, type Task } from "@/entities/task";
import { TaskStatusSelect } from "@/features/change-task-status";
import { DeleteTaskButton } from "@/features/delete-task";
import { Button } from "@/shared/ui";
import styles from "./TaskList.module.css";

/**
 * タスクの一覧（カードを縦に並べる） ── widgets/task-list/ui
 *
 * entities の TaskCard に、features の操作（ステータス変更・削除）を差し込んで組み立てる。
 * 「編集」はモーダルをページが持っているので、押されたことを onEdit で伝えるだけにする。
 *
 *   <TaskList tasks={visibleTasks} today={today} onEdit={(task) => openEditModal(task)} />
 */

type TaskListProps = {
  tasks: Task[];
  today: string;
  onEdit: (task: Task) => void;
};

export const TaskList = ({ tasks, today, onEdit }: TaskListProps) => {
  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            today={today}
            actions={
              <>
                <div className={styles.status}>
                  <TaskStatusSelect task={task} />
                </div>
                <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
                  編集
                </Button>
                <DeleteTaskButton task={task} />
              </>
            }
          />
        </li>
      ))}
    </ul>
  );
};
