import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type Filter = "all" | "active" | "done";

const todos = [
  { id: 1, title: "牛乳を買う", done: true },
  { id: 2, title: "レポートを書く", done: false },
  { id: 3, title: "部屋を掃除する", done: false },
];

// 一覧の絞り込みなど、表示の切り替えに使う。exclusive で「1つだけ選べる」にする
export default function ToggleButtonFilter() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTodos = todos.filter((todo) =>
    filter === "all" ? true : filter === "done" ? todo.done : !todo.done,
  );

  return (
    <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
      <ToggleButtonGroup
        value={filter}
        exclusive
        // 選択中のボタンをもう一度押すと null が届く。何も選ばれていない状態を作らないよう無視する
        onChange={(_event, next: Filter | null) => {
          if (next !== null) setFilter(next);
        }}
        size="small"
        aria-label="表示する Todo"
      >
        <ToggleButton value="all">すべて</ToggleButton>
        <ToggleButton value="active">未完了</ToggleButton>
        <ToggleButton value="done">完了</ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2">{visibleTodos.map((todo) => todo.title).join("・")}</Typography>
    </Stack>
  );
}
