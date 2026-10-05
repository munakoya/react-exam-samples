import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

/**
 * 「本当に実行しますか？」の確認ダイアログ ── shared/ui
 *
 * MUI の Dialog が、背景の暗転・Esc で閉じる・フォーカスの閉じ込め を用意してくれる。
 *
 *   const [open, setOpen] = useState(false);
 *
 *   <ConfirmDialog
 *     open={open}
 *     title="削除しますか？"
 *     message="この操作は取り消せません。"
 *     onConfirm={handleDelete}
 *     onCancel={() => setOpen(false)}
 *   />
 */

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  /** 実行ボタンの文言 */
  confirmLabel?: string;
  /** true なら実行ボタンを赤にする（削除など取り消せない操作） */
  danger?: boolean;
  /** true の間は実行ボタンを処理中の表示にして押せなくする */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "削除",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    // onClose：Esc キー・背景のクリックで呼ばれる。キャンセルと同じ扱いにする
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          キャンセル
        </Button>
        <Button
          variant="contained"
          color={danger ? "error" : "primary"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
