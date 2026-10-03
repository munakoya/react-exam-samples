import styles from "./Spinner.module.css";

/**
 * 読み込み中を示す回転アイコン
 *
 * 使い方:
 *   if (isPending) return <Spinner />;
 *   <Spinner label="保存中" />
 */
export const Spinner = ({ label = "読み込み中" }: { label?: string }) => {
  return (
    // role="status"：読み込み中であることをスクリーンリーダーへ伝える
    <div className={styles.wrapper} role="status">
      {/* 回る円は飾りなので読み上げない */}
      <span className={styles.spinner} aria-hidden="true" />
      {/* visually-hidden（global.css）：画面には出さず、読み上げだけする */}
      <span className="visually-hidden">{label}</span>
    </div>
  );
};
