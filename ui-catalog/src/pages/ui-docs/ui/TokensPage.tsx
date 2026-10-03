import type { ReactNode } from "react";
import { PageHeader, Stack } from "@/shared/ui";
import { parseTokens, tokensWithPrefix, type Token } from "../model/parseTokens";
import { globalCss, tokensCss } from "../model/sources";
import { useCopy } from "../model/useCopy";
import { CodeBlock } from "./CodeBlock";
import styles from "./TokensPage.module.css";

/**
 * デザイントークンの一覧（/tokens）
 *
 * tokens.css を読み込んで、色・余白・角丸などを見た目つきで並べる。
 * 名前をクリックすると var(--名前) をコピーできる。
 */

const tokens = parseTokens(tokensCss);

// トークンの見た目の見本。種類ごとに、値を当てた小さな要素を作る
const previews: { prefix: string; title: string; render: (token: Token) => ReactNode }[] = [
  {
    prefix: "--color-",
    title: "色",
    render: (token) => (
      <span className={styles.swatch} style={{ backgroundColor: `var(${token.name})` }} />
    ),
  },
  {
    prefix: "--space-",
    title: "余白",
    render: (token) => <span className={styles.bar} style={{ width: `var(${token.name})` }} />,
  },
  {
    prefix: "--radius-",
    title: "角丸",
    render: (token) => (
      <span className={styles.radius} style={{ borderRadius: `var(${token.name})` }} />
    ),
  },
  {
    prefix: "--font-size-",
    title: "文字の大きさ",
    render: (token) => <span style={{ fontSize: `var(${token.name})` }}>あいうえお Aa</span>,
  },
  {
    prefix: "--shadow-",
    title: "影",
    render: (token) => (
      <span className={styles.shadow} style={{ boxShadow: `var(${token.name})` }} />
    ),
  },
];

// 上の種類に当てはまらないもの（ページ幅・フォーカスなど）
const otherTokens = tokens.filter(
  (token) => !previews.some((preview) => token.name.startsWith(preview.prefix)),
);

export const TokensPage = () => {
  return (
    <Stack gap={6}>
      <PageHeader
        title="デザイントークン"
        description="tokens.css の CSS 変数。部品の *.module.css から var(--名前) で使う。名前をクリックするとコピーできる。"
      />

      {previews.map((preview) => (
        <section key={preview.prefix} className={styles.section}>
          <h2 className={styles.heading}>{preview.title}</h2>
          <TokenTable tokens={tokensWithPrefix(tokens, preview.prefix)} render={preview.render} />
        </section>
      ))}

      <section className={styles.section}>
        <h2 className={styles.heading}>その他</h2>
        <TokenTable tokens={otherTokens} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>ファイル</h2>
        <CodeBlock code={tokensCss} fileName="src/app/styles/tokens.css" />
        <CodeBlock code={globalCss} fileName="src/app/styles/global.css" />
      </section>
    </Stack>
  );
};

// トークンの表。render を渡すと、見本の列を出す
const TokenTable = ({
  tokens,
  render,
}: {
  tokens: Token[];
  render?: (token: Token) => ReactNode;
}) => (
  <ul className={styles.table}>
    {tokens.map((token) => (
      <li key={token.name} className={styles.row} data-preview={render !== undefined}>
        {render && <span className={styles.preview}>{render(token)}</span>}
        <CopyName name={token.name} />
        <code className={styles.value}>{token.value}</code>
        <span className={styles.comment}>{token.comment}</span>
      </li>
    ))}
  </ul>
);

// クリックすると var(--名前) をコピーするボタン
const CopyName = ({ name }: { name: string }) => {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      className={styles.name}
      onClick={() => copy(`var(${name})`)}
      aria-label={`var(${name}) をコピー`}
    >
      {copied ? "コピーしました" : name}
    </button>
  );
};
