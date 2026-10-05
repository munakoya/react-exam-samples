import { z } from "zod";
import { taskPriorities, taskStatuses, type Task } from "@/entities/task";

/**
 * タスクの追加・編集フォームの入力チェック ── features/task-form/model
 */

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(50, "50文字以内で入力してください"),
  description: z.string().trim().max(500, "500文字以内で入力してください"),
  // ラジオ・セレクトは必ずどれかが選ばれている状態で始めるので、そのまま enum でチェックできる
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities, { error: "優先度を選択してください" }),
  // 任意の日付：空欄（""）か、"YYYY-MM-DD" の形
  dueDate: z.union([z.literal(""), z.iso.date("日付の形式が正しくありません")]),
});

export type TaskFormInput = z.input<typeof taskFormSchema>;
export type TaskFormValues = z.output<typeof taskFormSchema>;

/** フォームの初期値。task を渡せば編集用（今の値）、なければ新規用 */
export const toFormInput = (task?: Task): TaskFormInput => ({
  title: task?.title ?? "",
  description: task?.description ?? "",
  status: task?.status ?? "todo",
  priority: task?.priority ?? "medium",
  dueDate: task?.dueDate ?? "",
});
