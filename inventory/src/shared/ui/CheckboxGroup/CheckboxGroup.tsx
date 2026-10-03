import { useId, type ComponentProps } from "react";
import styles from "./CheckboxGroup.module.css";

/**
 * チェックボックスのグループ（選択肢から いくつでも 選ぶ。タグ・受講する科目・好きなジャンルなど）
 *
 * 見た目は RadioGroup にそろえている（<fieldset> ＋ <legend> で、選択肢のまとまりと見出しを伝える）。
 *
 * 使い方:
 *   const genres = [{ value: "novel", label: "小説" }, { value: "comic", label: "漫画" }];
 *
 *   // React Hook Form：同じ name のチェックボックスがまとめて登録され、選んだ value の配列で届く
 *   //   defaultValues: { genres: [] }   … 初期値は配列にしておく
 *   //   z.array(z.enum([...])).min(1, "1つ以上選んでください")
 *   <CheckboxGroup label="ジャンル" options={genres} {...register("genres")} error={errors.genres?.message} />
 *
 *   // useState で持つ場合：value に選ばれている値の配列を渡し、onChange で足し引きする
 *   const [selected, setSelected] = useState<string[]>([]);
 *   <CheckboxGroup
 *     label="ジャンル"
 *     options={genres}
 *     value={selected}
 *     onChange={(e) =>
 *       setSelected((prev) =>
 *         e.target.checked ? [...prev, e.target.value] : prev.filter((v) => v !== e.target.value),
 *       )
 *     }
 *   />
 *
 * ⚠ React Hook Form で選択肢が「1つだけ」のときは、配列ではなく true / false で届く（RHF の仕様）
 */

type Option = { value: string; label: string };

type CheckboxGroupProps = Omit<ComponentProps<"input">, "type" | "value" | "defaultValue"> & {
  label: string;
  options: Option[];
  /** 選ばれている値の配列（useState で持つとき） */
  value?: string[];
  direction?: "row" | "column";
  error?: string;
};

export const CheckboxGroup = ({
  label,
  options,
  value,
  direction = "column",
  error,
  name,
  ...rest // onChange・onBlur・ref（register から来るもの）は、すべてのチェックボックスに渡す
}: CheckboxGroupProps) => {
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
              type="checkbox"
              name={groupName}
              value={option.value}
              // value を渡されたときだけ checked で制御する（渡されなければ React Hook Form に任せる）
              checked={value === undefined ? undefined : value.includes(option.value)}
              className={styles.checkbox}
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
