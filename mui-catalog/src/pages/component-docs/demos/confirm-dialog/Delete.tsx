import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/ui";

type Item = { id: number; name: string };

const initialItems: Item[] = [
  { id: 1, name: "ボールペン" },
  { id: 2, name: "ノート" },
  { id: 3, name: "クリップ" },
];

// 「どれを消すか」を state に持ち、null でなければダイアログを開く
export default function ConfirmDialogDelete() {
  const [items, setItems] = useState(initialItems);
  const [target, setTarget] = useState<Item | null>(null);

  const handleDelete = () => {
    if (!target) return;
    setItems((prev) => prev.filter((item) => item.id !== target.id));
    setTarget(null);
  };

  return (
    <>
      <List sx={{ maxWidth: 360 }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            divider
            secondaryAction={
              <IconButton edge="end" aria-label={`${item.name}を削除`} onClick={() => setTarget(item)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      <ConfirmDialog
        open={target !== null}
        title="削除しますか？"
        message={target ? `「${target.name}」を削除します。この操作は取り消せません。` : ""}
        onConfirm={handleDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
