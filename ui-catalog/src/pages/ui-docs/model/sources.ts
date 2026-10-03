import type { ComponentType } from "react";

/**
 * 見本（demos）と部品本体のソースコードを読み込む
 *
 * import.meta.glob（Vite の機能）で、パターンに合うファイルをまとめて読み込む。
 *   - 普通に読み込む          → 画面に表示するコンポーネントとして使う
 *   - query: "?raw" で読み込む → ファイルの中身を「文字列」として受け取り、コードとして表示する
 * 同じファイルを両方の方法で読むので、表示しているコードと動いている見本が必ず一致する。
 */

// ---------- 見本 ----------
// eager: true でアプリの起動時にまとめて読み込む（キーは "../demos/button/Variants.tsx" のようなパス）
const demoComponents = import.meta.glob<{ default: ComponentType }>("../demos/**/*.tsx", {
  eager: true,
});
const demoSources = import.meta.glob<string>("../demos/**/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
});

/** "button/Variants" のような名前から、見本のコンポーネントとソースコードを取り出す */
export const getDemo = (name: string) => {
  const path = `../demos/${name}.tsx`;
  const Component = demoComponents[path]?.default;
  const code = demoSources[path];
  if (!Component || code === undefined) throw new Error(`見本が見つかりません: ${path}`);
  return { Component, code };
};

// ---------- 部品本体（shared/ui）のソース ----------
// "/src/..." はプロジェクトのルートからのパス
const componentSources = import.meta.glob<string>("/src/shared/ui/*/*.{tsx,ts,css}", {
  eager: true,
  query: "?raw",
  import: "default",
});

// 表示する順番：.tsx → .ts → .css
const extensionOrder = (fileName: string) =>
  fileName.endsWith(".tsx") ? 0 : fileName.endsWith(".ts") ? 1 : 2;

/** 部品のフォルダ名（"Button"）から、フォルダ内のファイル名と中身をすべて取り出す */
export const getComponentFiles = (folder: string) => {
  const prefix = `/src/shared/ui/${folder}/`;
  return Object.entries(componentSources)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, code]) => ({ fileName: path.slice(prefix.length), path: path.slice(1), code }))
    .sort((a, b) => extensionOrder(a.fileName) - extensionOrder(b.fileName));
};

// ---------- 全体のスタイル ----------
const styleSources = import.meta.glob<string>("/src/app/styles/{tokens,global}.css", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const tokensCss = styleSources["/src/app/styles/tokens.css"] ?? "";
export const globalCss = styleSources["/src/app/styles/global.css"] ?? "";
