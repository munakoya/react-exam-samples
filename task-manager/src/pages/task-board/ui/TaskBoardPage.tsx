import { useTaskStore } from "@/entities/task";
import { filterTasks, TaskFilterBar, useTaskFilterStore } from "@/features/task-filter";
import { TaskFormModal, useTaskFormModal } from "@/features/task-form";
import { todayString } from "@/shared/lib";
import { Button, Container, PageHeader, Stack } from "@/shared/ui";
import { TaskBoard } from "@/widgets/task-board";

/**
 * ボードページ（/board） ── pages/task-board/ui
 *
 * 一覧ページと同じ store（useTaskStore・useTaskFilterStore）を使うので、
 * どちらのページで変えても、もう一方にすぐ反映される。
 */
export const TaskBoardPage = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const sortKey = useTaskFilterStore((state) => state.sortKey);
  const modal = useTaskFormModal();

  // ボードは列がステータスなので、ステータスでは絞り込まない（"all"）。並び順だけ一覧と共有する
  const sortedTasks = filterTasks(tasks, "all", sortKey);

  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader
          title="ボード"
          description="ボタンでタスクを隣の列へ動かせます"
          action={<Button onClick={modal.openNew}>＋ 追加</Button>}
        />
        <TaskFilterBar hideStatus />
        <TaskBoard tasks={sortedTasks} today={todayString()} onEdit={modal.openEdit} />
      </Stack>

      <TaskFormModal open={modal.open} task={modal.task} onClose={modal.close} />
    </Container>
  );
};
