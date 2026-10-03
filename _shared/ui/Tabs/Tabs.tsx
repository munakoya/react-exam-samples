import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Tabs.module.css";

/**
 * タブ（同じ画面の中で表示する内容を切り替える）
 *
 * キーボード操作：← → キーでタブを移動、Home / End で最初 / 最後のタブへ。
 *
 * 使い方:
 *   <Tabs
 *     label="商品の情報"
 *     items={[
 *       { id: "detail", label: "詳細", content: <p>…</p> },
 *       { id: "review", label: "レビュー", content: <ReviewList /> },
 *     ]}
 *   />
 *
 *   // 選ばれているタブを親で持ちたい（URL と合わせるなど）ときは value と onChange を渡す
 *   <Tabs label="…" items={items} value={tab} onChange={setTab} />
 */

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  /** タブ全体の名前（読み上げ用） */
  label: string;
  items: TabItem[];
  /** 選ばれているタブの id（親で持つとき） */
  value?: string;
  onChange?: (id: string) => void;
};

export const Tabs = ({ label, items, value, onChange }: TabsProps) => {
  // value が渡されなければ、自分で選択中のタブを持つ
  const [innerValue, setInnerValue] = useState(items[0]?.id);
  const selectedId = value ?? innerValue;

  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const item = items[index];
    if (!item) return;
    setInnerValue(item.id);
    onChange?.(item.id);
    tabRefs.current[index]?.focus(); // キーボードで移動したタブにフォーカスを移す
  };

  // ← → Home End でタブを移動する（端まで行ったら反対側へ戻る）
  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in next) {
      event.preventDefault();
      select(next[event.key]);
    }
  };

  return (
    <div>
      <div className={styles.tabList} role="tablist" aria-label={label}>
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              // 選ばれているタブだけ Tab キーで止まる。他のタブへは ← → で移動する
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => select(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 選ばれていないパネルは hidden で隠す（中の state は残る） */}
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== selectedId}
          className={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};
