import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, Button, RadioGroup, Stack, Switch } from "@/shared/ui";

const schema = z.object({
  // 未選択（""）のときにエラーにする
  size: z.string().min(1, "サイズを選択してください"),
  giftWrap: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// RadioGroup・Switch にも register をそのまま渡せる
export default function RadioGroupWithReactHookForm() {
  const [result, setResult] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { size: "", giftWrap: false },
  });

  const onSubmit = (values: FormValues) => {
    setResult(`サイズ：${values.size} / ギフト包装：${values.giftWrap ? "あり" : "なし"}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={4}>
        {result && <Alert tone="success">{result}</Alert>}
        <RadioGroup
          label="サイズ"
          direction="row"
          options={[
            { value: "S", label: "S" },
            { value: "M", label: "M" },
            { value: "L", label: "L" },
          ]}
          {...register("size")}
          error={errors.size?.message}
        />
        <Switch label="ギフト包装をする" {...register("giftWrap")} />
        <Stack direction="row" justify="end">
          <Button type="submit">注文内容を確認</Button>
        </Stack>
      </Stack>
    </form>
  );
}
