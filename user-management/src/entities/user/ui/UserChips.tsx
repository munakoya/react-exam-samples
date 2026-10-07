import Chip from "@mui/material/Chip";
import { userRoleLabels, type UserRole } from "../model/user";

/**
 * 権限・状態のラベル（MUI の Chip） ── entities/user/ui
 *
 * 色の決め方をここにまとめておくと、表・カード・詳細で同じ見た目になる。
 */

const roleColors: Record<UserRole, "secondary" | "primary" | "default"> = {
  admin: "secondary",
  editor: "primary",
  viewer: "default",
};

export const UserRoleChip = ({ role }: { role: UserRole }) => (
  <Chip size="small" variant="outlined" color={roleColors[role]} label={userRoleLabels[role]} />
);

export const UserStatusChip = ({ active }: { active: boolean }) => (
  <Chip size="small" color={active ? "success" : "default"} label={active ? "有効" : "無効"} />
);
