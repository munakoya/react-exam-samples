import type { ReactNode } from "react";
import styles from "./Alert.module.css";

/**
 * 操作の結果や通信エラーを知らせるメッセージ枠
 *
 * 使い方:
 *   <Alert tone="success">保存しました</Alert>
 *   <Alert tone="error" title="読み込みに失敗しました">時間をおいて再度お試しください。</Alert>
 *   <Alert tone="success" onClose={() => setMessage("")}>{message}</Alert>   … ×で閉じられる
 */

type AlertProps = {
  tone?: "info" | "success" | "error";
  title?: string;
  children: ReactNode;
  /** 渡すと右上に × ボタンを出す */
  onClose?: () => void;
};

export const Alert = ({ tone = "info", title, children, onClose }: AlertProps) => {
  return (
    <div
      className={styles.alert}
      data-tone={tone}
      // role="alert" は表示した瞬間に読み上げる。急いで伝えたいエラーだけに使い、
      // それ以外は role="status"（読み上げ中の内容を邪魔しない）にする
      role={tone === "error" ? "alert" : "status"}
    >
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button type="button" className={styles.close} onClick={onClose} aria-label="閉じる">
          ×
        </button>
      )}
    </div>
  );
};
