import { useState } from "react";
import { Link, useParams } from "react-router";
import { Badge, ButtonLink, EmptyState, Stack } from "@/shared/ui";
import { componentDocs } from "../model/componentDocs";
import { getComponentFiles } from "../model/sources";
import { CodeBlock } from "./CodeBlock";
import { Demo } from "./Demo";
import { PropsTable } from "./PropsTable";
import styles from "./ComponentDocPage.module.css";

/**
 * 部品1つ分のページ（/:slug）
 *
 *   見出し → インポート → 見本（プレビュー＋コード）→ props → 部品本体のソース
 */
export const ComponentDocPage = () => {
  const { slug } = useParams();
  const doc = componentDocs.find((item) => item.slug === slug);

  if (!doc) {
    return (
      <EmptyState
        title="部品が見つかりません"
        action={<ButtonLink to="/">部品の一覧へ</ButtonLink>}
      />
    );
  }

  // フォルダ名とインポートする名前。省略されていれば部品名と同じ
  const folder = doc.folder ?? doc.name;
  const importNames = (doc.imports ?? [doc.name]).join(", ");
  // 一緒にコピーが必要な部品（フォルダ名から部品のページを探す）
  const dependencies = (doc.dependsOn ?? []).map((name) => ({
    name,
    doc: componentDocs.find((item) => (item.folder ?? item.name) === name),
  }));

  return (
    // key に slug を渡し、別の部品へ移ったら中の state（開いているタブなど）をリセットする
    <Stack key={doc.slug} gap={6}>
      <header className={styles.header}>
        <Badge>{doc.category}</Badge>
        <h1 className={styles.title}>{doc.name}</h1>
        <p className={styles.description}>{doc.description}</p>
        <p className={styles.topics}>
          <span className={styles.topicsLabel}>使いそうなお題</span>
          {doc.topics}
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.heading}>インポート</h2>
        <CodeBlock code={`import { ${importNames} } from "@/shared/ui";`} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>見本</h2>
        <Stack gap={5}>
          {doc.demos.map((demo) => (
            <Demo key={demo.file} title={demo.title} file={demo.file} />
          ))}
        </Stack>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>
        <PropsTable props={doc.props} note={doc.propsNote} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>ソースコード</h2>
        <p className={styles.description}>
          これらのファイルを <code>src/shared/ui/{folder}/</code>{" "}
          にコピーすれば、別のプロジェクトでも使える（<code>tokens.css</code> の CSS
          変数を使っている）。
        </p>
        {dependencies.length > 0 && (
          <p className={styles.description}>
            この部品は次の部品も使うので、一緒にコピーする：
            {dependencies.map(({ name, doc: dependency }, index) => (
              <span key={name}>
                {index > 0 && "・"}
                {dependency ? <Link to={`/${dependency.slug}`}>{name}</Link> : name}
              </span>
            ))}
          </p>
        )}
        <SourceTabs folder={folder} />
      </section>
    </Stack>
  );
};

// 部品本体の .tsx / .module.css をタブで切り替えて表示する
const SourceTabs = ({ folder }: { folder: string }) => {
  const files = getComponentFiles(folder);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = files[activeIndex];

  if (!active) return null;

  return (
    <Stack gap={2}>
      {/* role="tablist" / "tab"：タブであることと、選ばれているタブ（aria-selected）を伝える */}
      <div className={styles.tabs} role="tablist" aria-label="ソースファイル">
        {files.map((file, index) => (
          <button
            key={file.fileName}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={styles.tab}
            onClick={() => setActiveIndex(index)}
          >
            {file.fileName}
          </button>
        ))}
      </div>
      <CodeBlock code={active.code} fileName={active.path} />
    </Stack>
  );
};
