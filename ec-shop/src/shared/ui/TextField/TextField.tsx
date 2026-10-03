import { useId, type ComponentProps } from "react";
import styles from "./TextField.module.css";

/**
 * ラベル・補足説明・エラー表示つきの入力欄（CSS 版）
 *
 * 使い方:
 *   <TextField label="名前" value={name} onChange={(e) => setName(e.target.value)} />
 *
 *   // React Hook Form では register をそのまま渡せる（中の <input> に ref が届く）
 *   <TextField label="名前" {...register("name")} error={errors.name?.message} />
 */

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  /** 入力欄の下に出す補足説明 */
  hint?: string;
  /** エラーメッセージ。あれば赤枠にして、hint の代わりに表示する */
  error?: string;
};

export const TextField = ({ label, hint, error, id, ...rest }: TextFieldProps) => {
  // useId で重複しない id を作り、<label> と <input> を結びつける（ラベルをクリックで入力欄へ）
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        className={styles.input}
        // aria-invalid：エラー状態を伝える。CSS でも [aria-invalid="true"] で赤枠にする
        aria-invalid={error ? true : undefined}
        // aria-describedby：入力欄と一緒に、補足説明・エラーを読み上げさせる
        aria-describedby={message ? messageId : undefined}
      />
      {message && (
        <p id={messageId} className={styles.message} data-error={error !== undefined}>
          {message}
        </p>
      )}
    </div>
  );
};
