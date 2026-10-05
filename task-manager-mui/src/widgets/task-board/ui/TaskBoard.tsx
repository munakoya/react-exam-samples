import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { TaskCard, taskStatuses, taskStatusLabels, type Task } from "@/entities/task";
import { MoveTaskButtons } from "@/features/change-task-status";
import { DeleteTaskButton } from "@/features/delete-task";

/**
 * かんばんボード（ステータスごとの列にタスクを並べる） ── widgets/task-board/ui
 *
 *   ┌ 未着手 ┐┌ 進行中 ┐┌ 完了 ┐
 *   │ カード ││ カード ││     │
 *   └──────┘└──────┘└─────┘
 *
 * 一覧と同じ tasks（同じ store）を、別の見せ方で表示しているだけ。
 * Grid で PC は 3 列、900px 未満は縦に 1 列にする（size={{ xs: 12, md: 4 }}）。
 */

type TaskBoardProps = {
  tasks: Task[];
  today: string;
  onEdit: (task: Task) => void;
};

export const TaskBoard = ({ tasks, today, onEdit }: TaskBoardProps) => {
  return (
    // alignItems: flex-start：列の高さを中身に合わせる（一番長い列にそろえない）
    <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
      {taskStatuses.map((status) => {
        // 列ごとに、そのステータスのタスクだけを取り出す
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <Grid key={status} size={{ xs: 12, md: 4 }}>
            {/* section ＋ 見出しで「列」のまとまりを伝える。背景を灰色にして列に見せる */}
            <Paper
              component="section"
              elevation={0}
              aria-labelledby={`column-${status}`}
              sx={{ p: 1.5, bgcolor: "grey.100" }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5, px: 0.5 }}>
                <Typography id={`column-${status}`} variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
                  {taskStatusLabels[status]}
                </Typography>
                <Chip size="small" label={columnTasks.length} />
              </Stack>

              {columnTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                  タスクはありません
                </Typography>
              ) : (
                <Stack component="ul" spacing={1.5} sx={{ m: 0, p: 0, listStyle: "none" }}>
                  {columnTasks.map((task) => (
                    <li key={task.id}>
                      <TaskCard
                        task={task}
                        today={today}
                        hideStatus
                        actions={
                          <>
                            <MoveTaskButtons task={task} />
                            <Tooltip title="編集">
                              <IconButton aria-label={`「${task.title}」を編集`} onClick={() => onEdit(task)} sx={{ ml: "auto" }}>
                                <EditOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                            <DeleteTaskButton task={task} />
                          </>
                        }
                      />
                    </li>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};
