import type { ComponentProps } from "react";
import styles from "./Switch.module.css";

/**
 * オン・オフを切り替えるスイッチ
 *
 * 中身はチェックボックス。role="switch" で「スイッチ」として読み上げさせる。
 * 設定のように「押した瞬間に反映される」項目に使う（フォームの同意などは Checkbox）。
 *
 * 使い方:
 *   <Switch label="通知を受け取る" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
 *   <Switch label="通知を受け取る" {...register("notification")} />   // React Hook Form
 */

type SwitchProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
};

export const Switch = ({ label, ...rest }: SwitchProps) => {
  return (
    // <label> で包むと、文字をクリックしても切り替わる
    <label className={styles.label}>
      <input {...rest} type="checkbox" role="switch" className={styles.input} />
      {/* 見た目のつまみ。本物の <input> は透明にして、この上に重ねている */}
      <span className={styles.track} aria-hidden="true" />
      {label}
    </label>
  );
};
