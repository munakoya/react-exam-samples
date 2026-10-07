import Avatar from "@mui/material/Avatar";

/**
 * 名前の1文字目を出すアイコン ── entities/user/ui
 *
 * 画像がないときは children に文字を渡す。無効なユーザーは灰色にする。
 */
export const UserAvatar = ({ name, active = true }: { name: string; active?: boolean }) => (
  <Avatar sx={{ bgcolor: active ? "primary.main" : "grey.400", width: 40, height: 40 }}>{name.charAt(0)}</Avatar>
);
