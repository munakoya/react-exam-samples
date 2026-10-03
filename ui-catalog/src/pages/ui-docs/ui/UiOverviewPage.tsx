import { useState } from "react";
import { Link } from "react-router";
import { ButtonLink, EmptyState, PageHeader, Stack, TextField } from "@/shared/ui";
import { categories, componentDocs, type ComponentDoc } from "../model/componentDocs";
import { CodeBlock } from "./CodeBlock";
import styles from "./UiOverviewPage.module.css";

/**
 * 部品カタログのトップ（/）：検索・部品の一覧・使い始め方
 *
 * 検索は「部品名・説明・使いそうなお題・分類」のどれかに含まれていれば当たる。
 * お題（"アルバム" "家計簿"）や、やりたいこと（"評価" "予算" "画像"）でも探せる。
 */

const setupCode = `// main.tsx：全体のスタイル（リセット CSS ＋ tokens.css）を1回だけ読み込む
import "@/app/styles/global.css";`;

const importCode = `// 使う部品を名前で読み込む
import { Button, Container, Stack, TextField } from "@/shared/ui";`;

const layoutCode = `// ページの組み立ての型
<Container size="sm">
  <Stack gap={5}>
    <PageHeader title="Todo" action={<ButtonLink to="/todos/new">追加</ButtonLink>} />
    <form onSubmit={handleSubmit(onSubmit)} noValidate>…</form>
    {items.length === 0 ? <EmptyState title="Todoがありません" /> : <ul>…</ul>}
  </Stack>
</Container>`;

// 検索の対象にする文字列（小文字にして比べる）
const toSearchText = (doc: ComponentDoc) =>
  [doc.name, doc.description, doc.topics, doc.category].join(" ").toLowerCase();

const examples = ["アルバム", "家計簿", "評価", "画像", "絞り込み", "削除"];

export const UiOverviewPage = () => {
  const [keyword, setKeyword] = useState("");
  const normalized = keyword.trim().toLowerCase();
  // 空白で区切った語をすべて含むものだけ（"在庫 表" → 在庫 と 表 の両方を含む）
  const words = normalized.split(/\s+/).filter(Boolean);
  const hits = componentDocs.filter((doc) =>
    words.every((word) => toSearchText(doc).includes(word)),
  );

  return (
    <Stack gap={6}>
      <PageHeader
        title="UI 部品カタログ"
        description={`CSS Modules と CSS 変数（tokens.css）で作った React の部品（${componentDocs.length}個）。1部品 = 1フォルダで、フォルダごとコピーして使える。`}
        action={
          <ButtonLink to="/form" variant="secondary">
            フォームの組み立て例
          </ButtonLink>
        }
      />

      {/* ----- 検索 ----- */}
      <section className={styles.section}>
        <TextField
          label="部品を探す"
          type="search"
          placeholder="部品名・やりたいこと・お題（例：アルバム、評価、予算）"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <div className={styles.examples}>
          <span>例：</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              className={styles.example}
              onClick={() => setKeyword(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {/* ----- 部品の一覧（分類ごと） ----- */}
      {hits.length === 0 ? (
        <EmptyState title={`「${keyword}」に当てはまる部品はありません`} />
      ) : (
        categories.map((category) => {
          const docs = hits.filter((doc) => doc.category === category);
          if (docs.length === 0) return null; // 検索で0件になった分類は出さない
          return (
            <section key={category} className={styles.section}>
              <h2 className={styles.heading}>{category}</h2>
              <ul className={styles.grid}>
                {docs.map((doc) => (
                  <li key={doc.slug}>
                    {/* カード全体をリンクにする */}
                    <Link to={`/${doc.slug}`} className={styles.card}>
                      <span className={styles.cardTitle}>{doc.name}</span>
                      <span className={styles.cardDescription}>{doc.description}</span>
                      <span className={styles.cardTopics}>お題：{doc.topics}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      {/* ----- 使い始め方（検索中は出さない） ----- */}
      {words.length === 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>使い始める</h2>
          <ol className={styles.steps}>
            <li>
              <p>
                <code>src/app/styles/</code> に <code>global.css</code> と <code>tokens.css</code>{" "}
                を置き、main.tsx で読み込む（中身は <Link to="/tokens">デザイントークン</Link>
                のページ）。
              </p>
              <CodeBlock code={setupCode} fileName="main.tsx" />
            </li>
            <li>
              <p>
                使う部品のページの「ソースコード」を <code>src/shared/ui/部品名/</code> にコピーし、
                <code>src/shared/ui/index.ts</code> から export する。
              </p>
              <CodeBlock code={importCode} />
            </li>
            <li>
              <p>レイアウトは Container・Stack・Grid で組み、間隔は gap でそろえる。</p>
              <CodeBlock code={layoutCode} />
            </li>
          </ol>
        </section>
      )}
    </Stack>
  );
};
