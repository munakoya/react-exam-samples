import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { isOverdue, taskStatuses, taskStatusLabels, useTaskStore } from "@/entities/task";
import { DeleteDoneTasksButton } from "@/features/delete-task";
import { filterTasks, TaskFilterBar, useTaskFilterStore } from "@/features/task-filter";
import { TaskFormDialog, useTaskFormDialog } from "@/features/task-form";
import { todayString } from "@/shared/lib";
import { EmptyState, PageHeader, StatCard } from "@/shared/ui";
import { TaskList } from "@/widgets/task-list";

/**
 * タスク一覧ページ（/tasks） ── pages/task-list/ui
 *
 *   ┌ タスク一覧                     [＋ 追加] ┐
 *   │ [未着手 2][進行中 1][完了 3][期限切れ 1] │ ← 集計（StatCard を Grid で）
 *   │ 完了率 ██████░░░░ 50%                   │ ← 進み具合（LinearProgress）
 *   │ [すべて|未着手|進行中|完了]   [並び順▼] │ ← 絞り込み・並び替え（features/task-filter）
 *   │ ┌カード┐ …                              │ ← 一覧（widgets/task-list）
 *   └────────────────────────────┘
 */
export const TaskListPage = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const status = useTaskFilterStore((state) => state.status);
  const sortKey = useTaskFilterStore((state) => state.sortKey);
  const dialog = useTaskFormDialog();

  // ----- tasks から計算できる値（state にしない） -----
  const today = todayString();
  const visibleTasks = filterTasks(tasks, status, sortKey);
  const overdueCount = tasks.filter((task) => isOverdue(task, today)).length;
  // { todo: 2, doing: 1, done: 3 } のような集計
  const countByStatus = Object.fromEntries(
    taskStatuses.map((s) => [s, tasks.filter((task) => task.status === s).length]),
  );
  const doneRate = tasks.length === 0 ? 0 : Math.round((countByStatus.done / tasks.length) * 100);

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>
      追加
    </Button>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="タスク一覧" description="追加・編集はダイアログで行います" action={addButton} />

        {tasks.length === 0 ? (
          <EmptyState title="タスクがありません" description="「追加」から最初のタスクを登録しましょう。" action={addButton} />
        ) : (
          <>
            {/* ----- 集計：スマホ 2 列・600px 以上で 4 列 ----- */}
            <Grid container spacing={2}>
              {taskStatuses.map((s) => (
                <Grid key={s} size={{ xs: 6, sm: 3 }}>
                  <StatCard label={taskStatusLabels[s]} value={countByStatus[s]} unit="件" />
                </Grid>
              ))}
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard label="期限切れ" value={overdueCount} unit="件" color={overdueCount > 0 ? "error" : undefined} />
              </Grid>
            </Grid>

            {/* ----- 完了率：variant="determinate" と value（0〜100）で塗る ----- */}
            <Box>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" id="done-rate-label">
                  完了率
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {countByStatus.done} / {tasks.length}件（{doneRate}%）
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={doneRate}
                color="success"
                aria-labelledby="done-rate-label"
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>

            <TaskFilterBar />

            {visibleTasks.length === 0 ? (
              <EmptyState title="条件に合うタスクはありません" />
            ) : (
              <TaskList tasks={visibleTasks} today={today} onEdit={dialog.openEdit} />
            )}

            <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
              <DeleteDoneTasksButton />
            </Stack>
          </>
        )}
      </Stack>

      <TaskFormDialog open={dialog.open} task={dialog.task} onClose={dialog.close} />
    </Container>
  );
};
