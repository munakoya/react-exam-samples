import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { departmentLabels, UserAvatar, UserRoleChip, UserStatusChip, useUserStore, type User } from "@/entities/user";
import { DeleteUserButton } from "@/features/delete-user";
import { UserFormDialog } from "@/features/user-form";
import { formatDate, formatDateTime } from "@/shared/lib";
import { DescriptionList, EmptyState, PageHeader, useFormDialog } from "@/shared/ui";

/**
 * ユーザーの詳細ページ（/users/:id） ── pages/user-detail/ui
 *
 * 一覧と同じ UserFormDialog・DeleteUserButton を使い回す。
 * 削除したら onDeleted で一覧へ戻る（消したユーザーのページに残らないように）。
 */
export const UserDetailPage = () => {
  const { id } = useParams();
  // セレクターで1件だけ選ぶ（find が返すのは store の中の同じオブジェクトなので、無限再描画にならない）
  const user = useUserStore((state) => state.users.find((item) => item.id === id));
  const navigate = useNavigate();
  const dialog = useFormDialog<User>();

  // 削除済み・URL の打ち間違いで見つからないとき
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="ユーザーが見つかりません"
          description="削除されたか、URL が間違っています。"
          action={
            <Button component={RouterLink} to="/users" variant="contained">
              ユーザー一覧へ
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title={user.name}
          breadcrumbs={[{ label: "ユーザー一覧", to: "/users" }, { label: user.name }]}
          action={
            <Stack direction="row" spacing={1}>
              <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => dialog.openEdit(user)}>
                編集
              </Button>
              <DeleteUserButton user={user} variant="button" onDeleted={() => navigate("/users", { replace: true })} />
            </Stack>
          }
        />

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
            <UserAvatar name={user.name} active={user.active} />
            <Typography color="text.secondary">{user.email}</Typography>
          </Stack>
          <DescriptionList
            items={[
              { term: "権限", description: <UserRoleChip role={user.role} /> },
              { term: "部署", description: departmentLabels[user.department] },
              { term: "入社日", description: formatDate(user.joinedAt) },
              { term: "状態", description: <UserStatusChip active={user.active} /> },
              { term: "更新日時", description: formatDateTime(user.updatedAt) },
            ]}
          />
        </Paper>
      </Stack>

      <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
    </Container>
  );
};
