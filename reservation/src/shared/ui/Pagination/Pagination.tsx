import styles from "./Pagination.module.css";

/**
 * ページ送り（« 1 … 4 5 6 … 10 »）
 *
 * 表示するページ番号：最初・最後・今のページの前後1つ。間は「…」で省略する。
 *
 * 使い方:
 *   const PER_PAGE = 10;
 *   const [page, setPage] = useState(1);
 *   const pageCount = Math.ceil(items.length / PER_PAGE);
 *   const visibleItems = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
 *
 *   <Pagination page={page} pageCount={pageCount} onChange={setPage} />
 */

type PaginationProps = {
  /** 今のページ（1 から数える） */
  page: number;
  /** 全部で何ページあるか */
  pageCount: number;
  onChange: (page: number) => void;
};

// 表示するページ番号の一覧を作る。省略する場所は "ellipsis"
//   page=5, pageCount=10 → [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
const getPageItems = (page: number, pageCount: number): (number | "ellipsis")[] => {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  sorted.forEach((p, index) => {
    const prev = sorted[index - 1];
    if (prev !== undefined && p - prev > 1) items.push("ellipsis"); // 番号が飛んでいたら「…」
    items.push(p);
  });
  return items;
};

export const Pagination = ({ page, pageCount, onChange }: PaginationProps) => {
  // 1ページしかなければ表示しない
  if (pageCount <= 1) return null;

  return (
    // <nav> と aria-label で「ページ送り」のナビゲーションだと伝える
    <nav aria-label="ページ送り">
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={styles.button}
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
            aria-label="前のページ"
          >
            ‹
          </button>
        </li>

        {getPageItems(page, pageCount).map((item, index) =>
          item === "ellipsis" ? (
            // 「…」は位置で区別するしかないので、index を key に含める
            <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={styles.button}
                onClick={() => onChange(item)}
                // aria-current="page"：今のページであることを伝える。CSS でもこれを見て色を変える
                aria-current={item === page ? "page" : undefined}
                aria-label={`${item}ページ目`}
              >
                {item}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            className={styles.button}
            onClick={() => onChange(page + 1)}
            disabled={page === pageCount}
            aria-label="次のページ"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
};
