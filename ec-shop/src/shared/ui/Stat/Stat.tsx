import type { ReactNode } from "react";
import styles from "./Stat.module.css";

/**
 * 集計の数字を大きく見せる枠（ダッシュボード・家計簿の合計・件数など）
 *
 *   ┌────────┐
 *   │ 今月の支出   │ ← label
 *   │ ¥48,200     │ ← value
 *   │ 先月より +5% │ ← note
 *   └────────┘
 *
 * 使い方（いくつか並べるときは Grid で包む）:
 *   <Grid min={160} gap={3}>
 *     <Stat label="未着手" value={3} />
 *     <Stat label="期限切れ" value={1} tone="danger" />
 *     <Stat label="今月の収入" value={formatPrice(income)} note="先月より +12,000円" tone="success" />
 *   </Grid>
 */

type StatProps = {
  label: string;
  value: ReactNode;
  /** 数字の下の補足 */
  note?: string;
  /** danger：注意が必要（期限切れ・赤字） / success：よい状態（黒字・達成） */
  tone?: "neutral" | "success" | "danger";
};

export const Stat = ({ label, value, note, tone = "neutral" }: StatProps) => {
  return (
    <div className={styles.stat} data-tone={tone}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
};
