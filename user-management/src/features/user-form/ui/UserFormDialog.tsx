import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { Controller, useForm } from "react-hook-form";
import { departmentOptions, userRoleOptions, useUserStore, type User } from "@/entities/user";
import { DialogForm, FormTextField, notify } from "@/shared/ui";
import { createUserFormSchema, toFormInput, type UserFormInput, type UserFormValues } from "../model/schema";

/**
 * ユーザーの追加・編集をダイアログ（モーダル）で行う ── features/user-form/ui
 *
 *   user を渡さない → 追加（addUser）
 *   user を渡す     → 編集（updateUser）
 *
 * 開閉と「どのユーザーを編集中か」は、呼ぶ側が shared/ui の useFormDialog で持つ。
 *
 *   const dialog = useFormDialog<User>();
 *   <Button onClick={dialog.openNew}>追加</Button>                    // 追加ボタン → 空のフォーム
 *   <Button onClick={() => dialog.openEdit(user)}>編集</Button>       // 編集ボタン → 今の値が入ったフォーム
 *   <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
 *
 * MUI の Dialog は閉じると中身（UserForm）を消し、開くと作り直す。
 * useForm を中身の部品に書いておけば、開くたびに defaultValues から始まるので reset() は要らない。
 */

type UserFormDialogProps = {
  open: boolean;
  /** 編集するユーザー。追加のときは渡さない */
  user?: User;
  onClose: () => void;
};

export const UserFormDialog = ({ open, user, onClose }: UserFormDialogProps) => {
  return (
    // onClose：Esc キー・背景のクリックで呼ばれる
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <UserForm user={user} onDone={onClose} />
    </Dialog>
  );
};

// ダイアログの中身（フォーム）。ダイアログを開くたびに作り直される
const UserForm = ({ user, onDone }: { user?: User; onDone: () => void }) => {
  const users = useUserStore((state) => state.users);
  const addUser = useUserStore((state) => state.addUser);
  const updateUser = useUserStore((state) => state.updateUser);

  // 重複チェック用：自分以外のメールアドレス（編集で自分のアドレスのまま保存できるように）
  const otherEmails = users.filter((other) => other.id !== user?.id).map((other) => other.email);

  const { control, handleSubmit } = useForm<UserFormInput, unknown, UserFormValues>({
    resolver: zodResolver(createUserFormSchema(otherEmails)),
    defaultValues: toFormInput(user), // 編集なら今の値、追加なら初期値
  });

  const onSubmit = (values: UserFormValues) => {
    if (user) {
      updateUser(user.id, values);
      notify(`「${values.name}」を更新しました`);
    } else {
      addUser(values);
      notify(`「${values.name}」を追加しました`);
    }
    onDone();
  };

  return (
    <DialogForm
      title={user ? "ユーザーを編集" : "ユーザーを追加"}
      submitLabel={user ? "更新" : "追加"}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onDone}
    >
      <FormTextField control={control} name="name" label="名前" placeholder="例：山田 太郎" required autoFocus />
      <FormTextField control={control} name="email" label="メールアドレス" type="email" placeholder="taro@example.com" required />

      {/* 2つ並べる。スマホでは縦に */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormTextField control={control} name="role" label="権限" select>
          {userRoleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </FormTextField>
        <FormTextField control={control} name="department" label="部署" select>
          {departmentOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </FormTextField>
      </Stack>

      {/* 日付は値がなくても「年/月/日」が出るので、ラベルを常に上に置く（shrink） */}
      <FormTextField
        control={control}
        name="joinedAt"
        label="入社日"
        type="date"
        required
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/* Switch は value ではなく checked で値を渡す。onChange では event.target.checked を渡す */}
      <Controller
        control={control}
        name="active"
        render={({ field }) => (
          <FormControlLabel
            label="有効（ログインできる）"
            control={
              <Switch
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
              />
            }
          />
        )}
      />
    </DialogForm>
  );
};
