import type { ReactNode } from "react";
import styles from "./DescriptionList.module.css";

/**
 * 「項目名：値」を並べる（詳細ページ・確認画面）
 *
 *   カテゴリ   食品
 *   在庫数     12
 *   メモ       1行目
 *              2行目
 *
 * HTML の <dl>（説明リスト）を使う。<dt> が項目名、<dd> が値。
 * 狭い幅では、項目名の下に値を置く1列になる。
 *
 * 使い方:
 *   <DescriptionList
 *     items={[
 *       { term: "カテゴリ", description: categoryLabels[item.category] },
 *       { term: "在庫数", description: <>{item.quantity} <StockBadge item={item} /></> },
 *       { term: "メモ", description: item.memo || "—", multiline: true },
 *     ]}
 *   />
 */

type DescriptionItem = {
  term: string;
  description: ReactNode;
  /** true なら、入力された改行をそのまま表示する（メモ・本文など） */
  multiline?: boolean;
};

export const DescriptionList = ({ items }: { items: DescriptionItem[] }) => {
  return (
    <dl className={styles.list}>
      {items.map((item) => (
        // <dt> と <dd> の組を <div> で包むのは、HTML のルールで許されている（CSS で1行にまとめやすい）
        <div key={item.term} className={styles.row}>
          <dt className={styles.term}>{item.term}</dt>
          <dd className={styles.description} data-multiline={item.multiline}>
            {item.description}
          </dd>
        </div>
      ))}
    </dl>
  );
};
