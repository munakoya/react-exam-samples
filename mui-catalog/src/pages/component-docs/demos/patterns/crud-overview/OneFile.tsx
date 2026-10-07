import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ConfirmDialog,
  DataTable,
  DialogForm,
  EmptyState,
  FormTextField,
  notify,
  PageHeader,
  useFormDialog,
  type DataTableColumn,
} from "@/shared/ui";

/*
 * CRUD 画面を 1ファイルで書いた形。サンプルアプリ（ユーザー管理）では、同じものを層に分けている。
 *   型・選択肢・store          → entities/user
 *   フォーム（スキーマ・ダイアログ）→ features/user-form
 *   削除ボタン＋確認            → features/delete-user
 *   表（列の定義・選択・操作）  → widgets/user-table
 *   画面の組み立て              → pages/user-list
 */

// ===== entities：型と選択肢 =====
const roleLabels = { admin: "管理者", editor: "編集者", viewer: "閲覧者" } as const;
const roles = ["admin", "editor", "viewer"] as const;
type Member = { id: string; name: string; email: string; role: (typeof roles)[number] };

// ===== features/member-form/model：入力チェックと初期値 =====
const schema = z.object({
  name: z.string().trim().min(1, "名前を入力してください").max(30, "30文字以内で入力してください"),
  email: z.email("メールアドレスの形式が正しくありません"),
  role: z.enum(roles),
});
type FormValues = z.infer<typeof schema>;

const toFormValues = (member?: Member): FormValues => ({
  name: member?.name ?? "",
  email: member?.email ?? "",
  role: member?.role ?? "viewer",
});

// ===== widgets/member-table：列の定義 =====
const columns: DataTableColumn<Member>[] = [
  { key: "name", label: "名前", render: (m) => m.name, sortValue: (m) => m.name },
  { key: "email", label: "メール", render: (m) => m.email, sortValue: (m) => m.email },
  { key: "role", label: "権限", render: (m) => <Chip size="small" label={roleLabels[m.role]} /> },
];

const initialMembers: Member[] = [
  { id: "1", name: "佐藤 花子", email: "hanako@example.com", role: "admin" },
  { id: "2", name: "鈴木 一郎", email: "ichiro@example.com", role: "editor" },
  { id: "3", name: "高橋 美咲", email: "misaki@example.com", role: "viewer" },
];

// ===== pages/member-list：画面 =====
export default function CrudOneFile() {
  // アプリでは Zustand の store（entities/user/model/userStore.ts）
  const [members, setMembers] = useState(initialMembers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const formDialog = useFormDialog<Member>(); // 追加・編集のダイアログ
  const [confirmOpen, setConfirmOpen] = useState(false); // 削除の確認
  const [deleteTargets, setDeleteTargets] = useState<Member[]>([]);

  // ----- C・U：追加・更新 -----
  const save = (values: FormValues) => {
    const editing = formDialog.target;
    if (editing) {
      setMembers((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...values } : m)));
      notify(`「${values.name}」を更新しました`);
    } else {
      setMembers((prev) => [{ ...values, id: crypto.randomUUID() }, ...prev]);
      notify(`「${values.name}」を追加しました`);
    }
  };

  // ----- D：削除（確認してから） -----
  const askDelete = (targets: Member[]) => {
    setDeleteTargets(targets);
    setConfirmOpen(true);
  };
  const remove = () => {
    const ids = deleteTargets.map((m) => m.id);
    setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    notify(`${deleteTargets.length}人を削除しました`);
    setConfirmOpen(false);
  };

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={formDialog.openNew}>
      追加
    </Button>
  );

  return (
    <Stack spacing={2}>
      <PageHeader title="メンバー一覧" action={addButton} />

      {/* ----- R：一覧 ----- */}
      {members.length === 0 ? (
        <EmptyState title="メンバーがいません" action={addButton} />
      ) : (
        <DataTable
          ariaLabel="メンバー一覧"
          rows={members}
          columns={columns}
          getRowLabel={(m) => m.name}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          selectionActions={(ids) => (
            <Button size="small" variant="contained" color="error" onClick={() => askDelete(members.filter((m) => ids.includes(m.id)))}>
              削除
            </Button>
          )}
          rowActions={(m) => (
            <>
              <Tooltip title="編集">
                <IconButton size="small" aria-label={`「${m.name}」を編集`} onClick={() => formDialog.openEdit(m)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="削除">
                <IconButton size="small" color="error" aria-label={`「${m.name}」を削除`} onClick={() => askDelete([m])}>
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        />
      )}

      <Dialog open={formDialog.open} onClose={formDialog.close} maxWidth="xs" fullWidth>
        <MemberForm member={formDialog.target} onSubmit={save} onDone={formDialog.close} />
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="削除しますか？"
        message={
          deleteTargets.length === 1
            ? `「${deleteTargets[0].name}」を削除します。この操作は取り消せません。`
            : `選択した ${deleteTargets.length}人 を削除します。この操作は取り消せません。`
        }
        onConfirm={remove}
        onCancel={() => setConfirmOpen(false)}
      />
    </Stack>
  );
}

// ===== features/member-form/ui：ダイアログの中のフォーム（開くたびに作り直される） =====
type MemberFormProps = { member?: Member; onSubmit: (values: FormValues) => void; onDone: () => void };

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
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {roleLabels[role]}
          </MenuItem>
        ))}
      </FormTextField>
    </DialogForm>
  );
}
