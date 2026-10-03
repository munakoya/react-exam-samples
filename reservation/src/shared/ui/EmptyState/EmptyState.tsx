import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

/**
 * 一覧が0件のときの案内（CSS 版）
 *
 * 使い方:
 *   {items.length === 0 && (
 *     <EmptyState title="データがありません" action={<Button>追加する</Button>} />
 *   )}
 */

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
};
