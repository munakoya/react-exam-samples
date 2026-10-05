import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormTextField } from "@/shared/ui";

const schema = z.object({
  name: z.string().trim().min(1, "名前を入力してください"),
  email: z.email("メールアドレスの形式で入力してください"),
  category: z.string().min(1, "種類を選択してください"),
});

type FormValues = z.infer<typeof schema>;

// control と name を渡すだけで、値・エラー表示までつながる（Controller を毎回書かなくてよい）
export default function FormTextFieldBasic() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", category: "" },
  });

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(setSubmitted)} noValidate sx={{ maxWidth: 360 }}>
      {submitted && <Alert severity="success">{submitted.name}さん（{submitted.category}）を登録しました</Alert>}
      <FormTextField control={control} name="name" label="名前" required />
      <FormTextField control={control} name="email" label="メールアドレス" type="email" required />
      {/* select を付けるとセレクトボックスになる */}
      <FormTextField control={control} name="category" label="種類" select required>
        <MenuItem value="個人">個人</MenuItem>
        <MenuItem value="法人">法人</MenuItem>
      </FormTextField>
      <Button type="submit" variant="contained">
        登録
      </Button>
    </Stack>
  );
}
