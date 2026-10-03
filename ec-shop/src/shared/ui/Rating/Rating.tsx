import { Fragment, useId, type ComponentProps } from "react";
import styles from "./Rating.module.css";

/**
 * 星の評価（表示用の Rating と、入力用の RatingField）
 *
 * ---------- 表示 ----------
 *   <Rating value={4} />          ★★★★☆（読み上げは「5点中4点」）
 *
 * ---------- 入力（中身はラジオボタン。React Hook Form の register をそのまま渡せる） ----------
 *   // ⚠ ラジオボタンの値は、valueAsNumber を付けても文字列（"4"）で届く（React Hook Form の仕様）。
 *   //   zod の z.coerce.number() で数値に変換する
 *   // zod：rating: z.coerce.number().int().min(1, "評価を選んでください").max(5)
 *   // defaultValues: { rating: 0 }   … 0 はどの星にも当たらないので「未選択」になる
 *   <RatingField label="評価" {...register("rating")} error={errors.rating?.message} />
 *
 *   // useState で持つ場合
 *   <RatingField label="評価" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
 */

const MAX = 5;

/** 表示用：value 個の ★ と、残りの ☆ */
export const Rating = ({ value }: { value: number }) => {
  const filled = Math.round(Math.min(MAX, Math.max(0, value)));
  return (
    <span className={styles.display} role="img" aria-label={`${MAX}点中${filled}点`}>
      <span className={styles.filled}>{"★".repeat(filled)}</span>
      <span className={styles.empty}>{"★".repeat(MAX - filled)}</span>
    </span>
  );
};

type RatingFieldProps = Omit<ComponentProps<"input">, "type" | "value"> & {
  label: string;
  /** 選ばれている点数（useState で持つとき） */
  value?: number;
  error?: string;
};

/**
 * 入力用：5つのラジオボタン（1〜5点）を ★ の見た目にしたもの
 *
 * 選んだ星「から左」をすべて色付きにする CSS の工夫：
 *   HTML では 5 → 1 の順に並べ、CSS の flex-direction: row-reverse で 1 → 5 の順に見せる。
 *   「チェックされた input より後ろにある label」（input:checked ~ label）を色付きにすると、
 *   HTML で後ろ ＝ 見た目で左の星が、すべて色付きになる。
 */
export const RatingField = ({ label, value, error, name, ...rest }: RatingFieldProps) => {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const errorId = `${groupName}-error`;
  const points = Array.from({ length: MAX }, (_, i) => MAX - i); // [5, 4, 3, 2, 1]

  return (
    <fieldset
      className={styles.fieldset}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.stars}>
        {points.map((point) => {
          const id = `${groupName}-${point}`;
          return (
            // input と label を同じ並び（兄弟）に置く必要があるので、要素を増やさない Fragment で包む
            <Fragment key={point}>
              <input
                {...rest}
                id={id}
                type="radio"
                name={groupName}
                value={point}
                checked={value === undefined ? undefined : value === point}
                className={`visually-hidden ${styles.input}`}
              />
              <label htmlFor={id} className={styles.star}>
                <span aria-hidden="true">★</span>
                <span className="visually-hidden">{point}点</span>
              </label>
            </Fragment>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
};
