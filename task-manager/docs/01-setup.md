# 1. プロジェクトの作成

> [目次](README.md) ｜ 次：[2. 設計の考え方](02-design.md)

試験開始から 15 分ほどで「画面が出て、部品が使える状態」まで進める。ここで時間をかけすぎないこと。

## 1-1. 必要なもの

| もの     | 確認のしかた    | 補足                                                           |
| -------- | --------------- | -------------------------------------------------------------- |
| Node.js  | `node -v`       | 22 以上を使う（Vite 8 は 20.19 / 22.12 以上が必要）            |
| npm      | `npm -v`        | Node.js と一緒に入る                                           |
| Git      | `git --version` | コミットの履歴を提出するなら必須                               |
| エディタ | —               | VS Code ＋ 拡張機能「ESLint」か「oxc」、「Prettier」があると楽 |

## 1-2. Vite でプロジェクトを作る

```bash
npm create vite@latest task-manager -- --template react-ts
cd task-manager
npm install
npm run dev        # http://localhost:5173 を開いて、Vite の画面が出れば OK
```

- `--template react-ts`：React ＋ TypeScript のひな形を使う
- `npm run dev`：開発サーバー。保存するとすぐ画面に反映される（止めるときは `Ctrl + C`）

**なぜ Vite か**：設定がほぼ不要で、起動・反映が速い。React の公式ドキュメントも、ゼロから作るなら Vite などのビルドツールを使う方法を案内している。

## 1-3. パッケージを入れる

```bash
npm install react-router zustand zod react-hook-form @hookform/resolvers
```

| パッケージ            | 何をするもの                                                 |
| --------------------- | ------------------------------------------------------------ |
| `react-router`        | URL ごとにページを切り替える                                 |
| `zustand`             | 複数の画面で共有する状態（store）を作る。localStorage 保存も |
| `zod`                 | 「データがこの形であること」を書き、チェックする             |
| `react-hook-form`     | フォームの入力値・送信・エラーを管理する                     |
| `@hookform/resolvers` | react-hook-form のチェックを zod に任せるためのつなぎ        |

CSS Modules（`*.module.css`）は Vite に最初から入っているので、追加のインストールは要らない。

## 1-4. ひな形を片付ける

1. `src/App.css`・`src/index.css`・`src/assets/` を削除する
2. `src/App.tsx` を `src/app/App.tsx` に移す
3. `index.html` の `<html lang="en">` を `lang="ja"`、`<title>` をアプリ名にする

```tsx
// src/app/App.tsx（最初はこれだけ）
export const App = () => {
  return <div>App</div>;
};
```

## 1-5. `@/` で import できるようにする（パスエイリアス）

深いフォルダから `../../../shared/ui` と書く代わりに、`@/shared/ui` と書けるようにする。
ファイルを移動しても import を直さずに済み、どの層を読んでいるかも一目で分かる。

```ts
// vite.config.ts（Vite に「@ は src のこと」と教える）
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

```jsonc
// tsconfig.app.json の compilerOptions に足す（TypeScript にも同じことを教える）
"paths": {
  "@/*": ["./src/*"]
}
```

`node:url` に型エラーが出たら `npm install -D @types/node` を入れる。
**2 か所とも必要**：Vite だけだとエディタが赤線を出し、tsconfig だけだと実行時に見つからない。

## 1-6. フォルダを作る（FSD）

```bash
mkdir -p src/app/providers src/app/layouts src/app/styles
mkdir -p src/pages src/widgets src/features src/entities
mkdir -p src/shared/ui src/shared/lib src/shared/config
```

```text
src/
├── main.tsx      起点
├── app/          アプリ全体の設定（ルーティング・Provider・全体の CSS）
├── pages/        URL 1 つ分の画面
├── widgets/      entities と features を組み合わせた大きめの UI
├── features/     ユーザーの操作（追加する・削除する・絞り込む）
├── entities/     扱う「もの」（タスク）の型・状態・表示
└── shared/       業務に関係しない共通のもの（部品・関数・設定）
```

なぜこの分け方なのかは [2. 設計の考え方](02-design.md#2-4-なぜ-fsd-でフォルダを分けるのか) で説明する。最初は空のフォルダでよい。

## 1-7. スタイルの土台を置く

| ファイル                    | 中身                                                                 |
| --------------------------- | -------------------------------------------------------------------- |
| `src/app/styles/tokens.css` | 色・余白・角丸・文字の大きさなどの **CSS 変数**（デザイントークン）  |
| `src/app/styles/global.css` | リセット CSS（余白の初期値を消すなど）。先頭で tokens.css を読み込む |

中身はこのリポジトリの [tokens.css](../src/app/styles/tokens.css)・[global.css](../src/app/styles/global.css) をコピーする（UI 部品カタログの「デザイントークン」のページでも見られる）。

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/styles/global.css"; // 全体の CSS は、ここで 1 回だけ読み込む
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

**なぜ CSS 変数か**：色や余白を `var(--color-primary)`・`var(--space-4)` のように名前で使うと、アプリ全体の見た目がそろい、変えるときも tokens.css の 1 か所で済む。

## 1-8. UI 部品を置く

`src/shared/ui/` に部品（Button・TextField・Modal など）を置く。
1 部品 = 1 フォルダ（`.tsx` と `.module.css`）なので、[UI 部品カタログ](https://munakoya.github.io/react-exam-samples/ui-catalog/) の「ソースコード」から必要なものだけコピーすればよい。

```ts
// src/shared/ui/index.ts（外へ出す窓口。使う部品だけ export する）
export { Button } from "./Button/Button";
export { TextField } from "./TextField/TextField";
// …
```

```tsx
// 使う側
import { Button, TextField } from "@/shared/ui";
```

試験で部品のコピーが許されない・時間がない場合は、素の `<button>` と CSS Modules で書いてよい。部品は「同じ見た目を何度も書かない」ためのもので、なくても機能は作れる。

## 1-9. ルーティングと Provider の骨組み

```tsx
// src/app/providers/AppProviders.tsx
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { ToastProvider } from "@/shared/ui";

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <BrowserRouter useTransitions={false}>
    <ToastProvider>{children}</ToastProvider>
  </BrowserRouter>
);
```

`useTransitions={false}` の理由は [4. ライブラリ](04-libraries.md#ページの移動と-store-の更新の順番usetransitions) で説明する。

```tsx
// src/app/App.tsx（中身はまだ仮のページ）
import { Navigate, Route, Routes } from "react-router";

export const App = () => (
  <Routes>
    <Route index element={<Navigate to="/tasks" replace />} />
    <Route path="/tasks" element={<p>タスク一覧</p>} />
    <Route path="/board" element={<p>ボード</p>} />
    <Route path="*" element={<p>ページが見つかりません</p>} />
  </Routes>
);
```

## 1-10. 確認してコミットする

- [ ] `npm run dev` で画面が出る。`/tasks`・`/board`・存在しない URL で表示が変わる
- [ ] `@/` の import でエラーが出ない
- [ ] `npm run build` が通る（型エラーがない）

```bash
git init          # まだなら
git add .
git commit -m "環境構築（Vite・パッケージ・パスエイリアス・スタイルの土台）"
```

`.gitignore` に `node_modules` と `dist` が入っていることを確認する（Vite のひな形には最初から入っている）。

---

> 次：[2. 設計の考え方](02-design.md)
