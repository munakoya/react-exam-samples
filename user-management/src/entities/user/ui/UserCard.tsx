import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { formatDate } from "@/shared/lib";
import { departmentLabels, type User } from "../model/user";
import { UserAvatar } from "./UserAvatar";
import { UserRoleChip, UserStatusChip } from "./UserChips";

/**
 * ユーザー1人分のカード ── entities/user/ui
 *
 * entities の UI は「見せ方」だけを持ち、操作（編集・削除ボタン）は持たない。
 * 操作は外から actions で差し込む（widgets で features のボタンを渡す）。
 *
 *   <UserCard user={user} actions={<><Button onClick={…}>編集</Button><DeleteUserButton user={user} /></>} />
 */

type UserCardProps = {
  user: User;
  /** 下部に置くボタンなど */
  actions?: ReactNode;
};

export const UserCard = ({ user, actions }: UserCardProps) => {
  return (
    // height: 100%：Grid の同じ行のカードの高さをそろえる。flex で actions を下に寄せる
    <Card component="article" sx={{ height: "100%", display: "flex", flexDirection: "column", opacity: user.active ? 1 : 0.7 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
          <UserAvatar name={user.name} active={user.active} />
          {/* minWidth: 0：長いメールアドレスでカードがはみ出さないように（flex の子は縮まないため） */}
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap title={user.email}>
              {user.email}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
          <UserRoleChip role={user.role} />
          <UserStatusChip active={user.active} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
            {departmentLabels[user.department]}・{formatDate(user.joinedAt)} 入社
          </Typography>
        </Stack>
      </CardContent>

      {actions && (
        <CardActions sx={{ justifyContent: "flex-end", borderTop: 1, borderColor: "divider" }}>{actions}</CardActions>
      )}
    </Card>
  );
};
