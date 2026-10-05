import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Stack from "@mui/material/Stack";

// ユーザーのアイコン。画像（src）がなければ、文字やアイコンを中に入れる
export default function AvatarBasic() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Avatar>佐</Avatar>
        <Avatar sx={{ bgcolor: "primary.main" }}>鈴</Avatar>
        <Avatar sx={{ bgcolor: "success.main" }}>
          <PersonIcon />
        </Avatar>
        {/* 大きさは sx の width・height で変える */}
        <Avatar sx={{ width: 56, height: 56, bgcolor: "secondary.main" }}>高</Avatar>
        {/* variant="rounded"：角丸の四角 */}
        <Avatar variant="rounded">田</Avatar>
      </Stack>
      {/* AvatarGroup：重ねて並べる。max を超えた分は「+2」のようにまとめる */}
      <AvatarGroup max={4} sx={{ justifyContent: "flex-end" }}>
        <Avatar>佐</Avatar>
        <Avatar>鈴</Avatar>
        <Avatar>高</Avatar>
        <Avatar>田</Avatar>
        <Avatar>伊</Avatar>
      </AvatarGroup>
    </Stack>
  );
}
