# 4. ライブラリの使い方

> [目次](README.md) ｜ 前：[3. モダン JavaScript / TypeScript](03-modern-js.md) ｜ 次：[5. 実装手順](05-implementation.md)

それぞれ「何をするものか → 最小の使い方 → このアプリでの使い方 → つまずき」の順に書く。

## 4-1. React（このアプリで使うフック）

### useState：コンポーネントの中の値

```tsx
const [open, setOpen] = useState(false);

setOpen(true); // 値を入れ替える
setOpen((prev) => !prev); // 今の値をもとに変える（連続で呼んでも正しく動く）
```

state が変わると、そのコンポーネントがもう一度実行（再描画）される。**値は次の描画から変わる**ので、`setOpen(true)` の直後に `open` を読んでもまだ `false`。

### useEffect：描画のあとに、外の世界と同期する

```tsx
useEffect(() => {
  if (open) reset(toFormInput(task)); // open・task が変わったときに実行
}, [open, task, reset]); // 依存配列：中で使っている値を全部書く
```

```tsx
// 後片付けが要る処理（イベントの登録・タイマー）は、関数を返して解除する
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [onClose]);
```

- **計算できる値のために useEffect を使わない**。`const visibleTasks = filterTasks(…)` と書けば、描画のたびに計算される
- 開発中は `StrictMode` によって effect が 2 回動く。後片付けを正しく書いていれば問題ない

### useId：重複しない id

```tsx
const formId = useId();          // ":r1:" のような文字列
<form id={formId}>…</form>
<button type="submit" form={formId}>追加</button>  // form の外の送信ボタンと結びつける
```

### カスタムフック：処理をまとめて使い回す

`use` で始まる関数の中でフックを使うと、カスタムフックになる。

```ts
// features/task-form/model/useTaskFormModal.ts
export const useTaskFormModal = () => {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<Task>();
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

**カスタムフックは state を共有しない**。一覧ページとボードで `useTaskFormModal()` を呼ぶと、それぞれ別の `open` を持つ。共有したいなら Zustand。

フックのルール：コンポーネント（かカスタムフック）の**一番上**で呼ぶ。`if` や `for` の中、early return の後では呼ばない。

## 4-2. React Router

### URL とページの対応

```tsx
// app/App.tsx
<Routes>
  {/* path のない Route ＝ レイアウトルート。子のページを RootLayout の <Outlet /> に表示する */}
  <Route element={<RootLayout />}>
    <Route index element={<Navigate to="/tasks" replace />} /> {/* "/" に来たら /tasks へ */}
    <Route path="/tasks" element={<TaskListPage />} />
    <Route path="/board" element={<TaskBoardPage />} />
    <Route path="*" element={<NotFoundPage />} /> {/* どれにも一致しない URL */}
  </Route>
</Routes>
```

```tsx
// app/layouts/RootLayout.tsx（全ページ共通の枠）
<AppShell header={<Header … />} sidebar={<Sidebar … />}>
  <Outlet />   {/* ここに今の URL のページが入る */}
</AppShell>
```

### ページを移動する

| やりたいこと                 | 書き方                                                          |
| ---------------------------- | --------------------------------------------------------------- |
| リンクで移動                 | `<Link to="/tasks">一覧</Link>`（ページは再読み込みされない）   |
| 今のページのリンクを強調する | `<NavLink to="/tasks">`（今のページなら `active` クラスが付く） |
| ボタンの見た目のリンク       | `<ButtonLink to="/tasks/new">追加</ButtonLink>`（shared/ui）    |
| 処理のあとに JS で移動       | `const navigate = useNavigate(); navigate("/tasks");`           |
| 戻るボタンと同じ             | `navigate(-1)`                                                  |
| 履歴を残さずに移動           | `navigate("/tasks", { replace: true })`（削除後など）           |
| 描画したら移動（ガード）     | `return <Navigate to="/cart" replace />;`                       |

「押すとページが変わるだけ」なら `Link`（新しいタブで開ける・読み上げで「リンク」と伝わる）。保存などの処理のあとに移動するなら `navigate`。

### URL から値を受け取る

```tsx
// /tasks/abc → { taskId: "abc" }（<Route path="/tasks/:taskId"> のとき）
const { taskId } = useParams<{ taskId: string }>();

// /tasks?status=done → "done"
const [searchParams, setSearchParams] = useSearchParams();
const status = searchParams.get("status") ?? "all";
setSearchParams({ status: "todo" }, { replace: true }); // URL を書き換える
```

`/tasks/:taskId` のような詳細ページは、このアプリにはない（[在庫管理](../../inventory/) にある）。
URL の値は手で書き換えられるので、使う前に「選択肢のどれかか」を確かめる。

### ページの移動と store の更新の順番（useTransitions）

React Router は初期設定で、ページの移動を少し遅らせて反映する（React の `startTransition`）。Zustand の更新はすぐ反映されるので、次のように書くと**書いた順に動かない**ことがある。

```ts
navigate("/orders/1/complete"); // ← 少し遅れて反映
clearCart(); // ← すぐ反映 → 「カートが空なら戻す」ページが先に動いてしまう
```

`<BrowserRouter useTransitions={false}>` にすると、どちらもすぐ反映され、書いた順に動く。このサンプル集はすべてこの設定にしている。

## 4-3. Zustand

### store を作る

```ts
import { create } from "zustand";

type TaskStore = {
  tasks: Task[]; // 値（state）
  addTask: (input: TaskInput) => void; // 値の変え方（action）
  removeTask: (id: string) => void;
};

// TypeScript では create<型>()(…) と ( ) を 2 回書く（ミドルウェアの型を正しく付けるため）
export const useTaskStore = create<TaskStore>()((set) => ({
  tasks: [],
  addTask: (input) =>
    set((state) => ({ tasks: [{ ...input, id: crypto.randomUUID() }, ...state.tasks] })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));
```

- `set((state) => ({ … }))`：今の state から次の state を作る。**返したキーだけが上書き**される（ほかのキーは残る）
- `set({ status })`：今の state を使わないなら、オブジェクトを直接渡してよい
- 元の配列は書き換えず、新しい配列を作る（[3-3](03-modern-js.md#3-3-スプレッド構文-コピーして一部を変える)）

### 画面で使う：セレクター

```tsx
const tasks = useTaskStore((state) => state.tasks); // 値
const addTask = useTaskStore((state) => state.addTask); // action
const doneCount = useTaskStore((state) => state.tasks.filter((t) => t.status === "done").length); // 数値
```

選んだ値が変わったときだけ、そのコンポーネントが再描画される。

**⚠ いちばん多いバグ：セレクターで新しい配列・オブジェクトを返す**

```tsx
// ✗ 呼ぶたびに新しい配列 → 毎回「変わった」と判断され、無限に再描画（Maximum update depth exceeded）
const done = useTaskStore((state) => state.tasks.filter((t) => t.status === "done"));
const { tasks, addTask } = useTaskStore((state) => ({
  tasks: state.tasks,
  addTask: state.addTask,
}));

// ○ 元の値を選んでから、画面側で計算する
const tasks = useTaskStore((state) => state.tasks);
const done = tasks.filter((t) => t.status === "done");

// ○ 複数を選ぶなら 1 つずつ、または useShallow で包む
import { useShallow } from "zustand/react/shallow";
const { tasks, addTask } = useTaskStore(
  useShallow((state) => ({ tasks: state.tasks, addTask: state.addTask })),
);
```

`find` は配列の中の**同じオブジェクト**を返し、`length` は数値を返すので、セレクターで使ってよい。

### persist：localStorage に保存する

```ts
import { createJSONStorage, persist } from "zustand/middleware";

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set) => ({ … }),                                 // 中身は persist なしと同じ
    {
      name: "task-manager:tasks",                     // localStorage のキー（アプリ・store ごとに変える）
      storage: createJSONStorage(() => localStorage), // 省略しても localStorage
      partialize: (state) => ({ tasks: state.tasks }), // 保存する値だけ（関数は保存できない）
      version: 1,                                     // 保存する形を変えたら上げる
      merge: mergeWithSchema(z.object({ tasks: z.array(taskSchema) })), // 読み込んだ値をチェック
    },
  ),
);
```

- state が変わるたびに自動で保存し、開いたときに自動で読み込む。保存・読み込みのコードは書かない
- `merge`：persist は読み込んだ値をチェックしない。形の崩れた古いデータで画面が壊れないよう、zod でチェックしてから使う（[shared/lib/persist.ts](../src/shared/lib/persist.ts)）
- 保存された中身は DevTools の **Application → Local Storage** で見られる。型を変えて動かなくなったら、ここで消す

### React の外から使う

```ts
useTaskStore.getState().addTask(input); // イベントハンドラの外・ふつうの関数から
```

## 4-4. zod

「データはこの形」というスキーマを書き、`parse` / `safeParse` でチェックする。

### よく使う書き方

```ts
import { z } from "zod";

const taskFormSchema = z.object({
  // 文字列：前後の空白を消してから、1〜50 文字か
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(50, "50文字以内で入力してください"),

  // 任意の文字列：空でもよい
  description: z.string().trim().max(500, "500文字以内で入力してください"),

  // 選択肢：配列（as const）のどれか
  priority: z.enum(taskPriorities, { error: "優先度を選択してください" }),

  // 「空」か「日付の形」のどちらか
  dueDate: z.union([z.literal(""), z.iso.date("日付の形式が正しくありません")]),
});
```

| やりたいこと                        | 書き方                                                      |
| ----------------------------------- | ----------------------------------------------------------- |
| 必須の文字列                        | `z.string().trim().min(1, "…を入力してください")`           |
| メール                              | `z.email("形式が正しくありません")`                         |
| 正規表現                            | `z.string().regex(/^\d{3}-?\d{4}$/, "…")`                   |
| 整数・範囲                          | `z.number().int().min(0).max(9999)`                         |
| 文字列で届く数値を数値に            | `z.coerce.number()`                                         |
| 配列・1 つ以上                      | `z.array(z.string()).min(1, "1つ以上選んでください")`       |
| チェックボックスが ON               | `z.boolean().refine((v) => v, { error: "同意が必要です" })` |
| 項目同士を比べる（終了 > 開始など） | `.refine(…, { path: ["endTime"] })` / `.superRefine(…)`     |

### 型を作る

```ts
type TaskFormInput = z.input<typeof taskFormSchema>; // チェック前（フォームの入力中の値）
type TaskFormValues = z.output<typeof taskFormSchema>; // チェック後（送信で受け取る値）
type Task = z.infer<typeof taskSchema>; // z.output と同じ
```

`.transform()` や `z.coerce` を使うと、input と output の型が変わる（文字列 → 数値など）。

### チェックする

```ts
taskSchema.parse(data); // 合わなければ例外（エラー）を投げる
const result = taskSchema.safeParse(data); // 例外を投げずに結果を返す
if (result.success)
  result.data; // 正しい形のデータ
else result.error; // どこがおかしいか
```

## 4-5. React Hook Form

### 基本の形

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const {
  register, // 入力欄とつなぐ
  handleSubmit, // 送信時にチェックし、通ったときだけ onSubmit を呼ぶ
  reset, // 値を入れ直す
  formState: { errors, isSubmitting },
} = useForm<TaskFormInput, unknown, TaskFormValues>({
  resolver: zodResolver(taskFormSchema), // チェックは zod に任せる
  defaultValues: toFormInput(), // 初期値（すべての項目を書く）
});

const onSubmit = (values: TaskFormValues) => {
  addTask(values);
};

return (
  // noValidate：ブラウザ標準の吹き出しを止め、zod のエラー表示にそろえる
  <form onSubmit={handleSubmit(onSubmit)} noValidate>
    <TextField label="タイトル" {...register("title")} error={errors.title?.message} />
    <Button type="submit">追加</Button>
  </form>
);
```

`{...register("title")}` は `name`・`onChange`・`onBlur`・`ref` をまとめて渡している。中身が普通の `<input>` の部品なら、そのまま渡せる。

### 入力の種類ごとの注意

| 入力                           | 書き方・注意                                                               |
| ------------------------------ | -------------------------------------------------------------------------- |
| 数値（`type="number"`）        | `register("quantity", { valueAsNumber: true })`。空欄は `NaN` で届く       |
| ラジオボタン                   | `register("priority")`。値は**文字列**で届く（`valueAsNumber` は効かない） |
| チェックボックス 1 つ          | `true` / `false` で届く                                                    |
| チェックボックス複数           | 同じ名前で register すると配列で届く（`defaultValues` は `[]`）            |
| 日付（`type="date"`）          | `"2026-10-03"` の文字列で届く。未入力は `""`                               |
| 値を自分で持つ部品（画像など） | `<Controller control={control} name="image" render={({ field }) => …} />`  |

### つまずき

- **`defaultValues` は最初の 1 回だけ使われる**。モーダルを開き直す・別のタスクを編集するときは、`reset(新しい値)` するか、`key` を変えてフォームを作り直す。このアプリは `useEffect` で開くたびに `reset` している（[TaskFormModal.tsx](../src/features/task-form/ui/TaskFormModal.tsx)）
- `<form>` の外に送信ボタンを置くときは、`<form id={formId}>` と `<button type="submit" form={formId}>` で結びつける（Modal の footer など）
- `Button` 部品の `type` の初期値は `"button"`。送信ボタンには `type="submit"` を書く
- 入力中の値を画面に出したいときは `useWatch({ control, name: "quantity" })`

---

> 次：[5. 実装手順](05-implementation.md)
