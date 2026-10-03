import { useId, type ComponentProps } from "react";
import styles from "./SelectField.module.css";

/**
 * ラベル・エラー表示つきのセレクトボックス（CSS 版）
 *
 * 使い方:
 *   const options = [
 *     { value: "food", label: "食品" },
 *     { value: "daily", label: "日用品" },
 *   ];
 *   <SelectField label="カテゴリ" options={options} {...register("category")} />
 *
 *   // 必ずどれかを選んでいる（並び替えなど）なら、placeholder={false} で未選択の選択肢を消す
 *   <SelectField label="並び順" options={sortOptions} placeholder={false} value={sort} onChange={...} />
 */

type Option = { value: string; label: string };

type SelectFieldProps = Omit<ComponentProps<"select">, "children"> & {
  label: string;
  options: Option[];
  /** 未選択のときの文言。value="" の選択肢として先頭に入る。false なら入れない */
  placeholder?: string | false;
  error?: string;
};

export const SelectField = ({
  label,
  options,
  placeholder = "選択してください",
  error,
  id,
  ...rest
}: SelectFieldProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={selectId} className={styles.label}>
        {label}
      </label>
      <select
        {...rest}
        id={selectId}
        className={styles.select}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {placeholder !== false && <option value="">{placeholder}</option>}
        {/* 配列から <option> を作る。key には重複しない value を使う */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
};
