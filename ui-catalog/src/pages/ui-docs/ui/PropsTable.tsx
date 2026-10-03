import type { PropDoc } from "../model/componentDocs";
import styles from "./PropsTable.module.css";

/**
 * props の一覧表（名前・型・初期値・説明）
 */
export const PropsTable = ({ props, note }: { props: PropDoc[]; note?: string }) => {
  return (
    <div className={styles.wrapper}>
      {/* 狭い画面では表だけ横スクロールさせる */}
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">名前</th>
              <th scope="col">型</th>
              <th scope="col">初期値</th>
              <th scope="col">説明</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name}>
                <th scope="row">
                  <code className={styles.name}>{prop.name}</code>
                  {/* 必須の印。読み上げでは「必須」と伝える */}
                  {prop.required && (
                    <span className={styles.required} title="必須">
                      *<span className="visually-hidden">必須</span>
                    </span>
                  )}
                </th>
                <td>
                  <code className={styles.type}>{prop.type}</code>
                </td>
                <td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
};
