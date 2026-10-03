import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// 全体のスタイル（リセット CSS ＋ tokens.css の CSS 変数）。1回だけここで読み込む
import "@/app/styles/global.css";
import { App } from "@/app/App";
import { AppProviders } from "@/app/providers/AppProviders";

/**
 * アプリの起点。index.html の <div id="root"> に React を描画する。
 *
 * StrictMode：開発中だけ、コンポーネントをわざと2回描画して、副作用の書き間違いに気付かせる。
 *             （本番ビルドでは何もしない。useEffect が2回動くのはこのため）
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
