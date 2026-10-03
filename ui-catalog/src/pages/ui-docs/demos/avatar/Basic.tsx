import { Avatar, Stack } from "@/shared/ui";

const users = [
  { id: "1", name: "山田 太郎" },
  { id: "2", name: "佐藤 花子" },
  { id: "3", name: "Suzuki Ken" },
];

// 画像（src）がなければ名前の1文字目を出す。背景色は名前から決まる（同じ名前ならいつも同じ色）
export default function AvatarBasic() {
  return (
    <Stack gap={3}>
      <Stack direction="row" gap={3} align="center">
        <Avatar name="山田 太郎" size="sm" />
        <Avatar name="山田 太郎" />
        <Avatar name="山田 太郎" size="lg" />
      </Stack>
      {/* 一覧で名前と並べる */}
      <Stack gap={2}>
        {users.map((user) => (
          <Stack key={user.id} direction="row" gap={2} align="center">
            <Avatar name={user.name} size="sm" />
            <span>{user.name}</span>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
