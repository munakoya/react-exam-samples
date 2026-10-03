import { useCopy } from "../model/useCopy";
import styles from "./CodeBlock.module.css";

/**
 * コードの表示（ファイル名＋コピーボタン）
 *
 *   <CodeBlock code={code} fileName="Button.tsx" />
 */

type CodeBlockProps = {
  code: string;
  /** 上部に出すファイル名やラベル */
  fileName?: string;
};

export const CodeBlock = ({ code, fileName }: CodeBlockProps) => {
  const { copied, copy } = useCopy();

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.fileName}>{fileName}</span>
        <button type="button" className={styles.copy} onClick={() => copy(code)}>
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>
      {/* <pre> は空白・改行をそのまま表示する。横に長い行は枠の中でスクロールする */}
      <pre className={styles.pre}>
        <code>{code.trimEnd()}</code>
      </pre>
    </div>
  );
};
