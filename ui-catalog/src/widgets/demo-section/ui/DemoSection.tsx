import type { ReactNode } from "react";
import styles from "./DemoSection.module.css";

/**
 * カタログの1部品ぶんの枠（部品名・どんなときに使うか・見本）
 *
 *   <DemoSection name="Button" usage="主な操作・送信" importName="Button">
 *     <Button>保存</Button>
 *   </DemoSection>
 */

type DemoSectionProps = {
  /** 部品の名前（import する名前） */
  name: string;
  /** どんなときに使うか */
  usage: string;
  children: ReactNode;
};

export const DemoSection = ({ name, usage, children }: DemoSectionProps) => {
  return (
    <section className={styles.section} aria-labelledby={`demo-${name}`}>
      <div className={styles.header}>
        <h2 id={`demo-${name}`} className={styles.name}>
          {name}
        </h2>
        <p className={styles.usage}>{usage}</p>
      </div>
      <div className={styles.demo}>{children}</div>
    </section>
  );
};
