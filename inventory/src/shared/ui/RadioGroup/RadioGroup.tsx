import { useId, type ComponentProps } from "react";
import styles from "./RadioGroup.module.css";

/**
 * ラジオボタンのグループ（選択肢から1つ選ぶ）
 *
 * <fieldset> と <legend> で、選択肢のまとまりと見出しを伝える。
 *
 * 使い方:
 *   const plans = [{ value: "free", label: "無料" }, { value: "pro", label: "有料" }];
 *
 *   // useState で持つ場合：value に選ばれている値を渡す
 *   <RadioGroup label="プラン" options={plans} value={plan} onChange={(e) => setPlan(e.target.value)} />
 *
 *   // React Hook Form：register をそのまま渡せる
 *   <RadioGroup label="プラン" options={plans} {...register("plan")} error={errors.plan?.message} />
 */

type Option = { value: string; label: string };

type RadioGroupProps = Omit<ComponentProps<"input">, "type" | "value" | "defaultValue"> & {
  label: string;
  options: Option[];
  /** 選ばれている値（useState で持つとき） */
  value?: string;
  /** 最初に選んでおく値（state で持たないとき） */
  defaultValue?: string;
  direction?: "row" | "column";
  error?: string;
};

export const RadioGroup = ({
  label,
  options,
  value,
  defaultValue,
  direction = "column",
  error,
  name,
  ...rest // onChange・onBlur・ref（register から来るもの）は、すべてのラジオボタンに渡す
}: RadioGroupProps) => {
  // 同じ name のラジオボタンが1つのグループになる。指定がなければ自動で作る
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const errorId = `${groupName}-error`;

  return (
    <fieldset
      className={styles.fieldset}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.options} data-direction={direction}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              {...rest}
              type="radio"
              name={groupName}
              value={option.value}
              // value を渡されたときだけ checked で制御する（渡されなければブラウザに任せる）
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={
                defaultValue === undefined ? undefined : defaultValue === option.value
              }
              className={styles.radio}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
};
