import { REPO_URL } from "@/shared/config";
import { docsByPath, docUrl } from "./docs";

/**
 * 読みものの中のリンクを、このアプリでの行き先に変える ── entities/doc/model
 *
 * Markdown のリンクは「そのファイルからの相対パス」で書いてある（GitHub でそのまま読めるように）。
 *   [4. ライブラリ](04-libraries.md#4-3-zustand) … ほかの読みもの → このアプリの中のページ
 *   [taskStore.ts](../src/entities/…)          … ソースコード     → GitHub のファイル
 *   [Zustand](https://…)                         … 外のサイト       → そのまま（別タブ）
 */

export type ResolvedLink =
  | { kind: "internal"; to: string } // このアプリの中（React Router で移動）
  | { kind: "external"; href: string } // 外のサイト・GitHub
  | { kind: "hash"; hash: string } // 同じページの見出し
  | { kind: "none" }; // samples の外など、行き先がない

/** "library/docs/../src/a.ts" のような "." と ".." を含むパスを整える */
const normalizePath = (path: string) => {
  const parts: string[] = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (parts.length === 0) return null; // samples より上へ出た
      parts.pop();
    } else {
      parts.push(part);
    }
  }
  return parts.join("/");
};

export const resolveLink = (fromPath: string, href: string): ResolvedLink => {
  // http: や mailto: などで始まる → 外のリンク
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return { kind: "external", href };

  const [rawPath, rawHash = ""] = href.split("#");
  // 見出しの id は日本語のまま（%E3… になっていたら戻す）
  const hash = rawHash ? decodeURIComponent(rawHash) : "";
  if (rawPath === "") return { kind: "hash", hash };

  const dir = fromPath.slice(0, fromPath.lastIndexOf("/") + 1); // "library/docs/"
  const resolved = normalizePath(dir + decodeURIComponent(rawPath));
  if (resolved === null) return { kind: "none" };

  // 読みものなら、このアプリの中へ。フォルダなら、その README を探す
  const doc = docsByPath.get(resolved) ?? docsByPath.get(resolved === "" ? "README.md" : `${resolved}/README.md`);
  if (doc) return { kind: "internal", to: docUrl(doc) + (hash ? `#${hash}` : "") };

  // それ以外は GitHub へ。最後の部分に拡張子（.ts など）がなければフォルダとみなす
  const isFile = /\.[a-z0-9]+$/i.test(resolved);
  return { kind: "external", href: `${REPO_URL}/${isFile ? "blob" : "tree"}/main/${resolved}${hash ? `#${hash}` : ""}` };
};
