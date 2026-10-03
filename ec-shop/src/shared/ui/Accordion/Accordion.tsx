import { useId, type ReactNode } from "react";
import styles from "./Accordion.module.css";

/**
 * アコーディオン（見出しをクリックすると中身が開閉する）
 *
 * ブラウザ標準の <details> と <summary> を使うので、開閉の state を持たなくてよい。
 * キーボード（Enter・Space）での開閉や読み上げにも、ブラウザが対応している。
 *
 * 使い方:
 *   <Accordion
 *     items={[
 *       { title: "送料はいくらですか？", content: <p>全国一律 500円です。</p> },
 *       { title: "返品できますか？", content: <p>到着から7日以内なら可能です。</p>, defaultOpen: true },
 *     ]}
 *   />
 *
 *   // exclusive：1つ開くと、ほかは自動で閉じる
 *   <Accordion items={items} exclusive />
 */

type AccordionItem = {
  title: string;
  content: ReactNode;
  /** 最初から開いておく */
  defaultOpen?: boolean;
};

type AccordionProps = {
  items: AccordionItem[];
  /** true なら、同時に1つだけ開く */
  exclusive?: boolean;
};

export const Accordion = ({ items, exclusive = false }: AccordionProps) => {
  // 同じ name を付けた <details> は、1つ開くとほかが閉じる（ブラウザ標準の機能）
  const groupName = useId();

  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details
          key={item.title}
          className={styles.item}
          name={exclusive ? groupName : undefined}
          open={item.defaultOpen}
        >
          {/* <summary> が見出し兼、開閉のボタンになる */}
          <summary className={styles.summary}>{item.title}</summary>
          <div className={styles.content}>{item.content}</div>
        </details>
      ))}
    </div>
  );
};
