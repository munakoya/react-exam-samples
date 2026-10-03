import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./Stack.module.css";

/**
 * 子要素を縦（または横）に並べ、間隔をそろえる部品
 *
 * margin で1つずつ余白を付ける代わりに、親の gap で間隔をまとめて決める。
 *
 * 使い方:
 *   <Stack gap={4}>…</Stack>                                   … 縦に並べる（間隔 16px）
 *   <Stack direction="row" gap={2} align="center">…</Stack>    … 横に並べ、上下中央にそろえる
 *   <Stack direction="row" justify="between">…</Stack>         … 両端に寄せる（見出しとボタンなど）
 *   <Stack direction="row" wrap>…</Stack>                      … 入りきらなければ折り返す
 */

type StackProps = HTMLAttributes<HTMLDivElement> & {
  direction?: "column" | "row";
  /** 間隔。tokens.css の --space-1〜7 の番号（0 は間隔なし） */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** 並べる向きと直角方向のそろえ方（横並びなら上下） */
  align?: "start" | "center" | "end" | "stretch";
  /** 並べる向きのそろえ方（横並びなら左右） */
  justify?: "start" | "center" | "end" | "between";
  /** true なら入りきらない要素を折り返す */
  wrap?: boolean;
};

export const Stack = ({
  direction = "column",
  gap = 3,
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  style,
  ...rest
}: StackProps) => {
  return (
    <div
      {...rest}
      className={[styles.stack, className].filter(Boolean).join(" ")}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap}
      // 間隔は CSS 変数 --stack-gap で CSS に渡す（CSS 側で gap: var(--stack-gap)）。
      // TypeScript は独自の CSS 変数名を知らないので、CSSProperties として扱う
      style={{ "--stack-gap": gap === 0 ? "0" : `var(--space-${gap})`, ...style } as CSSProperties}
    />
  );
};
