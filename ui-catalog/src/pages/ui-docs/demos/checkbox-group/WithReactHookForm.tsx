import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, Button, CheckboxGroup, Stack } from "@/shared/ui";

const courseIds = ["math", "english", "science"] as const;
const courses = [
  { value: "math", label: "数学" },
  { value: "english", label: "英語" },
  { value: "science", label: "理科" },
];

// register を渡すと、選んだ value の配列で届く。初期値は [] にしておく
// ⚠ 選択肢が1つだけのときは、配列ではなく true / false で届く（React Hook Form の仕様）
const schema = z.object({
  courses: z.array(z.enum(courseIds)).min(1, "1つ以上選んでください"),
});

type FormValues = z.infer<typeof schema>;

export default function CheckboxGroupWithReactHookForm() {
  const [submitted, setSubmitted] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { courses: [] },
  });

  return (
    <form onSubmit={handleSubmit((values) => setSubmitted(values.courses.join(", ")))} noValidate>
      <Stack gap={3}>
        {submitted && <Alert tone="success">受講する講座：{submitted}</Alert>}
        <CheckboxGroup
          label="受講する講座"
          options={courses}
          {...register("courses")}
          error={errors.courses?.message}
        />
        <Stack direction="row">
          <Button type="submit">登録</Button>
        </Stack>
      </Stack>
    </form>
  );
}
