import { allDocs, docBooks, docUrl, splitSections } from "@/entities/doc";

/**
 * 読みもの全体の検索 ── features/doc-search/model
 *
 * 見出しごとのまとまり（セクション）に分けておき、キーワードを含むセクションを探す。
 * スペースで区切ると AND 検索（すべての語を含むもの）になる。
 */

export type SearchResult = {
  /** 見出しまで飛ぶ URL（"/library/04-libraries#4-3-zustand"） */
  to: string;
  bookTitle: string;
  docTitle: string;
  heading: string;
  /** キーワードの前後の本文 */
  snippet: string;
  /** 見出しにキーワードがあるか（あるものを上に出す） */
  inHeading: boolean;
};

// アプリを開いたときに1回だけ作る（読みものは変わらないので）
const bookTitles = new Map(docBooks.map((book) => [book.id, book.title]));
const index = allDocs.flatMap((doc) =>
  splitSections(doc.markdown).map((section) => ({
    doc,
    section,
    // 探しやすいように、小文字にして空白をまとめておく
    headingText: section.heading.toLowerCase(),
    text: `${section.heading}\n${section.body}`.toLowerCase(),
  })),
);

/** 本文から、キーワードの前後を切り出す（Markdown の記号は少し外す） */
const makeSnippet = (body: string, term: string) => {
  const plain = body
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [文字](リンク) → 文字
    .replace(/[`#*|>]|-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const at = plain.toLowerCase().indexOf(term);
  if (at === -1) return plain.slice(0, 80);
  const start = Math.max(0, at - 40);
  return `${start > 0 ? "…" : ""}${plain.slice(start, at + term.length + 60)}…`;
};

export const MAX_RESULTS = 50;

export const searchDocs = (query: string): SearchResult[] => {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return index
    .filter((entry) => terms.every((term) => entry.text.includes(term)))
    .map(({ doc, section, headingText }) => ({
      to: docUrl(doc) + (section.id ? `#${section.id}` : ""),
      bookTitle: bookTitles.get(doc.bookId) ?? "",
      docTitle: doc.title,
      heading: section.heading || doc.title,
      snippet: makeSnippet(section.body, terms[0]),
      inHeading: terms.some((term) => headingText.includes(term)),
    }))
    // 見出しにキーワードがあるものを先に（sort は元の順番を保つので、同じなら読みものの順）
    .toSorted((a, b) => Number(b.inHeading) - Number(a.inHeading))
    .slice(0, MAX_RESULTS);
};
