import type { ComponentProps } from "react";
import styles from "./Checkbox.module.css";

/**
 * ラベルつきのチェックボックス（CSS 版）
 *
 * <label> で <input> を包むと、文字をクリックしてもチェックが切り替わる。
 *
 * 使い方:
 *   <Checkbox label="利用規約に同意する" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
 *   <Checkbox label="利用規約に同意する" {...register("agreed")} />   // React Hook Form
 */

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
};

export const Checkbox = ({ label, ...rest }: CheckboxProps) => {
  return (
    <label className={styles.label}>
      <input {...rest} type="checkbox" className={styles.checkbox} />
      {label}
    </label>
  );
};
