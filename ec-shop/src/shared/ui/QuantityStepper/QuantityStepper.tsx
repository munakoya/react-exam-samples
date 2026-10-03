import styles from "./QuantityStepper.module.css";

/**
 * 「− 3 ＋」の形で数量を増減する部品
 *
 * 値は持たず、親から value を受け取り、変更後の値を onChange で伝える（制御コンポーネント）。
 * min・max の端では、それ以上押せなくなる。
 *
 * 使い方:
 *   <QuantityStepper label="りんごの数量" value={quantity} min={1} max={10} onChange={setQuantity} />
 */

type QuantityStepperProps = {
  /** 何の数量か（読み上げ用）。一覧で並べるときは「〇〇の数量」のように区別できる名前にする */
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export const QuantityStepper = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  disabled = false,
}: QuantityStepperProps) => {
  return (
    // role="group" と aria-label で、3つの要素が「〇〇の数量」のまとまりだと伝える
    <div className={styles.stepper} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="1つ減らす"
      >
        −
      </button>
      {/* aria-live="polite"：値が変わったら読み上げる */}
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="1つ増やす"
      >
        ＋
      </button>
    </div>
  );
};
