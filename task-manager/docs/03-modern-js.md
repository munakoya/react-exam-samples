# 3. モダン JavaScript / TypeScript

> [目次](README.md) ｜ 前：[2. 設計の考え方](02-design.md) ｜ 次：[4. ライブラリの使い方](04-libraries.md)

このアプリのコードに出てくる書き方だけを、例と一緒にまとめる。
「このアプリでは」の行に、実際に使っている場所を書いた。

## 3-1. 変数と関数

```js
const price = 100; // 再代入しない値は const（基本はこれ）
let count = 0; // 再代入する値だけ let。var は使わない
count += 1;

// アロー関数：(引数) => 戻り値
const double = (n) => n * 2;
const greet = (name) => {
  const text = `こんにちは、${name}さん`; // テンプレートリテラル：`…${式}…`
  return text;
};

// オブジェクトを返すときは ( ) で包む（{ だけだと関数の中身の始まりと区別できない）
const toOption = (value) => ({ value, label: value.toUpperCase() });
```

- `{ value, label: … }` の `value` は `value: value` の省略形（プロパティの短縮記法）
- このアプリでは：コンポーネントも action もすべてアロー関数で書いている

## 3-2. 分割代入：オブジェクト・配列から取り出す

```js
const task = { id: "1", title: "議事録", status: "todo" };

const { title, status } = task; // title = "議事録", status = "todo"
const { title: name } = task; // 別の名前で取り出す → name = "議事録"
const { priority = "medium" } = task; // なければ初期値

const [first, second] = ["a", "b", "c"]; // 配列は順番で取り出す
```

React では毎回使う。

```tsx
// props の分割代入（初期値つき）
const TaskCard = ({ task, hideStatus = false }: TaskCardProps) => { … };

// useState は [値, 変える関数] の配列を返す
const [open, setOpen] = useState(false);

// ネストしたオブジェクトからも取り出せる
const { register, formState: { errors } } = useForm(…);
```

## 3-3. スプレッド構文 `...`：コピーして一部を変える

```js
const task = { id: "1", title: "議事録", status: "todo" };

const updated = { ...task, status: "done" }; // コピーして status だけ上書き（後ろに書いた方が勝つ）
const tasks2 = [newTask, ...tasks]; // 先頭に追加した新しい配列
const tasks3 = [...tasks, newTask]; // 末尾に追加
```

### なぜ「コピーして変える」のか（イミュータブルな更新）

React と Zustand は「前と同じオブジェクトか」で、変わったかどうかを判断する。

```js
// ✗ 元の配列を書き換える → 同じ配列のままなので、画面が更新されない
state.tasks.push(newTask);
task.status = "done";

// ○ 新しい配列・オブジェクトを作る → 「変わった」と分かる
const next = [...state.tasks, newTask];
const nextTask = { ...task, status: "done" };
```

このアプリでは：[taskStore.ts](../src/entities/task/model/taskStore.ts) の action はすべて新しい配列を作っている。

```ts
// id が一致するものだけ差し替えた、新しい配列を作る
const updateById = (tasks: Task[], id: string, changes: Partial<Task>) =>
  tasks.map((task) =>
    task.id === id ? { ...task, ...changes, updatedAt: new Date().toISOString() } : task,
  );
```

## 3-4. `?.`（オプショナルチェーン）と `??`（Null 合体）

```js
const task = undefined;

task.title; // ✗ エラー：undefined の title は読めない
task?.title; // ○ undefined（task が null / undefined なら、そこで止まる）
task?.title ?? ""; // ○ ""（左が null / undefined なら右）
```

`??` と `||` の違い：`||` は `0` や `""` も「なし」扱いにする。

```js
0 || 10; // 10（0 が消える）
0 ?? 10; // 0
"" || "なし"; // "なし"
"" ?? "なし"; // ""
```

数値や空文字が「正しい値」になりうるときは `??` を使う。

このアプリでは：[schema.ts](../src/features/task-form/model/schema.ts) のフォームの初期値。

```ts
// 編集なら今の値、新規（task が undefined）なら初期値
export const toFormInput = (task?: Task): TaskFormInput => ({
  title: task?.title ?? "",
  status: task?.status ?? "todo",
  priority: task?.priority ?? "medium",
  …
});
```

## 3-5. 配列のメソッド

どれも**元の配列を変えずに**、新しい値を返す（`sort` を除く）。

```js
const tasks = [
  { id: "1", title: "A", status: "todo", priority: "high" },
  { id: "2", title: "B", status: "done", priority: "low" },
];

tasks.map((t) => t.title); // ["A", "B"] … 1 つずつ変換
tasks.filter((t) => t.status !== "done"); // [A のタスク] … 条件に合うものだけ
tasks.find((t) => t.id === "2"); // B のタスク … 最初の 1 件（なければ undefined）
tasks.some((t) => t.status === "done"); // true … 1 つでも合えば
tasks.every((t) => t.title !== ""); // true … 全部が合えば
tasks.filter((t) => t.status === "done").length; // 1 … 件数
["todo", "doing", "done"].indexOf("doing"); // 1 … 何番目か（なければ -1）
["todo", "doing"].includes("done"); // false … 含まれるか

// reduce：配列を 1 つの値にまとめる（合計など）
[100, 200, 300].reduce((sum, n) => sum + n, 0); // 600（0 が最初の値）
```

### 並び替え：`toSorted` を使う

```js
const sorted = tasks.toSorted((a, b) => a.title.localeCompare(b.title));
```

- `sort()` は**元の配列を書き換える**。store の配列に使うと state を壊すので、新しい配列を返す `toSorted()` を使う（`[...tasks].sort()` でも同じ）
- 比較関数は「a を前にしたいなら負の数、b を前にしたいなら正の数、同じなら 0」を返す
- 数値は `a - b`（小さい順）、文字列は `a.localeCompare(b)`

このアプリでは：[filterTasks.ts](../src/features/task-filter/model/filterTasks.ts)

```ts
const priorityRank = { high: 0, medium: 1, low: 2 };

const compareFns = {
  priority: (a, b) => priorityRank[a.priority] - priorityRank[b.priority], // 優先度が高い順
  createdAt: (a, b) => b.createdAt.localeCompare(a.createdAt),             // 新しい順（b と a を逆に）
};

tasks.filter(…).toSorted(compareFns[sortKey]);
```

### 配列からオブジェクトを作る：`Object.fromEntries`

```js
// [["todo", 2], ["doing", 1]] → { todo: 2, doing: 1 }
const countByStatus = Object.fromEntries(
  ["todo", "doing", "done"].map((s) => [s, tasks.filter((t) => t.status === s).length]),
);
```

## 3-6. JSX の中の条件分岐

```tsx
{task.description && <p>{task.description}</p>}       // あれば表示（&&）
{tasks.length === 0 ? <EmptyState … /> : <TaskList … />} // どちらかを表示（三項演算子）
```

⚠ `&&` の左が数値の `0` だと、画面に `0` が出る。

```tsx
{
  tasks.length && <TaskList />;
} // ✗ 0 件のとき「0」と表示される
{
  tasks.length > 0 && <TaskList />;
} // ○ 真偽値にする
```

### 一覧の `key`

```tsx
{
  tasks.map((task) => (
    <li key={task.id}>…</li> // 重複しない id を key にする。配列の番号（index）は並び替えで崩れるので避ける
  ));
}
```

## 3-7. モジュール（import / export）

```ts
// 名前付き export（このアプリはすべてこれ。名前が固定されるので検索しやすい）
export const TaskCard = () => { … };
import { TaskCard } from "@/entities/task";

// まとめて外へ出す（index.ts：窓口）
export { TaskCard } from "./ui/TaskCard";

// 型だけを読み込む（ビルド後に消える）
import type { Task } from "@/entities/task";
import { useTaskStore, type Task } from "@/entities/task"; // 値と型をまとめて
```

## 3-8. 日付と id

```js
// 重複しない id（"3b241101-e2bb-…" のような文字列）
crypto.randomUUID();

// 今の日時を ISO 形式の文字列で（保存用）
new Date().toISOString(); // "2026-10-03T09:00:00.000Z"（UTC）

// ⚠ toISOString は UTC。日本時間の 0〜9 時は「前の日」になる
new Date().toISOString().slice(0, 10); // ✗「今日」には使わない

// 今日の "YYYY-MM-DD"（端末の地域の日付）
const d = new Date();
`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//                     ↑ getMonth は 0 始まり（1 月 = 0）        ↑ padStart：2 桁にそろえる（"3" → "03"）
```

`"YYYY-MM-DD"` は桁がそろっているので、**文字列のまま大小を比べると日付の前後になる**。

```js
"2026-10-02" < "2026-10-03"; // true（期限切れの判定に使える）
```

このアプリでは：[shared/lib/date.ts](../src/shared/lib/date.ts)、[task.ts](../src/entities/task/model/task.ts) の `isOverdue`。

## 3-9. TypeScript の型

### 基本

```ts
type Task = {
  id: string;
  title: string;
  dueDate?: string; // ? は「なくてもよい」（string | undefined）
};

type TaskStatus = "todo" | "doing" | "done"; // ユニオン型：このどれか
let s: TaskStatus = "todo";
s = "finish"; // ✗ 型エラー（打ち間違いに気付ける）
```

### 配列から型を作る：`as const` ＋ `typeof`

```ts
export const taskStatuses = ["todo", "doing", "done"] as const;
//  as const がないと string[]、あると readonly ["todo", "doing", "done"]（値そのものの型）

export type TaskStatus = (typeof taskStatuses)[number];
//  typeof で「値の型」を取り出し、[number] で「中身のどれか」にする → "todo" | "doing" | "done"
```

**値（配列）と型を 1 か所で定義できる**。選択肢を足すときは配列に足すだけで、型も変わる。

### よく使う型の道具

```ts
// Record<キー, 値>：キーがすべてそろったオブジェクト（書き忘れると型エラー）
const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "未着手",
  doing: "進行中",
  done: "完了",
};

// Omit<型, キー>：キーを除く（フォームから受け取る値には id・日時がない）
type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

// Partial<型>：すべてのキーを「なくてもよい」に（一部だけ変えるとき）
const changes: Partial<Task> = { status: "done" };

// satisfies：型のチェックだけして、値の型（"danger" など）はそのまま残す
const tones = { todo: "neutral", doing: "info", done: "success" } as const satisfies Record<
  TaskStatus,
  string
>;
```

### zod のスキーマから型を作る

```ts
const taskSchema = z.object({ id: z.string(), title: z.string(), … });
type Task = z.infer<typeof taskSchema>; // { id: string; title: string; … }
```

チェックの定義と型が 1 つで済む（詳しくは [4. ライブラリ](04-libraries.md#4-4-zod)）。

### React でよく出る型

```ts
import type { ReactNode } from "react";

type Props = {
  children: ReactNode; // JSX・文字列・null など、表示できるもの全部
  onEdit: (task: Task) => void; // 関数の型：引数の型 => 戻り値の型（void は「返さない」）
};
```

---

> 次：[4. ライブラリの使い方](04-libraries.md)
