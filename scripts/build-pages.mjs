/**
 * GitHub Pages に公開するために、全アプリをまとめてビルドする
 *
 *   node scripts/build-pages.mjs
 *
 * できあがり（_site/）:
 *   _site/
 *   ├── index.html          トップページ（アプリへのリンクの一覧）
 *   ├── 404.html            GitHub Pages が「見つからない URL」で返すページ（下の「再読み込み対策」）
 *   ├── task-manager/       各アプリ（/リポジトリ名/task-manager/ で開く）
 *   ├── inventory/
 *   └── …
 *
 * 環境変数（GitHub Actions で自動で渡す。手元で試すときは省略してよい）:
 *   PAGES_BASE      公開先のパス。GitHub Pages では "/リポジトリ名/"
 *   PAGES_REPO_URL  リポジトリの URL（トップページから README へのリンクに使う）
 *
 * ---------- 再読み込み対策 ----------
 * GitHub Pages は、/react-exam-samples/inventory/items/abc のような「ファイルがない URL」を開くと 404.html を返す。
 * そこで 404.html に、アプリのトップ（/react-exam-samples/inventory/?redirect=/items/abc）へ移動させるスクリプトを置き、
 * 各アプリの index.html では、redirect の値を見て元の URL（/items/abc）に戻してから React を動かす。
 */
import { execSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(root, "_site");
const base = process.env.PAGES_BASE ?? "/react-exam-samples/";
const repoUrl = process.env.PAGES_REPO_URL ?? "";
const { workspaces } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// トップページに出す説明（package.json の workspaces に足したら、ここにも足す）
const appInfo = {
  guide: {
    title: "解説書・ガイド（読みもの）",
    description:
      "ライブラリ・モダン JS・設計と実装の考え方・MUI 画面構築ガイド・各サンプルの要件を検索して読める",
  },
  "ui-catalog": {
    title: "UI 部品カタログ",
    description:
      "全サンプル共通の部品の見本・props・ソースコード。お題ややりたいことから検索できる",
  },
  "task-manager": {
    title: "タスク管理",
    description: "モーダルで追加・編集、並び替え、期限切れの判定、かんばんボード",
  },
  inventory: {
    title: "在庫管理",
    description: "登録・編集・詳細、URL で絞り込み、入出庫と履歴、在庫数に応じたチェック",
  },
  "ec-shop": {
    title: "ECショップ",
    description: "商品一覧・カート・合計の計算・購入フォーム・注文履歴",
  },
  reservation: {
    title: "会議室予約",
    description: "時間の重なり・定員のチェック、CSS Grid のスケジュール表",
  },
  "mui-catalog": {
    title: "MUI 部品カタログ",
    description:
      "Material UI の部品の押さえどころ・動く見本・props。画面の組み立て方は README の「MUI 画面構築ガイド」",
  },
  "task-manager-mui": {
    title: "タスク管理（MUI 版）",
    description: "CSS 版と同じお題を MUI で。ダイアログで追加・編集、絞り込み・並び替え、かんばんボード",
  },
  "household-budget": {
    title: "家計簿（MUI 版）",
    description: "1 ページの小さな形。種類で変わるカテゴリ、月の合計・カテゴリ別の内訳、予算のバー",
  },
  "starter-mui": {
    title: "MUI 版の雛形（starter-mui）",
    description: "試験のスタート用。環境構築済みで中身は空。各フォルダの README に書き方。手順は解説書の「試験の実装手順」",
  },
  "user-management": {
    title: "ユーザー管理（MUI 版）",
    description: "CRUD の UI をひととおり。追加・編集モーダル、削除の確認、チェックボックスで選べる表（一括操作）、カード表示",
  },
  library: {
    title: "蔵書管理（MUI 版）",
    description: "MUI ＋ RHF ＋ zod ＋ Zustand。貸出・返却・期限切れ、URL で絞り込み・並び替え・ページ送り",
  },
};

// アプリの一覧（読みもの・カタログを先頭に、この順で並べる。ほかは workspaces の順）
const pinned = ["guide", "ui-catalog", "mui-catalog"];
const rank = (app) => (pinned.includes(app) ? pinned.indexOf(app) : pinned.length);
const apps = [...workspaces].sort((a, b) => rank(a) - rank(b));

// 各アプリの index.html の <head> に入れる「元の URL に戻す」スクリプト
const restoreScript = `<script>
      // GitHub Pages の 404.html から ?redirect=/items/abc で戻ってきたら、元の URL に戻す
      (function () {
        var redirect = new URLSearchParams(location.search).get("redirect");
        if (redirect) history.replaceState(null, "", location.pathname.replace(/\\/$/, "") + redirect);
      })();
    </script>`;

const escapeHtml = (text) =>
  text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// ---------- 1. 各アプリをビルドする ----------
rmSync(siteDir, { recursive: true, force: true });

for (const app of apps) {
  const outDir = join(siteDir, app);
  console.log(`\n=== build: ${app} → ${base}${app}/`);
  // --base：アプリを置くパス。import.meta.env.BASE_URL にも入り、BrowserRouter の basename に使われる
  execSync(`npx vite build --base ${base}${app}/ --outDir "${outDir}" --emptyOutDir`, {
    cwd: join(root, app),
    stdio: "inherit",
  });

  const indexPath = join(outDir, "index.html");
  const html = readFileSync(indexPath, "utf8").replace(
    "</title>",
    `</title>\n    ${restoreScript}`,
  );
  writeFileSync(indexPath, html);
}

// ---------- 2. 404.html（ファイルがない URL を、アプリのトップへ送る） ----------
writeFileSync(
  join(siteDir, "404.html"),
  `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>ページが見つかりません</title>
    <script>
      (function () {
        var base = ${JSON.stringify(base)};
        var apps = ${JSON.stringify(apps)};
        var path = location.pathname;
        if (path.indexOf(base) !== 0) return;
        // "/react-exam-samples/inventory/items/abc" → app: "inventory", inner: "/items/abc"
        var rest = path.slice(base.length);
        var slash = rest.indexOf("/");
        var app = slash === -1 ? rest : rest.slice(0, slash);
        var inner = slash === -1 ? "/" : rest.slice(slash);
        if (apps.indexOf(app) === -1) return;
        location.replace(
          base + app + "/?redirect=" + encodeURIComponent(inner + location.search + location.hash),
        );
      })();
    </script>
  </head>
  <body>
    <p>ページが見つかりません。<a href="${base}">トップへ</a></p>
  </body>
</html>
`,
);

// ---------- 3. トップページ ----------
const cards = apps
  .map((app) => {
    const info = appInfo[app] ?? { title: app, description: "" };
    const readme = repoUrl
      ? `<a class="readme" href="${repoUrl}/tree/main/${app}">README・コード</a>`
      : "";
    return `<li class="card">
          <a class="title" href="${base}${app}/">${escapeHtml(info.title)}</a>
          <p>${escapeHtml(info.description)}</p>
          ${readme}
        </li>`;
  })
  .join("\n        ");

writeFileSync(
  join(siteDir, "index.html"),
  `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>React 試験対策サンプル集</title>
    <style>
      :root { --primary: #4f46e5; --border: #e2e4e9; --muted: #6b7280; }
      * { box-sizing: border-box; }
      body { margin: 0; background: #f8f9fb; color: #1a1a1a; line-height: 1.6;
        font-family: system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Meiryo", sans-serif; }
      main { max-width: 960px; margin: 0 auto; padding: 48px 16px; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      .lead { margin: 0 0 32px; color: var(--muted); }
      ul { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;
        margin: 0; padding: 0; list-style: none; }
      .card { display: flex; flex-direction: column; gap: 8px; padding: 20px;
        border: 1px solid var(--border); border-radius: 12px; background: #fff; }
      .card:nth-child(-n + 3) { border-color: var(--primary); } /* 先頭の3つ（読みもの・カタログ）を強調 */
      .card p { flex: 1; margin: 0; color: var(--muted); font-size: 14px; }
      .title { color: var(--primary); font-size: 18px; font-weight: 700; text-decoration: none; }
      .title:hover { text-decoration: underline; }
      .readme { font-size: 13px; color: var(--muted); }
    </style>
  </head>
  <body>
    <main>
      <h1>React 試験対策サンプル集</h1>
      <p class="lead">
        FSD・Zustand（persist）・React Hook Form ＋ zod・React Router・CSS Modules（または Material UI）で作ったサンプル。
        データはブラウザの localStorage に保存される。
      </p>
      <ul>
        ${cards}
      </ul>
    </main>
  </body>
</html>
`,
);

console.log(`\n完了：${siteDir}`);
