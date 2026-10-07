import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import type { FormEventHandler, ReactNode } from "react";

/**
 * ダイアログの中に置くフォームの枠（見出し・入力欄・キャンセル／送信ボタン） ── shared/ui
 *
 * MUI の <Dialog> の中に置いて使う。<Dialog> は閉じると中身を消し、開くと作り直すので、
 * useForm を「中身の部品」に書いておけば、開くたびに defaultValues から始まる（reset() が要らない）。
 *
 *   // features/xxx-form/ui/XxxFormDialog.tsx
 *   export const XxxFormDialog = ({ open, item, onClose }) => (
 *     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
 *       <XxxForm item={item} onDone={onClose} />
 *     </Dialog>
 *   );
 *
 *   const XxxForm = ({ item, onDone }) => {
 *     const { control, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: toFormInput(item) });
 *     return (
 *       <DialogForm
 *         title={item ? "編集" : "追加"}
 *         submitLabel={item ? "更新" : "追加"}
 *         onSubmit={handleSubmit(onSubmit)}
 *         onCancel={onDone}
 *       >
 *         <FormTextField control={control} name="name" label="名前" autoFocus />
 *       </DialogForm>
 *     );
 *   };
 */

type DialogFormProps = {
  title: string;
  /** 送信ボタンの文言 */
  submitLabel?: string;
  /** handleSubmit(onSubmit) をそのまま渡す */
  onSubmit: FormEventHandler<HTMLFormElement>;
  /** キャンセルボタンで呼ばれる（ダイアログを閉じる） */
  onCancel: () => void;
  /** true の間は送信ボタンを処理中の表示にして押せなくする（formState.isSubmitting など） */
  submitting?: boolean;
  /** 入力欄。縦に並べて間隔をそろえる */
  children: ReactNode;
};

export const DialogForm = ({
  title,
  submitLabel = "保存",
  onSubmit,
  onCancel,
  submitting = false,
  children,
}: DialogFormProps) => {
  return (
    // <form> で DialogTitle・DialogContent・DialogActions を包み、送信ボタンを type="submit" にする。
    // noValidate：ブラウザの入力チェック（吹き出し）を止め、zod のエラーだけを出す
    <form onSubmit={onSubmit} noValidate>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* DialogContent の先頭は上の余白が詰まり、ラベルが切れやすいので pt で少し空ける */}
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {children}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={submitting}>
          キャンセル
        </Button>
        <Button type="submit" variant="contained" loading={submitting}>
          {submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
};
