import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { departmentLabels, UserAvatar, UserRoleChip, type User } from "@/entities/user";
import { ChangeUsersStatusButtons, UserActiveSwitch } from "@/features/change-user-status";
import { DeleteUserButton, DeleteUsersButton } from "@/features/delete-user";
import { formatDate } from "@/shared/lib";
import { DataTable, type DataTableColumn } from "@/shared/ui";

/**
 * ユーザーの表（チェックボックスで選択・一括操作・行ごとの編集／削除） ── widgets/user-table/ui
 *
 * shared/ui の DataTable に、entities の見せ方（Chip・Avatar）と features の操作（削除・有効／無効）を差し込む。
 * 「編集」のダイアログはページが持っているので、押されたことを onEdit で伝えるだけにする。
 *
 *   <UserTable users={visibleUsers} onEdit={dialog.openEdit} />
 *
 * どの行を選んでいるか（selectedIds）は、この表の中だけで使うので useState。
 */

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
};

// 列の定義（どの列に何を出すか）。コンポーネントの外に置くと、描画のたびに作り直さない
const columns: DataTableColumn<User>[] = [
  {
    key: "name",
    label: "名前",
    minWidth: 220,
    sortValue: (user) => user.name,
    render: (user) => (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <UserAvatar name={user.name} active={user.active} />
        <Stack sx={{ minWidth: 0 }}>
          {/* 名前を押すと詳細ページへ */}
          <Link component={RouterLink} to={`/users/${user.id}`} sx={{ fontWeight: 700 }}>
            {user.name}
          </Link>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Stack>
      </Stack>
    ),
  },
  { key: "role", label: "権限", sortValue: (user) => user.role, render: (user) => <UserRoleChip role={user.role} /> },
  {
    key: "department",
    label: "部署",
    minWidth: 80,
    sortValue: (user) => departmentLabels[user.department],
    render: (user) => departmentLabels[user.department],
  },
  { key: "joinedAt", label: "入社日", minWidth: 100, sortValue: (user) => user.joinedAt, render: (user) => formatDate(user.joinedAt) },
  // その場で切り替えるスイッチ（features/change-user-status）
  { key: "active", label: "有効", render: (user) => <UserActiveSwitch user={user} /> },
];

export const UserTable = ({ users, onEdit }: UserTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <DataTable
      ariaLabel="ユーザー一覧"
      rows={users}
      columns={columns}
      getRowLabel={(user) => user.name}
      defaultSort={{ key: "joinedAt", order: "desc" }}
      pageSize={10}
      // ----- チェックボックスで選択 → 上の帯に一括操作 -----
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
      selectionActions={(ids) => (
        <>
          <ChangeUsersStatusButtons ids={ids} />
          <DeleteUsersButton ids={ids} onDeleted={() => setSelectedIds([])} />
        </>
      )}
      // ----- 行の右端：編集（ダイアログはページが開く）・削除（確認ダイアログ） -----
      rowActions={(user) => (
        <>
          <Tooltip title="編集">
            <IconButton size="small" aria-label={`「${user.name}」を編集`} onClick={() => onEdit(user)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <DeleteUserButton user={user} />
        </>
      )}
    />
  );
};
