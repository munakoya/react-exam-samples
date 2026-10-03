import { useState } from "react";
import { SegmentedControl, Stack } from "@/shared/ui";

type Filter = "all" | "active" | "completed";

const todos = [
  { id: "1", title: "牛乳を買う", completed: true },
  { id: "2", title: "レポートを書く", completed: false },
  { id: "3", title: "部屋を掃除する", completed: false },
];

// 絞り込みの切り替え。value の型（Filter）が onChange の引数の型にもなる
export default function SegmentedControlFilter() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTodos = todos.filter((todo) =>
    filter === "all" ? true : filter === "completed" ? todo.completed : !todo.completed,
  );

  return (
    <Stack gap={3} align="start">
      <SegmentedControl
        label="表示する Todo"
        options={[
          { value: "all", label: "すべて" },
          { value: "active", label: "未完了" },
          { value: "completed", label: "完了" },
        ]}
        value={filter}
        onChange={setFilter}
      />
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </Stack>
  );
}
