import { taskStatusOptions } from "@/entities/task";
import { SegmentedControl, SelectField, Stack } from "@/shared/ui";
import { sortLabels } from "../model/filterTasks";
import {
  taskSortKeys,
  useTaskFilterStore,
  type TaskSortKey,
  type TaskStatusFilter,
} from "../model/taskFilterStore";
import styles from "./TaskFilterBar.module.css";

/**
 * 絞り込み（ステータス）と並び替えの操作部分 ── features/task-filter/ui
 *
 *   <TaskFilterBar />            … 両方
 *   <TaskFilterBar hideStatus /> … 並び替えだけ（ボードは列がステータスなので）
 *
 * 値は store に入れているので、props で受け渡ししなくてよい。
 */

const statusFilterOptions: { value: TaskStatusFilter; label: string }[] = [
  { value: "all", label: "すべて" },
  ...taskStatusOptions,
];

const sortOptions = taskSortKeys.map((value) => ({ value, label: sortLabels[value] }));

export const TaskFilterBar = ({ hideStatus = false }: { hideStatus?: boolean }) => {
  const status = useTaskFilterStore((state) => state.status);
  const sortKey = useTaskFilterStore((state) => state.sortKey);
  const setStatus = useTaskFilterStore((state) => state.setStatus);
  const setSortKey = useTaskFilterStore((state) => state.setSortKey);

  return (
    <Stack direction="row" gap={3} align="end" justify="between" wrap>
      {!hideStatus && (
        <SegmentedControl
          label="ステータスで絞り込む"
          options={statusFilterOptions}
          value={status}
          onChange={setStatus}
        />
      )}
      <div className={styles.sort}>
        <SelectField
          label="並び順"
          options={sortOptions}
          placeholder={false}
          value={sortKey}
          // e.target.value は string なので、選択肢の型に合わせる（選択肢以外の値は来ない）
          onChange={(event) => setSortKey(event.target.value as TaskSortKey)}
        />
      </div>
    </Stack>
  );
};
