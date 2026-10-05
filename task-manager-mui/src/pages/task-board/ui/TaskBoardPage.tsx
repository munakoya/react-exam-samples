import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useTaskStore } from "@/entities/task";
import { filterTasks, TaskFilterBar, useTaskFilterStore } from "@/features/task-filter";
import { TaskFormDialog, useTaskFormDialog } from "@/features/task-form";
import { todayString } from "@/shared/lib";
import { PageHeader } from "@/shared/ui";
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
  const dialog = useTaskFormDialog();

  // ボードは列がステータスなので、ステータスでは絞り込まない（"all"）。並び順だけ一覧と共有する
  const sortedTasks = filterTasks(tasks, "all", sortKey);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title="ボード"
          description="ボタンでタスクを隣の列へ動かせます"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>
              追加
            </Button>
          }
        />
        <TaskFilterBar hideStatus />
        <TaskBoard tasks={sortedTasks} today={todayString()} onEdit={dialog.openEdit} />
      </Stack>

      <TaskFormDialog open={dialog.open} task={dialog.task} onClose={dialog.close} />
    </Container>
  );
};
