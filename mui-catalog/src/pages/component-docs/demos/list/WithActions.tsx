import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

type Todo = { id: number; title: string; done: boolean };

const initialTodos: Todo[] = [
  { id: 1, title: "牛乳を買う", done: false },
  { id: 2, title: "レポートを書く", done: true },
  { id: 3, title: "部屋を掃除する", done: false },
];

// 押せる行は ListItemButton、右端のボタンは ListItem の secondaryAction に置く（Todo リストの形）
export default function ListWithActions() {
  const [todos, setTodos] = useState(initialTodos);

  const toggle = (id: number) =>
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  const remove = (id: number) => setTodos((prev) => prev.filter((todo) => todo.id !== id));

  return (
    <List sx={{ maxWidth: 400 }}>
      {todos.map((todo) => {
        const labelId = `todo-label-${todo.id}`;
        return (
          <ListItem
            key={todo.id}
            disablePadding
            secondaryAction={
              <IconButton edge="end" aria-label={`「${todo.title}」を削除`} onClick={() => remove(todo.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {/* 行のどこを押してもチェックが切り替わる */}
            <ListItemButton onClick={() => toggle(todo.id)} dense>
              <ListItemIcon>
                {/* 押す処理は ListItemButton に任せるので、Checkbox は表示だけ（tabIndex={-1}） */}
                <Checkbox
                  edge="start"
                  checked={todo.done}
                  tabIndex={-1}
                  disableRipple
                  slotProps={{ input: { "aria-labelledby": labelId } }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={todo.title}
                sx={{ textDecoration: todo.done ? "line-through" : "none" }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
