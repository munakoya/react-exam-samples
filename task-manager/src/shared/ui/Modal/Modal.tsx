import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";
import styles from "./Modal.module.css";

/**
 * ブラウザ標準の <dialog> を使ったモーダル（CSS 版）
 *
 * showModal() で開くと、次をブラウザが用意してくれる。
 *   - 背景の操作を止める
 *   - Esc キーで閉じる
 *   - モーダルの中にフォーカスを閉じ込める
 * さらに、背景（暗い部分）のクリックでも閉じるようにしている。
 *
 * 使い方:
 *   const [open, setOpen] = useState(false);
 *
 *   <Button onClick={() => setOpen(true)}>開く</Button>
 *   <Modal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     title="編集"
 *     footer={<Button onClick={() => setOpen(false)}>閉じる</Button>}
 *   >
 *     <p>内容</p>
 *   </Modal>
 */

type ModalProps = {
  open: boolean;
  /** Esc・背景クリックで閉じたときに呼ばれる。親の state を false に戻す */
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** 下部に右寄せで並べるボタン */
  footer?: ReactNode;
};

export const Modal = ({ open, onClose, title, children, footer }: ModalProps) => {
  // <dialog> の DOM を直接操作するので、ref で参照を持つ
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // open が変わったら、DOM の showModal() / close() を呼ぶ
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // 背景をクリックしたら閉じる。
  // 中身は .content で包んでいるので、クリックした要素が <dialog> 自身なら背景と判断できる
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId} // 見出しをモーダルの名前として読み上げる
      onClose={onClose}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
};
