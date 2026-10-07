import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogForm, FormTextField, notify, useFormDialog } from "@/shared/ui";

const roleLabels = { admin: "管理者", editor: "編集者", viewer: "閲覧者" } as const;

const schema = z.object({
  name: z.string().trim().min(1, "名前を入力してください"),
  email: z.email("メールアドレスの形式が正しくありません"),
  role: z.enum(["admin", "editor", "viewer"]),
});
type FormValues = z.infer<typeof schema>;
type Member = FormValues & { id: string };

/** フォームの初期値。member があれば今の値（編集）、なければ空（追加） */
const toFormValues = (member?: Member): FormValues => ({
  name: member?.name ?? "",
  email: member?.email ?? "",
  role: member?.role ?? "viewer",
});

const initialMembers: Member[] = [
  { id: "1", name: "佐藤 花子", email: "hanako@example.com", role: "admin" },
  { id: "2", name: "鈴木 一郎", email: "ichiro@example.com", role: "editor" },
  { id: "3", name: "高橋 美咲", email: "misaki@example.com", role: "viewer" },
];

// ---------- カード（アプリでは entities/xxx/ui。ボタンは持たず actions で受け取る） ----------
function MemberCard({ member, actions }: { member: Member; actions: ReactNode }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>{member.name}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {member.email}
        </Typography>
        <Chip size="small" label={roleLabels[member.role]} />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>{actions}</CardActions>
    </Card>
  );
}

// ---------- 画面（アプリでは pages ＋ widgets） ----------
export default function EditDialogBasic() {
  const [members, setMembers] = useState(initialMembers);
  // target が undefined なら追加、Member が入っていれば編集
  const dialog = useFormDialog<Member>();

  const handleSubmit = (values: FormValues) => {
    const editing = dialog.target;
    if (editing) {
      // id が一致するものだけ差し替える
      setMembers((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...values } : m)));
      notify(`「${values.name}」を更新しました`);
    } else {
      setMembers((prev) => [...prev, { ...values, id: crypto.randomUUID() }]);
      notify(`「${values.name}」を追加しました`);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>
          追加
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {members.map((member) => (
          <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <MemberCard
              member={member}
              actions={
                // 編集ボタン → どのメンバーかを覚えてダイアログを開く
                <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => dialog.openEdit(member)}>
                  編集
                </Button>
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* ダイアログは1つだけ。開くたびに MemberForm が作り直され、toFormValues(target) から始まる */}
      <Dialog open={dialog.open} onClose={dialog.close} maxWidth="xs" fullWidth>
        <MemberForm member={dialog.target} onSubmit={handleSubmit} onDone={dialog.close} />
      </Dialog>
    </Stack>
  );
}

// ---------- 追加・編集で共通のフォーム（アプリでは features/xxx-form/ui） ----------
type MemberFormProps = {
  member?: Member;
  onSubmit: (values: FormValues) => void;
  onDone: () => void;
};

function MemberForm({ member, onSubmit, onDone }: MemberFormProps) {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(member),
  });

  return (
    <DialogForm
      title={member ? "メンバーを編集" : "メンバーを追加"}
      submitLabel={member ? "更新" : "追加"}
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        onDone();
      })}
      onCancel={onDone}
    >
      <FormTextField control={control} name="name" label="名前" required autoFocus />
      <FormTextField control={control} name="email" label="メールアドレス" type="email" required />
      <FormTextField control={control} name="role" label="権限" select>
        {Object.entries(roleLabels).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </FormTextField>
    </DialogForm>
  );
}
