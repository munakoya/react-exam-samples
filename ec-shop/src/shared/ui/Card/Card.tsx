import type { ReactNode } from "react";
import styles from "./Card.module.css";

/**
 * 見出し・本文・フッター（ボタン置き場）を持つカード（CSS 版）
 *
 * 使い方:
 *   <Card title="りんご" footer={<Button>詳細</Button>}>
 *     <p>¥180</p>
 *   </Card>
 */

type CardProps = {
  title?: string;
  /** 下部に置く要素（ボタンなど） */
  footer?: ReactNode;
  children: ReactNode;
};

export const Card = ({ title, footer, children }: CardProps) => {
  return (
    <article className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
};
