import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormTextField } from "@/shared/ui";

const schema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください").max(30, "30文字以内で入力してください"),
  memo: z.string().max(100, "100文字以内で入力してください"),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = { title: "", memo: "" };

// ダイアログの中のフォーム（追加・編集でよく使う形）。
// <form> で DialogContent と DialogActions を包み、送信ボタンを type="submit" にする
export default function DialogForm() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<(FormValues & { id: string })[]>([]);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const handleClose = () => setOpen(false);

  const onSubmit = (values: FormValues) => {
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), ...values }]);
    handleClose();
  };

  return (
    <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        タスクを追加
      </Button>
      <List dense>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemText primary={task.title} secondary={task.memo || "メモなし"} />
          </ListItem>
        ))}
      </List>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        // 閉じるアニメーションが終わってから入力をリセットする（閉じる途中で中身が消えて見えないように）
        slotProps={{ transition: { onExited: () => reset(emptyValues) } }}
      >
        <DialogTitle>タスクを追加</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            <Stack spacing={2}>
              {/* FormTextField：Controller と TextField をまとめた shared/ui の部品 */}
              <FormTextField control={control} name="title" label="タイトル" required autoFocus />
              <FormTextField control={control} name="memo" label="メモ" multiline minRows={3} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit" variant="contained">
              追加
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Stack>
  );
}
