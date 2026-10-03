import type { CSSProperties, ReactNode } from "react";
import styles from "./Grid.module.css";

/**
 * カードなどを格子状に並べる部品
 *
 * 1つあたりの最小幅（min）を決めると、画面幅に入る数だけ自動で横に並ぶ。
 * 狭い画面では自動で列が減るので、メディアクエリを書かなくてよい。
 *
 * 使い方:
 *   <Grid min={200}>
 *     {items.map((item) => <Card key={item.id} title={item.name}>…</Card>)}
 *   </Grid>
 */

type GridProps = {
  /** 1つあたりの最小幅（px） */
  min?: number;
  /** 間隔。tokens.css の --space-1〜7 の番号 */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  children: ReactNode;
};

export const Grid = ({ min = 220, gap = 4, children }: GridProps) => {
  return (
    <div
      className={styles.grid}
      // 値は CSS 変数で渡し、CSS 側で使う
      style={{ "--grid-min": `${min}px`, "--grid-gap": `var(--space-${gap})` } as CSSProperties}
    >
      {children}
    </div>
  );
};
