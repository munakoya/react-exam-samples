import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

/**
 * ページの見出し（タイトル・説明・右側のボタン）
 *
 * 使い方:
 *   <PageHeader
 *     title="Todo"
 *     description="やることを管理します"
 *     action={<Button>追加</Button>}
 *   />
 */

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action}
    </header>
  );
};
