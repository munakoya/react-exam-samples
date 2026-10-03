import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { taskPriorityOptions, taskStatusOptions, useTaskStore, type Task } from "@/entities/task";
import {
  Button,
  Modal,
  RadioGroup,
  SelectField,
  Stack,
  TextAreaField,
  TextField,
  useToast,
} from "@/shared/ui";
import {
  taskFormSchema,
  toFormInput,
  type TaskFormInput,
  type TaskFormValues,
} from "../model/schema";

/**
 * タスクの追加・編集をモーダルで行う ── features/task-form/ui
 *
 * ページを移動せず、一覧の上にフォームを重ねて出す形。
 *   task を渡さない → 追加（addTask）
 *   task を渡す     → 編集（updateTask）
 *
 * 使い方:
 *   const [open, setOpen] = useState(false);
 *   const [editingTask, setEditingTask] = useState<Task>();
 *
 *   <TaskFormModal open={open} task={editingTask} onClose={() => setOpen(false)} />
 */

type TaskFormModalProps = {
  open: boolean;
  /** 編集するタスク。追加のときは渡さない */
  task?: Task;
  onClose: () => void;
};

export const TaskFormModal = ({ open, task, onClose }: TaskFormModalProps) => {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const toast = useToast();

  // <form> の外（モーダルの下部）にある送信ボタンと <form> を、id で結びつける
  const formId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: toFormInput(),
  });

  /*
   * モーダルを開くたびに、フォームの中身を入れ直す。
   * モーダルは閉じても消えずに残っている（<dialog> を隠しているだけ）ので、
   * reset しないと「前回の入力」や「前回のエラー」が残ったまま開いてしまう。
   */
  useEffect(() => {
    if (open) reset(toFormInput(task));
  }, [open, task, reset]);

  const onSubmit = (values: TaskFormValues) => {
    if (task) {
      updateTask(task.id, values);
      toast.show(`「${values.title}」を更新しました`, "success");
    } else {
      addTask(values);
      toast.show(`「${values.title}」を追加しました`, "success");
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "タスクを編集" : "タスクを追加"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          {/* form 属性：<form> の外にあっても、その id のフォームの送信ボタンになる */}
          <Button type="submit" form={formId}>
            {task ? "更新" : "追加"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={4}>
          <TextField
            label="タイトル"
            placeholder="例：議事録をまとめる"
            {...register("title")}
            error={errors.title?.message}
          />
          <TextAreaField
            label="詳細"
            hint="任意・500文字以内"
            rows={3}
            {...register("description")}
            error={errors.description?.message}
          />
          {/* ラジオボタンも register をそのまま渡せる（同じ name の input がまとめて登録される） */}
          <RadioGroup
            label="優先度"
            direction="row"
            options={taskPriorityOptions}
            {...register("priority")}
            error={errors.priority?.message}
          />
          {/* 追加でも編集でも必ずどれかを選んでいるので、未選択の選択肢は出さない */}
          <SelectField
            label="ステータス"
            options={taskStatusOptions}
            placeholder={false}
            {...register("status")}
          />
          {/* type="date"：ブラウザの日付選択が使え、値は "YYYY-MM-DD" の文字列で届く */}
          <TextField
            label="期限"
            type="date"
            hint="任意"
            {...register("dueDate")}
            error={errors.dueDate?.message}
          />
        </Stack>
      </form>
    </Modal>
  );
};
