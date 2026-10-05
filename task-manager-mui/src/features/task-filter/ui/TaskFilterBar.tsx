import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { taskStatuses, taskStatusOptions } from "@/entities/task";
import { sortLabels } from "../model/filterTasks";
import { taskSortKeys, useTaskFilterStore } from "../model/taskFilterStore";

/**
 * 絞り込み（ステータス）と並び替えの操作部分 ── features/task-filter/ui
 *
 *   <TaskFilterBar />            … 両方
 *   <TaskFilterBar hideStatus /> … 並び替えだけ（ボードは列がステータスなので）
 *
 * 値は store に入れているので、props で受け渡ししなくてよい。
 */

const statusFilterOptions = [{ value: "all", label: "すべて" }, ...taskStatusOptions];

export const TaskFilterBar = ({ hideStatus = false }: { hideStatus?: boolean }) => {
  const status = useTaskFilterStore((state) => state.status);
  const sortKey = useTaskFilterStore((state) => state.sortKey);
  const setStatus = useTaskFilterStore((state) => state.setStatus);
  const setSortKey = useTaskFilterStore((state) => state.setSortKey);

  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
      {!hideStatus && (
        // exclusive：1つだけ選べる。選択中をもう一度押すと null が届くので無視する
        <ToggleButtonGroup
          exclusive
          size="small"
          value={status}
          onChange={(_event, value: string | null) => {
            if (value === "all") setStatus("all");
            const next = taskStatuses.find((s) => s === value);
            if (next) setStatus(next);
          }}
          aria-label="ステータスで絞り込む"
        >
          {statusFilterOptions.map((option) => (
            <ToggleButton key={option.value} value={option.value} sx={{ px: 2 }}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      <TextField
        select
        size="small"
        label="並び順"
        value={sortKey}
        onChange={(event) => {
          const next = taskSortKeys.find((key) => key === event.target.value);
          if (next) setSortKey(next);
        }}
        sx={{ minWidth: 180, ml: "auto" }}
      >
        {taskSortKeys.map((key) => (
          <MenuItem key={key} value={key}>
            {sortLabels[key]}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};
