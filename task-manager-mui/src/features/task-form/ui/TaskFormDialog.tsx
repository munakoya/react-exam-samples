import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { Controller, useForm } from "react-hook-form";
import { taskPriorityOptions, taskStatusOptions, useTaskStore, type Task } from "@/entities/task";
import { FormTextField, notify } from "@/shared/ui";
import {
  taskFormSchema,
  toFormInput,
  type TaskFormInput,
  type TaskFormValues,
} from "../model/schema";

/**
 * タスクの追加・編集をダイアログで行う ── features/task-form/ui
 *
 *   task を渡さない → 追加（addTask）
 *   task を渡す     → 編集（updateTask）
 *
 *   const dialog = useTaskFormDialog();
 *   <TaskFormDialog open={dialog.open} task={dialog.task} onClose={dialog.close} />
 *
 * CSS 版（task-manager）との違い：
 *   CSS 版は <dialog> を隠しているだけなので、開くたびに useEffect で reset() していた。
 *   MUI の Dialog は閉じると中身（TaskForm）を消し、開くと作り直す。
 *   useForm を中身の部品に書いておけば、開くたびに初期値から始まるので reset() は要らない。
 */

type TaskFormDialogProps = {
  open: boolean;
  /** 編集するタスク。追加のときは渡さない */
  task?: Task;
  onClose: () => void;
};

export const TaskFormDialog = ({ open, task, onClose }: TaskFormDialogProps) => {
  return (
    // onClose：Esc キー・背景のクリックで呼ばれる
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <TaskForm task={task} onDone={onClose} />
    </Dialog>
  );
};

// ダイアログの中身（フォーム）。ダイアログを開くたびに作り直される
const TaskForm = ({ task, onDone }: { task?: Task; onDone: () => void }) => {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const { control, handleSubmit } = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: toFormInput(task), // 編集なら今の値、追加なら初期値
  });

  const onSubmit = (values: TaskFormValues) => {
    if (task) {
      updateTask(task.id, values);
      notify(`「${values.title}」を更新しました`);
    } else {
      addTask(values);
      notify(`「${values.title}」を追加しました`);
    }
    onDone();
  };

  return (
    // <form> で DialogTitle・DialogContent・DialogActions を包み、送信ボタンを type="submit" にする
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>{task ? "タスクを編集" : "タスクを追加"}</DialogTitle>
      <DialogContent>
        {/* DialogContent の先頭は上の余白が詰まり、ラベルが切れやすいので pt で少し空ける */}
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormTextField control={control} name="title" label="タイトル" placeholder="例：議事録をまとめる" required autoFocus />
          <FormTextField control={control} name="description" label="詳細" multiline minRows={3} helperText="任意・500文字以内" />

          {/* ラジオボタンは Controller で RadioGroup に {...field} を渡す */}
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <FormControl>
                <FormLabel id="priority-label">優先度</FormLabel>
                <RadioGroup {...field} row aria-labelledby="priority-label">
                  {taskPriorityOptions.map((option) => (
                    <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />

          {/* 追加でも編集でも必ずどれかを選んでいるので、未選択の選択肢は出さない */}
          <FormTextField control={control} name="status" label="ステータス" select>
            {taskStatusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </FormTextField>

          {/* 日付は値がなくても「年/月/日」が出るので、ラベルを常に上に置く（shrink） */}
          <FormTextField
            control={control}
            name="dueDate"
            label="期限"
            type="date"
            helperText="任意"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDone}>キャンセル</Button>
        <Button type="submit" variant="contained">
          {task ? "更新" : "追加"}
        </Button>
      </DialogActions>
    </form>
  );
};
