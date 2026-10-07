import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useUserStore, type User } from "@/entities/user";
import { ConfirmDialog, notify } from "@/shared/ui";

/**
 * 削除ボタン ＋ 確認ダイアログ（1人分） ── features/delete-user/ui
 *
 *   <DeleteUserButton user={user} />                                   // 表・カード：ゴミ箱のアイコン
 *   <DeleteUserButton user={user} variant="button" onDeleted={() => navigate("/users")} />  // 詳細ページ
 *
 * ボタンを押す → 確認ダイアログを開く → 「削除」で store から消す → 通知を出す。
 * ダイアログの開閉はこのボタンの中だけで使うので useState（store に入れない）。
 */

type DeleteUserButtonProps = {
  user: User;
  /** "icon"：ゴミ箱のアイコン（表・カード用） / "button"：文字のボタン（詳細ページ用） */
  variant?: "icon" | "button";
  /** 削除したあとに呼ばれる（詳細ページなら一覧へ戻る） */
  onDeleted?: () => void;
};

export const DeleteUserButton = ({ user, variant = "icon", onDeleted }: DeleteUserButtonProps) => {
  const [open, setOpen] = useState(false);
  const removeUsers = useUserStore((state) => state.removeUsers);

  const handleConfirm = () => {
    setOpen(false);
    removeUsers([user.id]);
    notify(`「${user.name}」を削除しました`);
    onDeleted?.();
  };

  return (
    <>
      {variant === "icon" ? (
        <Tooltip title="削除">
          {/* アイコンだけのボタンは aria-label で、誰の削除かを伝える */}
          <IconButton size="small" color="error" aria-label={`「${user.name}」を削除`} onClick={() => setOpen(true)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Button color="error" variant="outlined" startIcon={<DeleteOutlinedIcon />} onClick={() => setOpen(true)}>
          削除
        </Button>
      )}
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${user.name}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
