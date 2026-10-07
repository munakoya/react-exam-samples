import type { ComponentType } from "react";

/**
 * 見本（demos）と部品本体のソースコードを読み込む ── pages/component-docs/model
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

// ---------- 自作部品（shared/ui）のソース ----------
// "/src/..." はプロジェクトのルートからのパス
const sharedUiSources = import.meta.glob<string>("/src/shared/ui/*/*.{tsx,ts}", {
  eager: true,
  query: "?raw",
  import: "default",
});

/** 部品のフォルダ名（"Notifier"）から、フォルダ内のファイル名と中身をすべて取り出す（.tsx を先に） */
export const getSharedUiFiles = (folder: string) => {
  const prefix = `/src/shared/ui/${folder}/`;
  return Object.entries(sharedUiSources)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, code]) => ({ fileName: path.slice(prefix.length), path: path.slice(1), code }))
    .toSorted((a, b) => Number(b.fileName.endsWith(".tsx")) - Number(a.fileName.endsWith(".tsx")));
};

// ---------- テーマ ----------
const themeSources = import.meta.glob<string>(
  ["/src/app/styles/theme.ts", "/src/app/providers/AppProviders.tsx"],
  { eager: true, query: "?raw", import: "default" },
);

export const themeTs = themeSources["/src/app/styles/theme.ts"] ?? "";
export const appProvidersTsx = themeSources["/src/app/providers/AppProviders.tsx"] ?? "";

// ---------- サンプルアプリ（MUI 版）のソース ----------
// 部品・画面パターンの「サンプルアプリでの使用例」に表示する。
// 数が多いので eager にせず、表示するときに1ファイルずつ読み込む（値は「読み込む関数」）。
// shared/ui は各アプリへのコピーなので除く（元は _shared/mui-ui。このカタログにも同じものがある）。
// カタログだけを取り出して動かしたとき（サンプルアプリがない）は、空のまま動く。
const appSourceLoaders = import.meta.glob<string>(
  [
    "@samples/{user-management,task-manager-mui,library,household-budget}/src/**/*.{ts,tsx}",
    "!@samples/*/src/shared/ui/**",
  ],
  { query: "?raw", import: "default" },
);

/** glob のキー（"../user-management/src/app/App.tsx" など）を、samples からのパスにする */
const toSamplesPath = (key: string) => key.replace(/^(?:\.\.?\/|\/)+/, "");

const appSourceLoaderMap = new Map(
  Object.entries(appSourceLoaders).map(([key, load]) => [toSamplesPath(key), load]),
);

// 同じファイルを何度も読み込まないように、読み込み中・読み込み済みの Promise を覚えておく
const appSourceCache = new Map<string, Promise<string | undefined>>();

/**
 * サンプルアプリのファイル（"user-management/src/features/user-form/ui/UserFormDialog.tsx"）の中身を読み込む
 * ファイルがないときは undefined。React の use() に渡して使う（AppSourceTabs）
 */
export const loadAppSource = (path: string) => {
  let promise = appSourceCache.get(path);
  if (!promise) {
    promise = appSourceLoaderMap.get(path)?.() ?? Promise.resolve(undefined);
    appSourceCache.set(path, promise);
  }
  return promise;
};
