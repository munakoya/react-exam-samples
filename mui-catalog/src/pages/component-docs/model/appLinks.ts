/**
 * サンプルアプリ（MUI 版）へのリンクと、ファイルの「層」の判定 ── pages/component-docs/model
 *
 * 部品・画面パターンのページから、サンプルアプリの実際のコードへ紐付けるのに使う。
 */

/** 公開ページ（GitHub Pages） */
export const PAGES_URL = "https://munakoya.github.io/react-exam-samples";
/** 公開リポジトリのファイル表示 */
const REPO_BLOB_URL = "https://github.com/munakoya/react-exam-samples/blob/main";

/** サンプルアプリのファイル1つ。path は samples からのパス（"user-management/src/…"） */
export type AppFile = {
  path: string;
  /** そのファイルで何をしているか（使用例の説明） */
  note: string;
};

export const appNames: Record<string, string> = {
  "user-management": "ユーザー管理",
  "task-manager-mui": "タスク管理（MUI 版）",
  library: "蔵書管理",
  "household-budget": "家計簿",
};

/** "user-management/src/…" → "user-management" */
export const getAppName = (path: string) => path.split("/")[0] ?? "";

/** GitHub でファイルを開く URL */
export const getRepoUrl = (path: string) => `${REPO_BLOB_URL}/${path}`;

/** 動くサンプルアプリの URL（appPath は "/users" のようなアプリの中のパス） */
export const getAppUrl = (app: string, appPath = "/") => `${PAGES_URL}/${app}${appPath}`;

// ---------- FSD の層 ----------

export const fsdLayers = ["app", "pages", "widgets", "features", "entities", "shared"] as const;
export type FsdLayer = (typeof fsdLayers)[number];

/** 層ごとの役目（説明に使う） */
export const fsdLayerDescriptions: Record<FsdLayer, string> = {
  app: "ルーティング・Provider・テーマ",
  pages: "URL 1つ分の画面。組み立てとダイアログの開閉だけ",
  widgets: "entities の見せ方 ＋ features の操作を組み合わせた大きめの UI（表・カード一覧）",
  features: "ユーザーの操作 1つ分（追加・編集フォーム、削除ボタン、絞り込み）",
  entities: "扱う「もの」の型・store・見せ方（操作は持たない）",
  shared: "業務を知らない部品・関数（DataTable・DialogForm・ConfirmDialog など）",
};

/** Chip の色 */
export const fsdLayerColors: Record<FsdLayer, "default" | "primary" | "secondary" | "success" | "warning" | "info"> = {
  app: "default",
  pages: "primary",
  widgets: "secondary",
  features: "success",
  entities: "warning",
  shared: "info",
};

/** "user-management/src/features/user-form/ui/UserFormDialog.tsx" → "features" */
export const getLayer = (path: string): FsdLayer | undefined =>
  fsdLayers.find((layer) => path.includes(`/src/${layer}/`));

/** "user-management/src/features/user-form/ui/UserFormDialog.tsx" → "features/user-form/ui/UserFormDialog.tsx" */
export const getSrcPath = (path: string) => path.split("/src/")[1] ?? path;
