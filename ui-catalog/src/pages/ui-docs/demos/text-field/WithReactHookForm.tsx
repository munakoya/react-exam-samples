import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, Button, Stack, TextField } from "@/shared/ui";

// 入力チェックは zod のスキーマにまとめる
const schema = z.object({
  name: z.string().trim().min(1, "名前を入力してください"),
  email: z.email("メールアドレスの形式で入力してください"),
});

type FormValues = z.infer<typeof schema>;

// React Hook Form では register をそのまま渡せる（中の <input> に ref が届く）
export default function TextFieldWithReactHookForm() {
  const [submitted, setSubmitted] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  // チェックを通ったときだけ呼ばれる
  const onSubmit = (values: FormValues) => {
    setSubmitted(values.name);
    reset();
  };

  return (
    // noValidate：ブラウザ標準の吹き出しを出さず、zod のエラー表示にそろえる
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={4}>
        {submitted && <Alert tone="success">「{submitted}」さんを登録しました</Alert>}
        <TextField label="名前" {...register("name")} error={errors.name?.message} />
        <TextField
          label="メールアドレス"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Stack direction="row" justify="end">
          <Button type="submit">登録</Button>
        </Stack>
      </Stack>
    </form>
  );
}
