# 5. 実装手順

> [目次](README.md) ｜ 前：[4. ライブラリの使い方](04-libraries.md) ｜ 次：[6. 実装時の考え方とつまずき](06-thinking.md)

**1 ステップ = 動く状態 = 1 コミット**。どのステップの終わりでも、アプリは動いている。
完成したコードは各ステップの「完成形」のリンク先にある。ここではコメントを省いた要点だけを載せる。

| ステップ | 作るもの               | 目安  |
| -------- | ---------------------- | ----- |
| 1        | 環境構築・ルーティング | 15 分 |
| 2        | タスクの型と store     | 15 分 |
| 3        | 一覧の表示（カード）   | 20 分 |
| 4        | 追加・編集のモーダル   | 30 分 |
| 5        | 削除                   | 10 分 |
| 6        | ステータスの変更       | 10 分 |
| 7        | 期限切れ・集計         | 15 分 |
| 8        | 絞り込み・並び替え     | 20 分 |
| 9        | ボード                 | 20 分 |

---

## ステップ 1：環境構築・ルーティング

[1. プロジェクトの作成](01-setup.md) の手順どおり。最後に共通の枠（ヘッダー＋サイドバー）を付ける。

```tsx
// src/app/layouts/RootLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router";
import { AppShell, Header, Sidebar, type SidebarNavItem } from "@/shared/ui";

const navItems: SidebarNavItem[] = [
  { to: "/tasks", label: "タスク一覧" },
  { to: "/board", label: "ボード" },
];

export const RootLayout = () => {
  // ☰ の開閉は Header と Sidebar の両方で使うので、共通の親であるここで持つ
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <AppShell
      header={
        <Header
          title="タスク管理"
          homeTo="/"
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((p) => !p)}
        />
      }
      sidebar={<Sidebar navItems={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />}
    >
      <Outlet />
    </AppShell>
  );
};
```

App.tsx の `<Route>` を `<Route element={<RootLayout />}>` で包む（[4-2](04-libraries.md#4-2-react-router)）。

**確認**：メニューで `/tasks` と `/board` を行き来できる。スマホ幅（DevTools の端末表示）で ☰ が出て開閉できる。

```bash
git commit -m "ルーティングと共通レイアウトを作成"
```

完成形：[App.tsx](../src/app/App.tsx)・[RootLayout.tsx](../src/app/layouts/RootLayout.tsx)

---

## ステップ 2：タスクの型と store（entities/task）

**ゴール**：タスクを追加・保存できる store を作る（画面はまだ）。

### 選択肢と型

```ts
// src/entities/task/model/task.ts
import { z } from "zod";

// 選択肢は「値の配列」「表示名」「{ value, label } の配列」の 3 点セットで作る
export const taskStatuses = ["todo", "doing", "done"] as const;
export type TaskStatus = (typeof taskStatuses)[number];
export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "未着手",
  doing: "進行中",
  done: "完了",
};
export const taskStatusOptions = taskStatuses.map((value) => ({
  value,
  label: taskStatusLabels[value],
}));

export const taskPriorities = ["high", "medium", "low"] as const;
export type TaskPriority = (typeof taskPriorities)[number];
export const taskPriorityLabels: Record<TaskPriority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};
export const taskPriorityOptions = taskPriorities.map((value) => ({
  value,
  label: taskPriorityLabels[value],
}));

// 型は zod のスキーマから作る（localStorage のデータのチェックにも使う）
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
  dueDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Task = z.infer<typeof taskSchema>;
export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">; // フォームから受け取る値
```

**3 点セットにする理由**：型（`TaskStatus`）・画面の表示（`taskStatusLabels[task.status]`）・フォームの選択肢（`taskStatusOptions`）・zod（`z.enum(taskStatuses)`）が、すべて 1 つの配列から作られる。ステータスを増やすときは配列に足すだけで、表示名の書き忘れは `Record` が型エラーで教えてくれる。

### store

```ts
// src/entities/task/model/taskStore.ts
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { taskSchema, type Task, type TaskInput, type TaskStatus } from "./task";

type TaskState = { tasks: Task[] };
type TaskActions = {
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  changeStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  removeDoneTasks: () => void;
};

// 「id が一致するものだけ差し替える」はどの更新でも同じなので、関数にしておく
const updateById = (tasks: Task[], id: string, changes: Partial<Task>) =>
  tasks.map((task) =>
    task.id === id ? { ...task, ...changes, updatedAt: new Date().toISOString() } : task,
  );

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (input) => {
        const now = new Date().toISOString();
        const task: Task = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
        set((state) => ({ tasks: [task, ...state.tasks] }));
      },
      updateTask: (id, input) => set((state) => ({ tasks: updateById(state.tasks, id, input) })),
      changeStatus: (id, status) =>
        set((state) => ({ tasks: updateById(state.tasks, id, { status }) })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      removeDoneTasks: () =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.status !== "done") })),
    }),
    {
      name: storageKey("tasks"),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
      version: 1,
      merge: mergeWithSchema(z.object({ tasks: z.array(taskSchema) })),
    },
  ),
);
```

`storageKey`（[shared/config](../src/shared/config/storage.ts)）は `"task-manager:tasks"` のようにアプリ名を付けるだけの関数。`mergeWithSchema`（[shared/lib/persist.ts](../src/shared/lib/persist.ts)）はコピーして使う。

### 窓口（index.ts）

```ts
// src/entities/task/index.ts：外から使うものだけ export する
export {
  taskStatuses,
  taskStatusLabels,
  taskStatusOptions,
  /* … */ type Task,
  type TaskInput,
} from "./model/task";
export { useTaskStore } from "./model/taskStore";
```

**確認**：`npm run build` が通る（まだ画面からは使っていない）。

```bash
git commit -m "タスクの型と store を作成"
```

完成形：[task.ts](../src/entities/task/model/task.ts)・[taskStore.ts](../src/entities/task/model/taskStore.ts)

---

## ステップ 3：一覧の表示

**ゴール**：store のタスクをカードで並べる。0 件なら案内を出す。

### カード（entities/task/ui）

```tsx
// src/entities/task/ui/TaskCard.tsx
type TaskCardProps = {
  task: Task;
  today: string;
  hideStatus?: boolean;
  actions?: ReactNode; // 操作ボタンは外から受け取る（entities は操作を持たない）
};

export const TaskCard = ({ task, today, hideStatus = false, actions }: TaskCardProps) => (
  <article className={styles.card} data-done={task.status === "done"}>
    <div className={styles.header}>
      <h3 className={styles.title}>{task.title}</h3>
      <div className={styles.badges}>
        {!hideStatus && <TaskStatusBadge status={task.status} />}
        <TaskPriorityBadge priority={task.priority} />
      </div>
    </div>
    {task.description && <p className={styles.description}>{task.description}</p>}
    <p className={styles.due}>期限：{task.dueDate ? formatDate(task.dueDate) : "なし"}</p>
    {actions && <div className={styles.actions}>{actions}</div>}
  </article>
);
```

バッジの色は「値 → 色」の対応表で決める（if 文を並べない）。

```tsx
// src/entities/task/ui/TaskBadges.tsx
const statusTones = { todo: "neutral", doing: "info", done: "success" } as const satisfies Record<
  TaskStatus,
  string
>;
export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
  <Badge tone={statusTones[status]}>{taskStatusLabels[status]}</Badge>
);
```

### 一覧（widgets）とページ（pages）

```tsx
// src/widgets/task-list/ui/TaskList.tsx（操作はステップ 4〜6 で足す）
export const TaskList = ({ tasks, today }: { tasks: Task[]; today: string }) => (
  <ul className={styles.list}>
    {tasks.map((task) => (
      <li key={task.id}>
        <TaskCard task={task} today={today} />
      </li>
    ))}
  </ul>
);
```

```tsx
// src/pages/task-list/ui/TaskListPage.tsx
export const TaskListPage = () => {
  const tasks = useTaskStore((state) => state.tasks);
  return (
    <Container>
      <Stack gap={5}>
        <PageHeader title="タスク一覧" />
        {tasks.length === 0 ? (
          <EmptyState title="タスクがありません" />
        ) : (
          <TaskList tasks={tasks} today={todayString()} />
        )}
      </Stack>
    </Container>
  );
};
```

App.tsx の `/tasks` を `<TaskListPage />` にする。

**表示を確かめるコツ**：フォームを作る前にカードの見た目を確かめたいなら、一時的にボタンを置いて仮のデータを入れる（確認したら消す）。

```tsx
const addTask = useTaskStore((s) => s.addTask);
<Button
  onClick={() =>
    addTask({
      title: "仮のタスク",
      description: "",
      status: "todo",
      priority: "high",
      dueDate: "2026-10-01",
    })
  }
>
  仮データ
</Button>;
```

**確認**：0 件で案内が出る。仮データを入れるとカードが出て、再読み込みしても残っている（localStorage に保存されている）。

```bash
git commit -m "タスクの一覧表示を実装"
```

完成形：[TaskCard.tsx](../src/entities/task/ui/TaskCard.tsx)・[TaskList.tsx](../src/widgets/task-list/ui/TaskList.tsx)・[TaskListPage.tsx](../src/pages/task-list/ui/TaskListPage.tsx)

---

## ステップ 4：追加・編集のモーダル（features/task-form）

**ゴール**：「＋ 追加」でモーダルを開いて追加、カードの「編集」で同じモーダルを今の値入りで開いて更新。

### 入力チェック

```ts
// src/features/task-form/model/schema.ts
export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(50, "50文字以内で入力してください"),
  description: z.string().trim().max(500, "500文字以内で入力してください"),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities, { error: "優先度を選択してください" }),
  dueDate: z.union([z.literal(""), z.iso.date("日付の形式が正しくありません")]),
});
export type TaskFormInput = z.input<typeof taskFormSchema>;
export type TaskFormValues = z.output<typeof taskFormSchema>;

// 新規なら空欄、編集なら今の値
export const toFormInput = (task?: Task): TaskFormInput => ({
  title: task?.title ?? "",
  description: task?.description ?? "",
  status: task?.status ?? "todo",
  priority: task?.priority ?? "medium",
  dueDate: task?.dueDate ?? "",
});
```

### モーダル

```tsx
// src/features/task-form/ui/TaskFormModal.tsx（要点）
export const TaskFormModal = ({
  open,
  task,
  onClose,
}: {
  open: boolean;
  task?: Task;
  onClose: () => void;
}) => {
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
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

  // 開くたびに中身を入れ直す（<dialog> は閉じても消えないので、前回の入力・エラーが残る）
  useEffect(() => {
    if (open) reset(toFormInput(task));
  }, [open, task, reset]);

  const onSubmit = (values: TaskFormValues) => {
    if (task)
      updateTask(task.id, values); // task があれば編集
    else addTask(values); // なければ追加
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "タスクを編集" : "タスクを追加"}
      footer={
        <Button type="submit" form={formId}>
          {task ? "更新" : "追加"}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={4}>
          <TextField label="タイトル" {...register("title")} error={errors.title?.message} />
          <TextAreaField
            label="詳細"
            {...register("description")}
            error={errors.description?.message}
          />
          <RadioGroup
            label="優先度"
            direction="row"
            options={taskPriorityOptions}
            {...register("priority")}
          />
          <SelectField
            label="ステータス"
            options={taskStatusOptions}
            placeholder={false}
            {...register("status")}
          />
          <TextField
            label="期限"
            type="date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
          />
        </Stack>
      </form>
    </Modal>
  );
};
```

### 開閉の state（カスタムフック）

一覧とボードの両方でモーダルを使うので、開閉と「編集中のタスク」をフックにまとめる。

```ts
// src/features/task-form/model/useTaskFormModal.ts
export const useTaskFormModal = () => {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<Task>(); // undefined なら追加、Task なら編集
  return {
    open,
    task,
    openNew: () => {
      setTask(undefined);
      setOpen(true);
    },
    openEdit: (target: Task) => {
      setTask(target);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
};
```

### ページにつなぐ

```tsx
// TaskListPage
const modal = useTaskFormModal();

<PageHeader title="タスク一覧" action={<Button onClick={modal.openNew}>＋ 追加</Button>} />
<TaskList tasks={tasks} today={today} onEdit={modal.openEdit} />
<TaskFormModal open={modal.open} task={modal.task} onClose={modal.close} />
```

```tsx
// TaskList：カードに「編集」ボタンを差し込み、押されたことを onEdit で伝えるだけ
<TaskCard
  task={task}
  today={today}
  actions={
    <Button size="sm" onClick={() => onEdit(task)}>
      編集
    </Button>
  }
/>
```

**確認**：

- 空欄で「追加」→ エラーが出る。入力して追加 → 一覧に出る
- 「編集」→ 今の値が入っている。変えて「更新」→ 反映される
- 編集を閉じてから「＋ 追加」→ 空欄で開く（前の値が残っていない）

```bash
git commit -m "タスクの追加・編集（モーダル）を実装"
```

ここで仮データのボタンを消す。

完成形：[schema.ts](../src/features/task-form/model/schema.ts)・[TaskFormModal.tsx](../src/features/task-form/ui/TaskFormModal.tsx)・[useTaskFormModal.ts](../src/features/task-form/model/useTaskFormModal.ts)

---

## ステップ 5：削除（features/delete-task）

**ゴール**：確認ダイアログを出してから削除。完了したタスクのまとめて削除も。

```tsx
// src/features/delete-task/ui/DeleteTaskButton.tsx
export const DeleteTaskButton = ({ task }: { task: Task }) => {
  const [open, setOpen] = useState(false); // このボタンの中だけで使うので useState
  const removeTask = useTaskStore((s) => s.removeTask);
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`「${task.title}」を削除`}
      >
        削除
      </Button>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${task.title}」を削除します。`}
        onConfirm={() => {
          setOpen(false);
          removeTask(task.id);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
```

- 削除ボタンと確認ダイアログを 1 つの部品にすると、一覧でもボードでも `<DeleteTaskButton task={task} />` だけで使える
- `aria-label`：「削除」ボタンが何個も並ぶので、どれの削除かを読み上げで伝える

まとめて削除は、件数を**数値で選ぶ**（[DeleteDoneTasksButton.tsx](../src/features/delete-task/ui/DeleteDoneTasksButton.tsx)）。

```tsx
const doneCount = useTaskStore((s) => s.tasks.filter((t) => t.status === "done").length); // 数値なので OK
<Button onClick={() => setOpen(true)} disabled={doneCount === 0}>
  完了したタスクを削除（{doneCount}件）
</Button>;
```

**確認**：キャンセルで消えない。削除で消え、再読み込みしても消えたまま。

```bash
git commit -m "タスクの削除を実装"
```

---

## ステップ 6：ステータスの変更（features/change-task-status）

**ゴール**：カードのセレクトで、その場でステータスを変える。

```tsx
// src/features/change-task-status/ui/TaskStatusSelect.tsx
export const TaskStatusSelect = ({ task }: { task: Task }) => {
  const changeStatus = useTaskStore((s) => s.changeStatus);
  return (
    <SelectField
      label="ステータス"
      options={taskStatusOptions}
      placeholder={false}
      value={task.status}
      onChange={(e) => changeStatus(task.id, e.target.value as TaskStatus)}
    />
  );
};
```

送信ボタンがなく、選んだ瞬間に反映する操作なので、React Hook Form は使わない。
`e.target.value` は `string` 型なので、選択肢の型に合わせる（選択肢以外の値は来ない）。

一覧の [TaskList](../src/widgets/task-list/ui/TaskList.tsx) で、カードの `actions` に「ステータス・編集・削除」を並べる。features 同士は import し合わないので、**組み合わせるのは widgets の役目**。

**確認**：完了にするとカードが薄くなる（`data-done` と CSS）。

```bash
git commit -m "ステータスの変更を実装"
```

---

## ステップ 7：期限切れ・集計

**ゴール**：期限切れのカードを赤くし、ステータスごとの件数・期限切れの数・完了率を出す。

判定は「タスクの知識」なので entities に置く。

```ts
// src/entities/task/model/task.ts
export const isOverdue = (task: Task, today: string) =>
  task.status !== "done" && task.dueDate !== "" && task.dueDate < today; // "YYYY-MM-DD" は文字列で比べられる
```

```tsx
// TaskCard
const overdue = isOverdue(task, today);
<article className={styles.card} data-done={task.status === "done"} data-overdue={overdue}>
  …
  {overdue && <Badge tone="danger">期限切れ</Badge>}
```

```css
/* TaskCard.module.css */
.card[data-overdue="true"] {
  border-left: 4px solid var(--color-danger);
}
```

集計は**計算するだけ**（state にしない）。

```tsx
// TaskListPage
const today = todayString();
const overdueCount = tasks.filter((t) => isOverdue(t, today)).length;
const countByStatus = Object.fromEntries(
  taskStatuses.map((s) => [s, tasks.filter((t) => t.status === s).length]),
);

<Grid min={120} gap={3}>
  {taskStatuses.map((s) => <Stat key={s} label={taskStatusLabels[s]} value={countByStatus[s]} />)}
  <Stat label="期限切れ" value={overdueCount} tone={overdueCount > 0 ? "danger" : "neutral"} />
</Grid>
<ProgressBar label="完了率" value={countByStatus.done} max={tasks.length} tone="success" />
```

**確認**：昨日の期限で未完了のタスク → 赤い線と「期限切れ」。完了にすると消える。件数がすぐ変わる。

```bash
git commit -m "期限切れの表示と集計を実装"
```

---

## ステップ 8：絞り込み・並び替え（features/task-filter）

**ゴール**：ステータスで絞り込み、期限・優先度・作成日で並べ替える。設定は再読み込みしても残る。

### 設定の store

一覧とボードで同じ設定を使い、前回の設定で開きたいので persist した store にする。**タスク本体の store とは分ける**（データと画面の設定は性質が違う）。

```ts
// src/features/task-filter/model/taskFilterStore.ts
export type TaskStatusFilter = "all" | TaskStatus;
export const taskSortKeys = ["dueDate", "priority", "createdAt"] as const;
export type TaskSortKey = (typeof taskSortKeys)[number];

export const useTaskFilterStore = create<TaskFilterStore>()(
  persist(
    (set) => ({
      status: "all",
      sortKey: "dueDate",
      setStatus: (status) => set({ status }),
      setSortKey: (sortKey) => set({ sortKey }),
    }),
    {
      name: storageKey("task-filter"), // タスク本体とは別のキー
      partialize: (state) => ({ status: state.status, sortKey: state.sortKey }),
      merge: mergeWithSchema(
        z.object({ status: z.enum(["all", ...taskStatuses]), sortKey: z.enum(taskSortKeys) }),
      ),
    },
  ),
);
```

### 絞り込み・並び替えの関数

React に関係しない、ただの関数にする（どこからでも使え、動きを確かめやすい）。

```ts
// src/features/task-filter/model/filterTasks.ts
const priorityRank: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

const compareFns: Record<TaskSortKey, (a: Task, b: Task) => number> = {
  dueDate: (a, b) => {
    if (a.dueDate === b.dueDate) return 0;
    if (a.dueDate === "") return 1; // 期限なしは後ろ
    if (b.dueDate === "") return -1;
    return a.dueDate.localeCompare(b.dueDate);
  },
  priority: (a, b) => priorityRank[a.priority] - priorityRank[b.priority],
  createdAt: (a, b) => b.createdAt.localeCompare(a.createdAt),
};

export const filterTasks = (tasks: Task[], status: TaskStatusFilter, sortKey: TaskSortKey) =>
  tasks.filter((task) => status === "all" || task.status === status).toSorted(compareFns[sortKey]); // sort() は store の配列を書き換えるので使わない
```

### 画面

```tsx
// TaskListPage
const status = useTaskFilterStore((s) => s.status);
const sortKey = useTaskFilterStore((s) => s.sortKey);
const visibleTasks = filterTasks(tasks, status, sortKey); // 計算するだけ

<TaskFilterBar />  {/* SegmentedControl（ステータス）＋ SelectField（並び順）。値は store から読む */}
{visibleTasks.length === 0 ? <EmptyState title="条件に合うタスクはありません" /> : <TaskList tasks={visibleTasks} … />}
```

「タスクが 0 件」と「条件に合うタスクが 0 件」は**別の案内**にする。

**確認**：絞り込み・並び替えが効く。再読み込みしても設定が残る。

```bash
git commit -m "絞り込み・並び替えを実装"
```

完成形：[taskFilterStore.ts](../src/features/task-filter/model/taskFilterStore.ts)・[filterTasks.ts](../src/features/task-filter/model/filterTasks.ts)・[TaskFilterBar.tsx](../src/features/task-filter/ui/TaskFilterBar.tsx)

---

## ステップ 9：ボード

**ゴール**：ステータスごとの 3 列にカードを並べ、ボタンで隣の列へ動かす。

前後のステータスは、配列の「何番目か」から求める。

```tsx
// src/features/change-task-status/ui/MoveTaskButtons.tsx
const index = taskStatuses.indexOf(task.status);
const prev = taskStatuses[index - 1]; // 端なら undefined
const next = taskStatuses[index + 1];

{
  prev && (
    <Button size="sm" onClick={() => changeStatus(task.id, prev)}>
      ← {taskStatusLabels[prev]}
    </Button>
  );
}
{
  next && (
    <Button size="sm" onClick={() => changeStatus(task.id, next)}>
      {taskStatusLabels[next]} →
    </Button>
  );
}
```

```tsx
// src/widgets/task-board/ui/TaskBoard.tsx（要点）
<div className={styles.board}>
  {taskStatuses.map((status) => {
    const columnTasks = tasks.filter((task) => task.status === status);
    return (
      <section key={status} className={styles.column}>
        <h2>
          {taskStatusLabels[status]} {columnTasks.length}
        </h2>
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            today={today}
            hideStatus
            actions={<MoveTaskButtons task={task} />}
          />
        ))}
      </section>
    );
  })}
</div>
```

```css
/* 3 等分。minmax(0, 1fr) にすると、長い文字があっても列が広がらない */
.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
  align-items: start;
}
@media (width < 900px) {
  .board {
    grid-template-columns: 1fr; /* 狭い画面では 1 列 */
  }
}
```

ボードのページは一覧と**同じ store** を使うので、書くのはページの組み立てだけ。モーダルも `useTaskFormModal()` と `<TaskFormModal>` をそのまま使い回す。

**確認**：ボードで動かすと、一覧に戻っても反映されている。スマホ幅で 1 列になる。

```bash
git commit -m "かんばんボードを実装"
```

完成形：[TaskBoard.tsx](../src/widgets/task-board/ui/TaskBoard.tsx)・[TaskBoardPage.tsx](../src/pages/task-board/ui/TaskBoardPage.tsx)

---

ここまでで完成。仕上げのチェックは [6. 実装時の考え方とつまずき](06-thinking.md#6-5-提出前のチェックリスト) へ。

> 次：[6. 実装時の考え方とつまずき](06-thinking.md)
