import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link as RouterLink } from "react-router";
import { UserCard, type User } from "@/entities/user";
import { DeleteUserButton } from "@/features/delete-user";

/**
 * ユーザーのカード一覧（スマホ 1列・600px〜 2列・900px〜 3列） ── widgets/user-card-grid/ui
 *
 * entities の UserCard に、操作（詳細・編集・削除）を actions で差し込む。
 * 「編集」を押したら onEdit でページに伝え、ページが編集ダイアログを開く。
 *
 *   <UserCardGrid users={visibleUsers} onEdit={dialog.openEdit} />
 */

type UserCardGridProps = {
  users: User[];
  onEdit: (user: User) => void;
};

export const UserCardGrid = ({ users, onEdit }: UserCardGridProps) => {
  return (
    <Grid container spacing={2} component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
      {users.map((user) => (
        <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }} component="li">
          <UserCard
            user={user}
            actions={
              <>
                <Button size="small" component={RouterLink} to={`/users/${user.id}`} sx={{ mr: "auto" }}>
                  詳細
                </Button>
                <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => onEdit(user)}>
                  編集
                </Button>
                <DeleteUserButton user={user} />
              </>
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};
