import type { ReactNode } from "react";
import styles from "./Table.module.css";

/**
 * 表（列の定義とデータの配列を渡して作る）
 *
 * 狭い画面では、表だけが枠の中で横スクロールする（ページ全体ははみ出さない）。
 *
 * 使い方:
 *   type Item = { id: string; name: string; price: number };
 *
 *   const columns: TableColumn<Item>[] = [
 *     { key: "name", header: "商品名", render: (item) => item.name, rowHeader: true },
 *     { key: "price", header: "価格", render: (item) => `¥${item.price}`, align: "right" },
 *     { key: "memo", header: "メモ", render: (item) => item.memo, wrap: true },   … 長い文章は折り返す
 *     { key: "actions", header: "操作", render: (item) => <Button size="sm">編集</Button> },
 *   ];
 *
 *   <Table caption="商品一覧" columns={columns} rows={items} getRowKey={(item) => item.id} />
 */

export type TableColumn<T> = {
  /** 列を区別する名前（key に使う） */
  key: string;
  header: string;
  /** 1行分のデータから、セルに表示する内容を作る */
  render: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  /** true ならこの列のセルを「行の見出し」（<th scope="row">）にする。名前の列などに使う */
  rowHeader?: boolean;
  /** true なら、この列だけ文字を折り返す（説明・メモなど長い文章の列）。初期値は折り返さない */
  wrap?: boolean;
};

// <T>：rows の型（Item など）が、columns の render の引数の型として使われる
type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  /** 行ごとに重複しない key を返す関数（id など） */
  getRowKey: (row: T) => string;
  /** 表の名前（読み上げ用。画面には出さない） */
  caption?: string;
  /** 0件のときの文言 */
  emptyMessage?: string;
};

export const Table = <T,>({
  columns,
  rows,
  getRowKey,
  caption,
  emptyMessage = "データがありません",
}: TableProps<T>) => {
  return (
    // tabIndex={0}：横スクロールする領域に、キーボードでも入れるようにする
    <div className={styles.scroll} tabIndex={0} role="region" aria-label={caption}>
      <table className={styles.table}>
        {caption && <caption className="visually-hidden">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" data-align={column.align}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              {/* colSpan で全列をつなげ、0件の文言を中央に出す */}
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) =>
                  column.rowHeader ? (
                    <th
                      key={column.key}
                      scope="row"
                      data-align={column.align}
                      data-wrap={column.wrap}
                    >
                      {column.render(row)}
                    </th>
                  ) : (
                    <td key={column.key} data-align={column.align} data-wrap={column.wrap}>
                      {column.render(row)}
                    </td>
                  ),
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
