import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const shippingMethods = ["normal", "express"] as const;

const schema = z.object({
  // "" で始めて、選ばれていなければエラーにする
  shipping: z.string().pipe(z.enum(shippingMethods, { error: "配送方法を選んでください" })),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

// RadioGroup は value と onChange をそのまま受け取れるので、{...field} を渡すだけでよい
export default function RadioGroupWithReactHookForm() {
  const [submitted, setSubmitted] = useState("");
  const { control, handleSubmit } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { shipping: "" },
  });

  return (
    <Stack
      component="form"
      spacing={1}
      onSubmit={handleSubmit((values) => setSubmitted(values.shipping))}
      noValidate
      sx={{ alignItems: "flex-start" }}
    >
      {submitted && <Alert severity="success">配送方法：{submitted}</Alert>}
      <Controller
        name="shipping"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.error !== undefined}>
            <FormLabel id="shipping-label">配送方法</FormLabel>
            <RadioGroup {...field} aria-labelledby="shipping-label">
              <FormControlLabel value="normal" control={<Radio />} label="通常配送（無料）" />
              <FormControlLabel value="express" control={<Radio />} label="お急ぎ便（500円）" />
            </RadioGroup>
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Button type="submit" variant="contained">
        確定
      </Button>
    </Stack>
  );
}
