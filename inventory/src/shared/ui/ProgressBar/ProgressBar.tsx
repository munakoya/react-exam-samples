import type { CSSProperties } from "react";
import styles from "./ProgressBar.module.css";

/**
 * 進み具合のバー（受講の進捗・予算の使用率・送料無料まであと少し など）
 *
 *   受講の進み具合            6 / 10
 *   ████████████░░░░░░░░
 *
 * 使い方:
 *   <ProgressBar label="受講の進み具合" value={6} max={10} valueText="6 / 10" />
 *   <ProgressBar label="予算の使用率" value={used} max={budget} tone={used > budget ? "danger" : "primary"} />
 *
 * value が max を超えても、バーは 100% で止まる。
 */

type ProgressBarProps = {
  /** 何の進み具合か（画面に表示し、読み上げにも使う） */
  label: string;
  value: number;
  max?: number;
  /** 右上に出す文字。省略するとパーセント（"60%"）を出す */
  valueText?: string;
  tone?: "primary" | "success" | "warning" | "danger";
};

export const ProgressBar = ({
  label,
  value,
  max = 100,
  valueText,
  tone = "primary",
}: ProgressBarProps) => {
  // 0〜100 の範囲に収めたパーセント
  const percent = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const text = valueText ?? `${Math.round(percent)}%`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span>{label}</span>
        <span className={styles.value}>{text}</span>
      </div>
      {/*
        role="progressbar" と aria-value* で、読み上げに「60%」などを伝える。
        バーの長さは CSS 変数で渡し、CSS 側で width: var(--percent) にする
      */}
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.min(value, max)}
        aria-valuetext={text}
      >
        <div
          className={styles.bar}
          data-tone={tone}
          style={{ "--percent": `${percent}%` } as CSSProperties}
        />
      </div>
    </div>
  );
};
