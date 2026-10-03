import { TaskCard, taskStatuses, taskStatusLabels, type Task } from "@/entities/task";
import { MoveTaskButtons } from "@/features/change-task-status";
import { DeleteTaskButton } from "@/features/delete-task";
import { Button } from "@/shared/ui";
import styles from "./TaskBoard.module.css";

/**
 * かんばんボード（ステータスごとの列にタスクを並べる） ── widgets/task-board/ui
 *
 *   ┌ 未着手 ┐┌ 進行中 ┐┌ 完了 ┐
 *   │ カード ││ カード ││     │
 *   └──────┘└──────┘└─────┘
 *
 * 一覧と同じ tasks（同じ store）を、別の見せ方で表示しているだけ。
 * 列の中の並び順は、受け取った tasks の順のまま（並び替えはページで済ませて渡す）。
 */

type TaskBoardProps = {
  tasks: Task[];
  today: string;
  onEdit: (task: Task) => void;
};

export const TaskBoard = ({ tasks, today, onEdit }: TaskBoardProps) => {
  return (
    <div className={styles.board}>
      {taskStatuses.map((status) => {
        // 列ごとに、そのステータスのタスクだけを取り出す
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          // section ＋ 見出しで「列」のまとまりを伝える
          <section key={status} className={styles.column} aria-labelledby={`column-${status}`}>
            <h2 id={`column-${status}`} className={styles.columnTitle}>
              {taskStatusLabels[status]}
              <span className={styles.count}>{columnTasks.length}</span>
            </h2>

            {columnTasks.length === 0 ? (
              <p className={styles.empty}>タスクはありません</p>
            ) : (
              <ul className={styles.cards}>
                {columnTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard
                      task={task}
                      today={today}
                      hideStatus
                      actions={
                        <>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                            編集
                          </Button>
                          <DeleteTaskButton task={task} />
                          <MoveTaskButtons task={task} />
                        </>
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
};
