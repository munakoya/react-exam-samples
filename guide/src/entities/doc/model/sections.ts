import GithubSlugger from "github-slugger";
import type { Doc } from "./docs";

/**
 * Markdown を見出しごとのまとまり（セクション）に分ける ── entities/doc/model
 *
 * ページの右の「目次」と、全文検索に使う。
 * 見出しの id は、表示のとき rehype-slug が付ける id と同じ作り方（github-slugger）にする。
 * GitHub で付く id とも同じなので、Markdown の中の「#4-3-zustand」のようなリンクがそのまま使える。
 */

export type Section = {
  /** 見出しの深さ（# = 1, ## = 2 …）。本文の冒頭（最初の見出しの前）は 0 */
  depth: number;
  heading: string;
  /** 見出しの id（URL の # の後ろ） */
  id: string;
  /** 見出しの下の本文（次の見出しまで） */
  body: string;
};

/** 見出しの Markdown の飾りを外す（`code`・[リンク](…)・**太字**） */
const toPlainText = (text: string) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();

export const splitSections = (markdown: string): Section[] => {
  const slugger = new GithubSlugger(); // 同じ見出しが2回出たら "-1" を付けるので、ページごとに作る
  const sections: Section[] = [{ depth: 0, heading: "", id: "", body: "" }];
  let inCode = false;

  for (const line of markdown.split("\n")) {
    // ``` の間（コード）は見出しとして数えない
    if (/^\s*```/.test(line)) inCode = !inCode;
    const match = inCode ? null : line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const heading = toPlainText(match[2]);
      sections.push({ depth: match[1].length, heading, id: slugger.slug(heading), body: "" });
    } else {
      sections[sections.length - 1].body += `${line}\n`;
    }
  }
  return sections;
};

/** ページの右に出す目次（## と ###） */
export const getToc = (doc: Doc) =>
  splitSections(doc.markdown).filter((section) => section.depth === 2 || section.depth === 3);
