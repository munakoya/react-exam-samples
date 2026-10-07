import { zodResolver } from "@hookform/resolvers/zod";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmDialog, DataTable, DialogForm, FormTextField, notify, useFormDialog, type DataTableColumn } from "@/shared/ui";

type Member = { id: string; name: string; department: string; joinedAt: string; active: boolean };

const departments = ["営業部", "開発部", "人事部"];
const lastNames = ["佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺", "山本", "中村", "小林", "加藤", "吉田", "山田"];
// 見本用のデータ（12人。ページ送りを試せるように 5件ずつ表示する）
const initialMembers: Member[] = lastNames.map((name, index) => ({
  id: String(index + 1),
  name,
  department: departments[index % departments.length],
  joinedAt: `20${String(14 + index).padStart(2, "0")}-04-01`,
  active: index % 4 !== 3,
}));

// 列の定義：見出し・セルの中身・並び替えに使う値（sortValue を渡した列だけ並び替えられる）
const columns: DataTableColumn<Member>[] = [
  { key: "name", label: "名前", render: (m) => m.name, sortValue: (m) => m.name },
  { key: "department", label: "部署", render: (m) => m.department, sortValue: (m) => m.department },
  { key: "joinedAt", label: "入社日", render: (m) => m.joinedAt.replaceAll("-", "/"), sortValue: (m) => m.joinedAt },
  {
    key: "active",
    label: "状態",
    render: (m) => <Chip size="small" color={m.active ? "success" : "default"} label={m.active ? "有効" : "無効"} />,
  },
];

const nameSchema = z.object({ name: z.string().trim().min(1, "名前を入力してください") });
type NameForm = z.infer<typeof nameSchema>;

export default function SelectableTableBasic() {
  const [members, setMembers] = useState(initialMembers);
  // 選択中の id は表の外（一括操作のボタン）でも使うので、親が持つ
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // 削除の確認：閉じても中身（deleteTarget）は残す（閉じるアニメーションの間に文言が変わらないように）
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ ids: [] as string[], label: "" });
  const openConfirm = (ids: string[], label: string) => {
    setDeleteTarget({ ids, label });
    setConfirmOpen(true);
  };
  const dialog = useFormDialog<Member>();

  const removeMembers = (ids: string[]) => {
    setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const setActive = (ids: string[], active: boolean) =>
    setMembers((prev) => prev.map((m) => (ids.includes(m.id) ? { ...m, active } : m)));

  return (
    <>
      <DataTable
        ariaLabel="メンバー一覧"
        rows={members}
        columns={columns}
        getRowLabel={(m) => m.name}
        defaultSort={{ key: "joinedAt", order: "desc" }}
        pageSize={5}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        // 1件以上選ぶと、表の上の帯に出る
        selectionActions={(ids) => (
          <>
            <Button size="small" variant="outlined" onClick={() => setActive(ids, true)}>
              有効にする
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => openConfirm(ids, `選択した ${ids.length}人`)}
            >
              削除
            </Button>
          </>
        )}
        // 行の右端の操作
        rowActions={(m) => (
          <>
            <Tooltip title="編集">
              <IconButton size="small" aria-label={`「${m.name}」を編集`} onClick={() => dialog.openEdit(m)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="削除">
              <IconButton
                size="small"
                color="error"
                aria-label={`「${m.name}」を削除`}
                onClick={() => openConfirm([m.id], `「${m.name}」`)}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      />

      {/* 削除の確認（1件・まとめての両方） */}
      <ConfirmDialog
        open={confirmOpen}
        title="削除しますか？"
        message={`${deleteTarget.label}を削除します。この操作は取り消せません。`}
        onConfirm={() => {
          removeMembers(deleteTarget.ids);
          notify(`${deleteTarget.label}を削除しました`);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* 編集ダイアログ（ここでは名前だけ） */}
      <Dialog open={dialog.open} onClose={dialog.close} maxWidth="xs" fullWidth>
        {dialog.target && (
          <EditNameForm
            member={dialog.target}
            onDone={dialog.close}
            onSubmit={(values) => {
              const id = dialog.target?.id;
              setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...values } : m)));
              notify(`「${values.name}」に変更しました`);
            }}
          />
        )}
      </Dialog>
    </>
  );
}

function EditNameForm({ member, onSubmit, onDone }: { member: Member; onSubmit: (values: NameForm) => void; onDone: () => void }) {
  const { control, handleSubmit } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: member.name },
  });

  return (
    <DialogForm
      title="名前を編集"
      submitLabel="更新"
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        onDone();
      })}
      onCancel={onDone}
    >
      <FormTextField control={control} name="name" label="名前" required autoFocus />
    </DialogForm>
  );
}
