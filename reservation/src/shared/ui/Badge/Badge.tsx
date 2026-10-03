import type { ReactNode } from "react";
import styles from "./Badge.module.css";

/**
 * 状態を示す小さなラベル（CSS 版）
 *
 * 使い方:
 *   <Badge tone="success">在庫あり</Badge>
 *   <Badge tone="warning">在庫少</Badge>
 *   <Badge tone="danger">在庫切れ</Badge>
 *   <Badge tone="info">進行中</Badge>
 */

type BadgeProps = {
  /** neutral：灰 / info：メインの色 / success：緑 / warning：橙 / danger：赤 */
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  children: ReactNode;
};

export const Badge = ({ tone = "neutral", children }: BadgeProps) => {
  return (
    <span className={styles.badge} data-tone={tone}>
      {children}
    </span>
  );
};
