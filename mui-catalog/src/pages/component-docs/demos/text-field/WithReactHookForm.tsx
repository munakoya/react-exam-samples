import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "名前を入力してください"),
  // 入力欄の値は type="number" でも文字列で届く。文字列でチェックしてから number に変換する
  age: z
    .string()
    .min(1, "年齢を入力してください")
    .regex(/^\d+$/, "0以上の整数で入力してください")
    .transform(Number),
});

// 入力中の値（文字列）と、チェック後の値（数値）で型が違うので、両方を用意する
type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

// MUI の入力欄は Controller でつなぐ。
// field（value・onChange・onBlur・ref）を渡し、エラーは fieldState から取り出す
export default function TextFieldWithReactHookForm() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const { control, handleSubmit, reset } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", age: "" },
  });

  const onSubmit = (values: FormValues) => {
    setSubmitted(values);
    reset();
  };

  return (
    // noValidate：ブラウザ標準の吹き出しを出さず、zod のエラー表示にそろえる
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ maxWidth: 360 }}>
      {submitted && (
        <Alert severity="success">
          {submitted.name}さん（{submitted.age}歳）を登録しました
        </Alert>
      )}
      <Controller
        name="name"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => (
          <TextField
            {...field}
            inputRef={ref} // ref は中の <input> へ渡す（エラー時にフォーカスが移る）
            label="名前"
            required
            error={fieldState.error !== undefined}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="age"
        control={control}
        render={({ field: { ref, ...field }, fieldState }) => (
          <TextField
            {...field}
            inputRef={ref}
            label="年齢"
            type="number"
            error={fieldState.error !== undefined}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit" variant="contained">
        登録
      </Button>
    </Stack>
  );
}
