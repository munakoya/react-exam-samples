import { useState } from "react";

/**
 * 追加・編集を同じダイアログで行うときの「開閉」と「どれを編集中か」を持つフック ── shared/ui
 *
 *   target が undefined → 追加
 *   target に値がある   → 編集
 *
 *   const dialog = useFormDialog<User>();
 *
 *   <Button onClick={dialog.openNew}>追加</Button>
 *   <UserCard onEdit={() => dialog.openEdit(user)} />
 *   <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
 *
 * 閉じるときは open だけを false にし、target は残す。
 * 閉じるアニメーションの間に見出しが「編集」→「追加」に変わって見えないようにするため。
 */
export const useFormDialog = <T>() => {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<T>();

  return {
    open,
    target,
    openNew: () => {
      setTarget(undefined);
      setOpen(true);
    },
    openEdit: (item: T) => {
      setTarget(item);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
};
