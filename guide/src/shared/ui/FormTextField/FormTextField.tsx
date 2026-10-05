import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useController, type Control, type FieldPath, type FieldValues } from "react-hook-form";

/**
 * React Hook Form と MUI の TextField をつなぐ部品 ── shared/ui
 *
 * MUI の入力欄は、register ではなく useController（Controller）でつなぐのが確実。
 * 毎回同じ書き方になるので、ここにまとめておく。
 *
 *   const { control, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues });
 *
 *   <FormTextField control={control} name="title" label="タイトル" required />
 *   <FormTextField control={control} name="memo" label="メモ" multiline minRows={3} />
 *
 *   // セレクトボックスも TextField の select で作れる
 *   <FormTextField control={control} name="genre" label="ジャンル" select>
 *     <MenuItem value="novel">小説</MenuItem>
 *   </FormTextField>
 *
 * エラーメッセージ（zod のエラー）は自動で helperText に表示される。
 */

type FormTextFieldProps<TFieldValues extends FieldValues, TTransformed> = {
  /** フォームの項目名（型チェックされるので、存在しない名前は書けない） */
  name: FieldPath<TFieldValues>;
  /** useForm が返す control */
  control: Control<TFieldValues, unknown, TTransformed>;
} & Omit<TextFieldProps, "name" | "value" | "onChange" | "onBlur" | "error">;

export const FormTextField = <TFieldValues extends FieldValues, TTransformed>({
  name,
  control,
  helperText,
  ...textFieldProps
}: FormTextFieldProps<TFieldValues, TTransformed>) => {
  // field：value・onChange・onBlur・ref など入力欄に渡す値 / fieldState：この項目のエラーなど
  const { field, fieldState } = useController({ name, control });

  // ref は TextField の外枠ではなく、中の <input> に渡す（エラー時に自動でフォーカスするため）
  const { ref, ...fieldProps } = field;

  return (
    <TextField
      fullWidth
      {...textFieldProps}
      {...fieldProps}
      inputRef={ref}
      error={fieldState.error !== undefined} // エラーがあれば赤枠
      helperText={fieldState.error?.message ?? helperText} // エラー文がなければ補足説明を出す
    />
  );
};
