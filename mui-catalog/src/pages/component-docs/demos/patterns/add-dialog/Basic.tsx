import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogForm, EmptyState, FormTextField, notify, PageHeader, useFormDialog } from "@/shared/ui";

// ---------- 型と入力チェック（アプリでは entities・features/xxx-form/model に置く） ----------
const roleLabels = { admin: "管理者", editor: "編集者", viewer: "閲覧者" } as const;
type Role = keyof typeof roleLabels;

const schema = z.object({
  name: z.string().trim().min(1, "名前を入力してください").max(30, "30文字以内で入力してください"),
  email: z.email("メールアドレスの形式が正しくありません"),
  role: z.enum(["admin", "editor", "viewer"]),
});
type FormValues = z.infer<typeof schema>;
type Member = FormValues & { id: string };

// ---------- 画面（アプリでは pages） ----------
export default function AddDialogBasic() {
  const [members, setMembers] = useState<Member[]>([]);
  // open と「追加か編集か」を持つ（追加だけなら openNew と close しか使わない）
  const dialog = useFormDialog<Member>();

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>
      追加
    </Button>
  );

  return (
    <Stack spacing={2}>
      <PageHeader title="メンバー" action={addButton} />

      {members.length === 0 ? (
        <EmptyState title="まだメンバーがいません" description="「追加」から登録してください。" action={addButton} />
      ) : (
        <Paper variant="outlined">
          <List dense>
            {members.map((member) => (
              <ListItem key={member.id} divider>
                <ListItemText primary={`${member.name}（${roleLabels[member.role]}）`} secondary={member.email} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Dialog の中身（MemberForm）は閉じると消え、開くたびに作り直される → 毎回空のフォームから始まる */}
      <Dialog open={dialog.open} onClose={dialog.close} maxWidth="xs" fullWidth>
        <MemberForm
          onDone={dialog.close}
          onSubmit={(values) => {
            setMembers((prev) => [{ ...values, id: crypto.randomUUID() }, ...prev]);
            notify(`「${values.name}」を追加しました`);
          }}
        />
      </Dialog>
    </Stack>
  );
}

// ---------- ダイアログの中のフォーム（アプリでは features/xxx-form/ui） ----------
function MemberForm({ onSubmit, onDone }: { onSubmit: (values: FormValues) => void; onDone: () => void }) {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "viewer" },
  });

  return (
    <DialogForm
      title="メンバーを追加"
      submitLabel="追加"
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        onDone(); // 送信できたら閉じる（エラーがあれば handleSubmit がここまで来させない）
      })}
      onCancel={onDone}
    >
      <FormTextField control={control} name="name" label="名前" required autoFocus />
      <FormTextField control={control} name="email" label="メールアドレス" type="email" required />
      <FormTextField control={control} name="role" label="権限" select>
        {Object.entries(roleLabels).map(([value, label]) => (
          <MenuItem key={value} value={value as Role}>
            {label}
          </MenuItem>
        ))}
      </FormTextField>
    </DialogForm>
  );
}
