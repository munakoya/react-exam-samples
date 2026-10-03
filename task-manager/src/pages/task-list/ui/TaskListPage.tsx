import { isOverdue, taskStatuses, taskStatusLabels, useTaskStore } from "@/entities/task";
import { DeleteDoneTasksButton } from "@/features/delete-task";
import { filterTasks, TaskFilterBar, useTaskFilterStore } from "@/features/task-filter";
import { TaskFormModal, useTaskFormModal } from "@/features/task-form";
import { todayString } from "@/shared/lib";
import { Button, Container, EmptyState, PageHeader, Stack } from "@/shared/ui";
import { TaskList } from "@/widgets/task-list";
import styles from "./TaskListPage.module.css";

/**
 * タスク一覧ページ（/tasks） ── pages/task-list/ui
 *
 *   ┌ タスク一覧              [＋ 追加] ┐
 *   │ 未着手 2 / 進行中 1 / 完了 3 / 期限切れ 1 │ ← 集計
 *   │ [すべて|未着手|進行中|完了]  [並び順▼] │ ← 絞り込み・並び替え（features/task-filter）
 *   │ ┌カード┐                           │
 *   │ └────┘ …                        │ ← 一覧（widgets/task-list）
 *   └──────────────────────────┘
 */
export const TaskListPage = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const status = useTaskFilterStore((state) => state.status);
  const sortKey = useTaskFilterStore((state) => state.sortKey);
  const modal = useTaskFormModal();

  // ----- tasks から計算できる値（state にしない） -----
  const today = todayString();
  const visibleTasks = filterTasks(tasks, status, sortKey);
  const overdueCount = tasks.filter((task) => isOverdue(task, today)).length;
  // { todo: 2, doing: 1, done: 3 } のような集計
  const countByStatus = Object.fromEntries(
    taskStatuses.map((s) => [s, tasks.filter((task) => task.status === s).length]),
  );

  return (
    <Container>
      <Stack gap={5}>
        <PageHeader
          title="タスク一覧"
          description="追加・編集はモーダルで行います"
          action={<Button onClick={modal.openNew}>＋ 追加</Button>}
        />

        {tasks.length === 0 ? (
          <EmptyState
            title="タスクがありません"
            description="「＋ 追加」から最初のタスクを登録しましょう。"
            action={<Button onClick={modal.openNew}>＋ 追加</Button>}
          />
        ) : (
          <>
            {/* ----- 集計 ----- */}
            {/* 項目名と値の組なので <dl>。CSS で横並びにする */}
            <dl className={styles.summary}>
              {taskStatuses.map((s) => (
                <div key={s} className={styles.summaryItem}>
                  <dt>{taskStatusLabels[s]}</dt>
                  <dd>{countByStatus[s]}</dd>
                </div>
              ))}
              <div className={styles.summaryItem} data-alert={overdueCount > 0}>
                <dt>期限切れ</dt>
                <dd>{overdueCount}</dd>
              </div>
            </dl>

            <TaskFilterBar />

            {visibleTasks.length === 0 ? (
              <EmptyState title="条件に合うタスクはありません" />
            ) : (
              <TaskList tasks={visibleTasks} today={today} onEdit={modal.openEdit} />
            )}

            <Stack direction="row" justify="end">
              <DeleteDoneTasksButton />
            </Stack>
          </>
        )}
      </Stack>

      <TaskFormModal open={modal.open} task={modal.task} onClose={modal.close} />
    </Container>
  );
};
