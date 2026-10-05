import "highlight.js/styles/github-dark.css"; // コードの色（rehype-highlight が付けるクラスの色）
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Element, ElementContent } from "hast";
import type { ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Link as RouterLink } from "react-router";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { resolveLink } from "../model/resolveLink";
import { CodeBlock } from "./CodeBlock";

/**
 * Markdown を MUI の部品で表示する ── entities/doc/ui
 *
 *   <MarkdownView markdown={doc.markdown} path={doc.path} />
 *
 * react-markdown が Markdown を React の要素に変え、components で MUI の部品に置き換える。
 *   remark-gfm       … 表・チェックリスト・取り消し線（GitHub の書き方）
 *   rehype-slug      … 見出しに id を付ける（#4-3-zustand のようなリンクで飛べるように）
 *   rehype-highlight … コードに色を付ける
 */

/** コードブロックの中身を、色付けの <span> を外した文字列にする（コピー用） */
const toText = (node: Element | ElementContent): string =>
  node.type === "text" ? node.value : "children" in node ? node.children.map(toText).join("") : "";

/** Markdown のリンク：行き先に合わせて、アプリの中・外・同じページの見出しへ */
const DocLink = ({ path, href = "", children }: { path: string } & ComponentProps<"a">) => {
  const link = resolveLink(path, href);
  switch (link.kind) {
    case "internal":
      return (
        <Link component={RouterLink} to={link.to}>
          {children}
        </Link>
      );
    case "hash":
      return <Link href={`#${link.hash}`}>{children}</Link>;
    case "external":
      return (
        <Link href={link.href} target="_blank" rel="noopener">
          {children}
        </Link>
      );
    case "none":
      return <>{children}</>;
  }
};

// 何度も出てくる見出しの見た目。scrollMarginTop：# で飛んだとき、固定ヘッダーの下に隠れないように
const headingSx = { scrollMarginTop: 80, fontWeight: 700 } as const;

const createComponents = (path: string): Components => ({
  h1: ({ children, id }) => (
    <Typography id={id} variant="h4" component="h1" sx={{ ...headingSx, mb: 2 }}>
      {children}
    </Typography>
  ),
  h2: ({ children, id }) => (
    <Typography id={id} variant="h5" component="h2" sx={{ ...headingSx, mt: 5, mb: 2, pb: 1, borderBottom: 1, borderColor: "divider" }}>
      {children}
    </Typography>
  ),
  h3: ({ children, id }) => (
    <Typography id={id} variant="h6" component="h3" sx={{ ...headingSx, mt: 4, mb: 1.5 }}>
      {children}
    </Typography>
  ),
  h4: ({ children, id }) => (
    <Typography id={id} variant="subtitle1" component="h4" sx={{ ...headingSx, mt: 3, mb: 1 }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => <Typography sx={{ my: 1.5, lineHeight: 1.9 }}>{children}</Typography>,
  a: ({ href, children }) => (
    <DocLink path={path} href={href}>
      {children}
    </DocLink>
  ),
  hr: () => <Divider sx={{ my: 4 }} />,
  blockquote: ({ children }) => (
    <Box
      component="blockquote"
      sx={{ my: 2, mx: 0, px: 2, py: 0.5, borderLeft: 4, borderColor: "primary.light", bgcolor: "grey.50", color: "text.secondary" }}
    >
      {children}
    </Box>
  ),
  // コードブロック（```）。インラインの `code` は下の sx で見た目を付ける
  pre: ({ node, children }) => <CodeBlock text={node ? toText(node) : ""}>{children}</CodeBlock>,
  // 表：狭い画面では表だけを横スクロールさせる
  table: ({ children }) => (
    <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
      <Table size="small">{children}</Table>
    </TableContainer>
  ),
  thead: ({ children }) => <TableHead sx={{ bgcolor: "grey.50" }}>{children}</TableHead>,
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children, style }) => <TableCell sx={{ fontWeight: 700, textAlign: style?.textAlign, whiteSpace: "nowrap" }}>{children}</TableCell>,
  td: ({ children, style }) => <TableCell sx={{ textAlign: style?.textAlign, minWidth: 80, verticalAlign: "top" }}>{children}</TableCell>,
});

export const MarkdownView = ({ markdown, path }: { markdown: string; path: string }) => {
  return (
    <Box
      sx={{
        overflowWrap: "anywhere",
        "& ul, & ol": { pl: 3, my: 1.5 },
        "& li": { my: 0.5, lineHeight: 1.8 },
        "& li > p": { my: 0.5 },
        // インラインのコード（`code`）。コードブロックの中（pre > code）には当てない
        "& :not(pre) > code": {
          px: 0.5,
          py: "1px",
          borderRadius: 0.5,
          bgcolor: "grey.100",
          fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
          fontVariantLigatures: "none", // => や === を記号（⇒・≡）にまとめない
          fontSize: "0.88em",
        },
        // チェックリスト（- [ ]）のチェックボックス
        "& li:has(> input[type=checkbox])": { listStyle: "none", ml: -2.5 },
        "& input[type=checkbox]": { mr: 1 },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // plainText：```text は色付けしない / aliases：```jsonc を json として色付けする
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { plainText: ["text"], aliases: { json: ["jsonc"] } }]]}
        components={createComponents(path)}
      >
        {markdown}
      </ReactMarkdown>
    </Box>
  );
};
