import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import styles from "./ConfirmDialog.module.css";

/**
 * 「本当に実行しますか？」の確認ダイアログ（Modal + Button の組み合わせ）
 *
 * 削除など、取り消せない操作の前に使う。
 *
 * 使い方:
 *   const [target, setTarget] = useState<Todo | null>(null);
 *
 *   <ConfirmDialog
 *     open={target !== null}
 *     title="削除しますか？"
 *     message={`「${target?.title}」を削除します。`}
 *     onConfirm={() => { remove(target.id); setTarget(null); }}
 *     onCancel={() => setTarget(null)}
 *   />
 */

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  /** 実行ボタンの文言 */
  confirmLabel?: string;
  /** true なら実行ボタンを赤にする（削除など） */
  danger?: boolean;
  /** true の間は実行ボタンを「処理中…」にする */
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
    <Modal
      open={open}
      onClose={onCancel} // Esc・背景クリックで閉じたときは、キャンセルと同じ扱い
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            キャンセル
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className={styles.message}>{message}</p>
    </Modal>
  );
};
