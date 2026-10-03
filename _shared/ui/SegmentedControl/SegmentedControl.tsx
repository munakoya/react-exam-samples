import styles from "./SegmentedControl.module.css";

/**
 * つながったボタンで、選択肢から1つを選ぶ部品（絞り込み・表示の切り替えなど）
 *
 * 押した瞬間に切り替わる「表示の切り替え」に使う。フォームで値を送るなら RadioGroup。
 *
 * 使い方:
 *   type Filter = "all" | "active" | "completed";
 *   const [filter, setFilter] = useState<Filter>("all");
 *
 *   <SegmentedControl
 *     label="表示する Todo"
 *     options={[
 *       { value: "all", label: "すべて" },
 *       { value: "active", label: "未完了" },
 *       { value: "completed", label: "完了" },
 *     ]}
 *     value={filter}
 *     onChange={setFilter}
 *   />
 */

type Option<T extends string> = { value: T; label: string };

// <T extends string>：options の value の型（"all" | "active" など）が、そのまま onChange の引数の型になる
type SegmentedControlProps<T extends string> = {
  /** 読み上げ用の名前（何を切り替えるか） */
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const SegmentedControl = <T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) => {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.segment}
          // aria-pressed：押されている（選ばれている）ことを伝える。CSS でもこれを見て色を変える
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
