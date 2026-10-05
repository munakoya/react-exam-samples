import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  // true でなければエラーにする
  agreed: z.boolean().refine((value) => value, "利用規約への同意が必要です"),
});

type FormValues = z.infer<typeof schema>;

// Controller でつなぐ。チェック系は field.value を checked に渡し、
// onChange では event.target.checked（true / false）を field.onChange に渡す
export default function CheckboxWithReactHookForm() {
  const [done, setDone] = useState(false);
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { agreed: false },
  });

  return (
    <Stack component="form" spacing={1} onSubmit={handleSubmit(() => setDone(true))} noValidate sx={{ alignItems: "flex-start" }}>
      {done && <Alert severity="success">送信しました</Alert>}
      <Controller
        name="agreed"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.error !== undefined}>
            <FormControlLabel
              label="利用規約に同意する"
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                  slotProps={{ input: { ref: field.ref } }} // ref は中の <input> へ（v9 では inputRef の代わり）
                />
              }
            />
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Button type="submit" variant="contained">
        送信
      </Button>
    </Stack>
  );
}
