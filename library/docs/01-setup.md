# 1. プロジェクトの作成

> [目次](README.md) ｜ 次：[2. 設計の考え方](02-design.md)

試験開始から 15 分ほどで「MUI の画面が出て、メニューでページを行き来できる状態」まで進める。ここで時間をかけすぎないこと。

> **雛形を使えるなら**：この章の 1-2〜1-10 を済ませた [MUI 版の雛形（starter-mui）](../../starter-mui/README.md) がある。
> `npx degit munakoya/react-exam-samples/starter-mui my-app` でコピーし、名前を 4 か所変えれば 1-11 のコミットまで進める。
> 手順は [試験の実装手順 › 2. 雛形で環境を作る](../../starter-mui/docs/02-start.md)。この章は、雛形の中身の説明・持ち込めない試験で手で作るときに読む。

## 1-1. 必要なもの

| もの     | 確認のしかた    | 補足                                                |
| -------- | --------------- | --------------------------------------------------- |
| Node.js  | `node -v`       | 22 以上を使う（Vite 8 は 20.19 / 22.12 以上が必要） |
| npm      | `npm -v`        | Node.js と一緒に入る                                |
| Git      | `git --version` | コミットの履歴を提出するなら必須                    |
| エディタ | —               | VS Code ＋ 拡張機能「oxc」か「ESLint」、「Prettier」 |

## 1-2. Vite でプロジェクトを作る

```bash
npm create vite@latest library -- --template react-ts
cd library
npm install
npm run dev        # http://localhost:5173 を開いて、Vite の画面が出れば OK
```

## 1-3. パッケージを入れる

```bash
# 見た目（MUI）。@emotion は MUI がスタイルを作るのに使うので、必ず一緒に入れる
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# 状態・フォーム・ルーティング
npm install react-router zustand zod react-hook-form @hookform/resolvers
```

| パッケージ                              | 何をするもの                                                 |
| --------------------------------------- | ------------------------------------------------------------ |
| `@mui/material`                         | ボタン・入力欄・表・ダイアログなどの部品とテーマ             |
| `@emotion/react`・`@emotion/styled`     | MUI の中で CSS を作る仕組み（自分で直接使うことはほぼない）  |
| `@mui/icons-material`                   | Material Icons のアイコン（`import DeleteIcon from …`）      |
| `react-router`                          | URL ごとにページを切り替える                                 |
| `zustand`                               | 複数の画面で共有する状態（store）を作る。localStorage 保存も |
| `zod`                                   | 「データがこの形であること」を書き、チェックする             |
| `react-hook-form`・`@hookform/resolvers` | フォームの入力値・送信・エラーを管理し、チェックを zod に任せる |

**MUI を使うと CSS ファイルはほぼ書かない**。見た目は部品の props（`variant="contained"` など）と `sx`（その場のスタイル）で決める。

## 1-4. ひな形を片付ける

1. `src/App.css`・`src/index.css`・`src/assets/` を削除する（リセット CSS は MUI の `CssBaseline` が受け持つ）
2. `src/App.tsx` を `src/app/App.tsx` に移す
3. `index.html` の `<html lang="en">` を `lang="ja"`、`<title>` をアプリ名にする

## 1-5. `@/` で import できるようにする（パスエイリアス）

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

```jsonc
// tsconfig.app.json の compilerOptions に足す
"paths": { "@/*": ["./src/*"] }
```

`node:url` に型エラーが出たら `npm install -D @types/node`。**2 か所とも必要**（Vite だけだとエディタが赤線、tsconfig だけだと実行時に見つからない）。

## 1-6. フォルダを作る（FSD）

```bash
mkdir -p src/app/providers src/app/layouts src/app/styles
mkdir -p src/pages src/widgets src/features src/entities
mkdir -p src/shared/ui src/shared/lib src/shared/config
```

```text
src/
├── main.tsx      起点
├── app/          アプリ全体の設定（ルーティング・Provider・テーマ）
├── pages/        URL 1 つ分の画面
├── widgets/      entities と features を組み合わせた大きめの UI（表など）
├── features/     ユーザーの操作（登録する・貸し出す・削除する・絞り込む）
├── entities/     扱う「もの」（本・貸出）の型・状態・表示
└── shared/       業務に関係しない共通のもの（自作部品・日付の関数・設定）
```

なぜこの分け方なのかは [2. 設計の考え方](02-design.md#2-4-なぜ-fsd-でフォルダを分けるのか) で説明する。

## 1-7. テーマを作る（CSS 版の tokens.css の代わり）

```ts
// src/app/styles/theme.ts
import { jaJP } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme(
  {
    palette: {
      primary: { main: "#4f46e5" }, // ボタン・リンクの色
      background: { default: "#f8f9fb" }, // ページの背景
    },
    shape: { borderRadius: 8 }, // 角丸の基準（sx の borderRadius: 1 = 8px）
    typography: {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Meiryo", sans-serif',
      button: { textTransform: "none" }, // ボタンの英字を大文字にしない
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } }, // 部品の初期値も変えられる
      MuiCard: { defaultProps: { variant: "outlined" } },
    },
  },
  jaJP, // 部品の文言（表のページ送りなど）を日本語に
);
```

全部の中身は [theme.ts](../src/app/styles/theme.ts)。**最初は palette の primary と fontFamily だけでも十分**。凝るのは最後。

## 1-8. Provider をまとめる

```tsx
// src/app/providers/AppProviders.tsx
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { Notifier } from "@/shared/ui";
import { theme } from "../styles/theme";

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* リセット CSS ＋ 背景色を theme に合わせる */}
    <BrowserRouter useTransitions={false}>
      {children}
      <Notifier /> {/* notify("…") の通知を出す場所。アプリに 1 つ */}
    </BrowserRouter>
  </ThemeProvider>
);
```

```tsx
// src/main.tsx（CSS の import は要らない）
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import { AppProviders } from "@/app/providers/AppProviders";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
```

`useTransitions={false}` の理由は [4. ライブラリ](04-libraries.md#ページの移動と-store-の更新の順番usetransitions) で説明する。

## 1-9. 自作部品を置く（shared/ui）

MUI にない「組み合わせ」だけを `src/shared/ui/` に置く。ボタンや入力欄は MUI のものをそのまま使う。

| 部品                    | 何をするもの                                              | なくても作れるか                    |
| ----------------------- | --------------------------------------------------------- | ----------------------------------- |
| `AppShell`              | ヘッダー ＋ サイドメニュー（スマホは ☰ で開閉）           | AppBar だけの簡単なヘッダーでもよい |
| `FormTextField`         | React Hook Form と TextField をつなぐ                     | 毎回 `Controller` を書けば要らない  |
| `ConfirmDialog`         | 「削除しますか？」の確認                                  | Dialog を毎回書けば要らない         |
| `Notifier`・`notify`    | 画面の下の通知（スナックバー）                            | Snackbar を各画面に置けば要らない   |
| `PageHeader`            | パンくず・タイトル・右のボタン                            | Typography で十分                   |
| `EmptyState`            | 0 件・見つからないときの案内                              | Typography で十分                   |
| `DescriptionList`・`StatCard` | 詳細の項目一覧・集計のカード                        | Grid ＋ Typography で十分           |

中身は [MUI 部品カタログ](https://munakoya.github.io/react-exam-samples/mui-catalog/) の「自作部品」の「ソースコード」からフォルダごとコピーできる（元は [\_shared/mui-ui](../../_shared/mui-ui/)）。
**試験でコピーが許されない・時間がないなら、`FormTextField` と `ConfirmDialog` だけ書けば十分**（ほかは MUI の部品を直接使えばよい）。

## 1-10. ルーティングと共通の枠

```tsx
// src/app/layouts/RootLayout.tsx
import { Outlet } from "react-router";
import { AppShell, type AppShellNavItem } from "@/shared/ui";

const navItems: AppShellNavItem[] = [
  { to: "/", label: "ダッシュボード", end: true },
  { to: "/books", label: "本の一覧", end: true },
  { to: "/books/new", label: "本を登録" },
  { to: "/loans", label: "貸出一覧" },
];

export const RootLayout = () => (
  <AppShell title="蔵書管理" navItems={navItems}>
    <Outlet /> {/* 今の URL のページがここに入る */}
  </AppShell>
);
```

```tsx
// src/app/App.tsx（中身はまだ仮のページ）
import { Route, Routes } from "react-router";
import { RootLayout } from "./layouts/RootLayout";

export const App = () => (
  <Routes>
    <Route element={<RootLayout />}>
      <Route index element={<p>ダッシュボード</p>} />
      <Route path="/books" element={<p>本の一覧</p>} />
      <Route path="/books/new" element={<p>本を登録</p>} />
      <Route path="/books/:bookId" element={<p>本の詳細</p>} />
      <Route path="/books/:bookId/edit" element={<p>本を編集</p>} />
      <Route path="/loans" element={<p>貸出一覧</p>} />
      <Route path="*" element={<p>ページが見つかりません</p>} />
    </Route>
  </Routes>
);
```

## 1-11. 確認してコミットする

- [ ] `npm run dev` で MUI のヘッダーとメニューが出る。メニューでページを行き来できる
- [ ] スマホ幅（DevTools の端末表示）で ☰ が出て、メニューが開閉する
- [ ] `npm run build` が通る（型エラーがない）

```bash
git init
git add .
git commit -m "環境構築（Vite・MUI・テーマ・ルーティング・共通の枠）"
```

---

> 次：[2. 設計の考え方](02-design.md)
