import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, Button, ImageField, Stack, TextField } from "@/shared/ui";

const schema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください"),
  image: z.string().min(1, "写真を選んでください"), // data URL。未選択は ""
});

type FormValues = z.infer<typeof schema>;

// ImageField は値を親が持つ部品（<input> に register を渡せない）なので、Controller でつなぐ。
// render の field に value と onChange、fieldState にエラーが入っている
export default function ImageFieldWithController() {
  const [submitted, setSubmitted] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", image: "" },
  });

  return (
    <form onSubmit={handleSubmit((values) => setSubmitted(values.title))} noValidate>
      <Stack gap={4}>
        {submitted && <Alert tone="success">「{submitted}」を登録しました</Alert>}
        <TextField label="タイトル" {...register("title")} error={errors.title?.message} />
        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <ImageField
              label="写真"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <Stack direction="row">
          <Button type="submit">登録</Button>
        </Stack>
      </Stack>
    </form>
  );
}
