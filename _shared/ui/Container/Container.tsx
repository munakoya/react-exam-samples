import type { ReactNode } from "react";
import styles from "./Container.module.css";

/**
 * ページの中身の最大幅を決めて、中央に寄せる枠
 *
 * 使い方（ページの一番外側に置く）:
 *   <Container size="sm">   … フォーム・Todo など1列の画面（640px）
 *   <Container>             … 一般的な画面（960px）
 *   <Container size="lg">   … 表・ダッシュボード（1200px）
 */

type ContainerProps = {
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

export const Container = ({ size = "md", children }: ContainerProps) => {
  return (
    <div className={styles.container} data-size={size}>
      {children}
    </div>
  );
};
