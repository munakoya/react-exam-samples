/**
 * 読みもの（Markdown）の一覧 ── entities/doc/model
 *
 * サンプル集の Markdown（解説書・ガイド・各サンプルの README）を、ビルドのときにまとめて読み込む。
 * 元のファイルを直せば、このアプリの表示もそのまま変わる（中身をコピーして持たない）。
 *
 *   import.meta.glob(…, { query: "?raw" }) … ファイルの中身を「文字列」として読み込む（Vite の機能）
 *   "@samples" は vite.config.ts で決めた別名で、samples フォルダのこと
 */

const files = import.meta.glob<string>(
  ["@samples/README.md", "@samples/*/README.md", "@samples/*/docs/*.md", "!@samples/node_modules/**"],
  { eager: true, query: "?raw", import: "default" },
);

/**
 * glob のキー（"../library/docs/01-setup.md" など）を、samples からのパス（"library/docs/01-setup.md"）にする
 * 先頭の "../"・"./"・"/" を取り除く
 */
const toSamplesPath = (key: string) => key.replace(/^(?:\.\.?\/|\/)+/, "");

const contents = new Map(Object.entries(files).map(([key, markdown]) => [toSamplesPath(key), markdown]));

// ---------- 型 ----------

export type Doc = {
  bookId: string;
  /** URL の最後の部分（本の目次は ""） */
  slug: string;
  /** 最初の「# 見出し」 */
  title: string;
  /** samples からのパス（"library/docs/03-modern-js.md"） */
  path: string;
  markdown: string;
};

export type DocBook = {
  id: string;
  title: string;
  description: string;
  docs: Doc[];
};

// ---------- 本（まとまり）の定義 ----------

type BookDef = {
  id: string;
  title: string;
  description: string;
} & (
  | { dir: string } // フォルダの中の *.md をすべて（README.md が目次）
  | { files: { path: string; slug: string }[] } // ファイルを1つずつ指定
);

const bookDefs: BookDef[] = [
  {
    id: "exam-steps",
    title: "試験の実装手順（雛形から提出まで）",
    description: "MUI 版の雛形をコピーして始め、要件の書き出し → 機能ごとのステップ → 仕上げ・提出までを、チェックリストで漏れなく進める",
    dir: "starter-mui/docs/",
  },
  {
    id: "library",
    title: "解説書（MUI 版・蔵書管理）",
    description: "環境構築・設計・モダン JS・ライブラリ（React Router・Zustand・zod・React Hook Form・MUI）・実装手順・考え方とつまずき",
    dir: "library/docs/",
  },
  {
    id: "mui-guide",
    title: "MUI 画面構築ガイド",
    description: "テーマと sx・レイアウト・フォーム・一覧・ダイアログと通知・画面パターン集",
    dir: "mui-catalog/docs/",
  },
  {
    id: "task-manager",
    title: "解説書（CSS 版・タスク管理）",
    description: "CSS Modules で作るときの環境構築・設計・モダン JS・ライブラリ・実装手順・考え方",
    dir: "task-manager/docs/",
  },
  {
    id: "samples",
    title: "サンプルの README（お題・要件）",
    description: "サンプル集の目次と、各サンプルのお題・要件・実装の順番・学習ポイント",
    files: [
      { path: "README.md", slug: "" },
      { path: "library/README.md", slug: "library" },
      { path: "task-manager-mui/README.md", slug: "task-manager-mui" },
      { path: "household-budget/README.md", slug: "household-budget" },
      { path: "user-management/README.md", slug: "user-management" },
      { path: "starter-mui/README.md", slug: "starter-mui" },
      { path: "mui-catalog/README.md", slug: "mui-catalog" },
      { path: "task-manager/README.md", slug: "task-manager" },
      { path: "inventory/README.md", slug: "inventory" },
      { path: "ec-shop/README.md", slug: "ec-shop" },
      { path: "reservation/README.md", slug: "reservation" },
      { path: "ui-catalog/README.md", slug: "ui-catalog" },
    ],
  },
];

/** Markdown の最初の「# 見出し」を取り出す（なければファイル名） */
const getTitle = (markdown: string, fallback: string) =>
  markdown.match(/^#\s+(.+)$/m)?.[1].trim() ?? fallback;

const createDoc = (bookId: string, path: string, slug: string): Doc | undefined => {
  const markdown = contents.get(path);
  if (markdown === undefined) return undefined;
  return { bookId, slug, path, markdown, title: getTitle(markdown, path) };
};

/** フォルダの中のファイルを、README.md（目次）→ ファイル名の順に並べる */
const docsInDir = (bookId: string, dir: string) =>
  [...contents.keys()]
    .filter((path) => path.startsWith(dir) && !path.slice(dir.length).includes("/"))
    .toSorted((a, b) => (a.endsWith("README.md") ? -1 : b.endsWith("README.md") ? 1 : a.localeCompare(b)))
    .map((path) => {
      const fileName = path.slice(dir.length).replace(/\.md$/, "");
      return createDoc(bookId, path, fileName === "README" ? "" : fileName);
    });

export const docBooks: DocBook[] = bookDefs.map((def) => ({
  id: def.id,
  title: def.title,
  description: def.description,
  docs: ("dir" in def
    ? docsInDir(def.id, def.dir)
    : def.files.map((file) => createDoc(def.id, file.path, file.slug))
  ).filter((doc) => doc !== undefined),
}));

/** すべての読みもの（本の順） */
export const allDocs = docBooks.flatMap((book) => book.docs);

/** samples からのパス → 読みもの（リンクの行き先を探すのに使う） */
export const docsByPath = new Map(allDocs.map((doc) => [doc.path, doc]));

/** 読みもののページの URL（"/library/03-modern-js"・本の目次は "/library"） */
export const docUrl = (doc: Pick<Doc, "bookId" | "slug">) =>
  doc.slug === "" ? `/${doc.bookId}` : `/${doc.bookId}/${doc.slug}`;

export const findBook = (bookId: string | undefined) => docBooks.find((book) => book.id === bookId);

export const findDoc = (bookId: string | undefined, slug: string | undefined) =>
  findBook(bookId)?.docs.find((doc) => doc.slug === (slug ?? ""));
