import type { ComponentProps } from "react";
import styles from "./Button.module.css";

/**
 * ボタン（CSS 版）
 *
 * 使い方:
 *   <Button onClick={save}>保存</Button>
 *   <Button variant="secondary">キャンセル</Button>
 *   <Button variant="danger" size="sm">削除</Button>
 *   <Button variant="ghost" aria-label="閉じる">×</Button>
 *   <Button type="submit" loading={isSubmitting} fullWidth>送信</Button>
 */

type ButtonProps = ComponentProps<"button"> & {
  /** primary：主な操作 / secondary：補助 / danger：削除 / ghost：枠なしの控えめな操作 */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  /** true なら横幅いっぱいに広げる */
  fullWidth?: boolean;
  /** true の間は「処理中…」と表示して押せなくする（二重送信を防ぐ） */
  loading?: boolean;
};

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  // type の初期値は "button"。省略すると <form> の中で送信ボタン扱いになるため
  type = "button",
  disabled,
  children,
  ...rest // onClick など、残りはそのまま <button> へ渡す
}: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      className={styles.button}
      // 見た目の種類は data-* 属性で渡し、CSS の [data-variant="..."] で切り替える
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading} // 処理中であることを読み上げで伝える
    >
      {loading ? "処理中…" : children}
    </button>
  );
};
