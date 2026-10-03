import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, Button, Rating, RatingField, Stack } from "@/shared/ui";

// RatingField の中身はラジオボタン。値は "4" のような文字列で届くので、z.coerce.number() で数値にする
// （ラジオボタンには register の valueAsNumber が効かない）
const schema = z.object({
  rating: z.coerce.number().int().min(1, "評価を選んでください").max(5),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export default function RatingWithReactHookForm() {
  const [submitted, setSubmitted] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 }, // 0 はどの星にも当たらないので「未選択」
  });

  return (
    <form onSubmit={handleSubmit((values) => setSubmitted(values.rating))} noValidate>
      <Stack gap={3}>
        {submitted !== null && (
          <Alert tone="success">
            {submitted}点で送信しました <Rating value={submitted} />
          </Alert>
        )}
        {/* ← → キーでも選べる */}
        <RatingField label="評価" {...register("rating")} error={errors.rating?.message} />
        <Stack direction="row">
          <Button type="submit">送信</Button>
        </Stack>
      </Stack>
    </form>
  );
}
