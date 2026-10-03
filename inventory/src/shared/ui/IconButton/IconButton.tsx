import type { ComponentProps, ReactNode } from "react";
import styles from "./IconButton.module.css";

/**
 * アイコン（記号）だけのボタン
 *
 * 文字がないので、label（読み上げ用の名前）は必須にしている。
 *
 * 使い方:
 *   <IconButton label="閉じる" onClick={close}>×</IconButton>
 *   <IconButton label="削除" variant="danger">🗑</IconButton>
 *   <IconButton label="メニューを開く"><MenuIcon /></IconButton>   … SVG のアイコンも渡せる
 */

type IconButtonProps = Omit<ComponentProps<"button">, "children"> & {
  /** 何をするボタンか（aria-label として読み上げる。マウスを乗せたときの説明にも出る） */
  label: string;
  /** アイコン（記号・絵文字・SVG） */
  children: ReactNode;
  variant?: "ghost" | "secondary" | "danger";
  size?: "sm" | "md";
};

export const IconButton = ({
  label,
  children,
  variant = "ghost",
  size = "md",
  type = "button",
  ...rest
}: IconButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      className={styles.button}
      data-variant={variant}
      data-size={size}
      aria-label={label}
      title={label} // マウスを乗せると説明が出る
    >
      {/* アイコンは飾りなので読み上げない（aria-label の方を読む） */}
      <span aria-hidden="true">{children}</span>
    </button>
  );
};
