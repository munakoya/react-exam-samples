import { Link } from "react-router";
import styles from "./Breadcrumb.module.css";

/**
 * パンくずリスト（今いるページまでの道すじ）
 *
 *   商品一覧 › 牛乳 › 編集
 *
 * 最後の項目は「今のページ」なのでリンクにしない（to を書かない）。
 *
 * 使い方:
 *   <Breadcrumb
 *     items={[
 *       { label: "商品一覧", to: "/items" },
 *       { label: item.name, to: `/items/${item.id}` },
 *       { label: "編集" },
 *     ]}
 *   />
 */

type BreadcrumbItem = {
  label: string;
  /** リンク先。今のページ（最後の項目）には書かない */
  to?: string;
};

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav aria-label="パンくずリスト">
      {/* 順番に意味があるので <ol>（番号付きリスト）。区切りの › は CSS で付ける */}
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={`${index}-${item.label}`} className={styles.item}>
            {item.to ? (
              <Link to={item.to} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              // aria-current="page"：今いるページだと伝える
              <span aria-current="page" className={styles.current}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
