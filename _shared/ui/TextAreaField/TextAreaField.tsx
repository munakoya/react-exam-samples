import { useId, type ComponentProps } from "react";
import styles from "./TextAreaField.module.css";

/**
 * ラベル・補足説明・エラー表示つきの複数行入力欄（TextField の textarea 版）
 *
 * 使い方:
 *   <TextAreaField label="本文" rows={6} {...register("body")} error={errors.body?.message} />
 */

type TextAreaFieldProps = ComponentProps<"textarea"> & {
  label: string;
  hint?: string;
  error?: string;
};

export const TextAreaField = ({
  label,
  hint,
  error,
  id,
  rows = 4,
  ...rest
}: TextAreaFieldProps) => {
  // useId で <label> と <textarea> を結びつける
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const messageId = `${textareaId}-message`;
  const message = error ?? hint;

  return (
    <div className={styles.field}>
      <label htmlFor={textareaId} className={styles.label}>
        {label}
      </label>
      <textarea
        {...rest}
        id={textareaId}
        rows={rows}
        className={styles.textarea}
        aria-invalid={error ? true : undefined}
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
