import { Stack, TextField } from "@/shared/ui";

// hint：入力欄の下の補足説明 / error：エラー文（赤枠になり、hint の代わりに表示される）
export default function TextFieldHintAndError() {
  return (
    <Stack gap={4}>
      <TextField label="メールアドレス" type="email" hint="ログインに使います" />
      <TextField label="パスワード" type="password" error="8文字以上で入力してください" />
    </Stack>
  );
}
