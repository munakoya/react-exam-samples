import { useState } from "react";
import { getDemo } from "../model/sources";
import { useCopy } from "../model/useCopy";
import { CodeBlock } from "./CodeBlock";
import styles from "./Demo.module.css";

/**
 * 見本1つ分：動く見本（プレビュー）＋ コードの表示・コピー
 *
 *   <Demo title="種類" file="button/Variants" />
 *
 * file は demos/ からのパス。同じファイルを「部品」と「文字列」の両方で読み込んでいる（model/sources.ts）。
 */

type DemoProps = {
  title: string;
  file: string;
};

export const Demo = ({ title, file }: DemoProps) => {
  const { Component, code } = getDemo(file);
  const [showCode, setShowCode] = useState(false);
  const { copied, copy } = useCopy();

  return (
    <section className={styles.demo}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.frame}>
        {/* 動く見本 */}
        <div className={styles.preview}>
          <Component />
        </div>

        {/* コードの表示切り替えとコピー */}
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.toolButton}
            onClick={() => setShowCode((prev) => !prev)}
            aria-expanded={showCode}
          >
            {showCode ? "コードを隠す" : "コードを表示"}
          </button>
          <button type="button" className={styles.toolButton} onClick={() => copy(code)}>
            {copied ? "コピーしました" : "コードをコピー"}
          </button>
        </div>
      </div>

      {showCode && <CodeBlock code={code} fileName={`demos/${file}.tsx`} />}
    </section>
  );
};
