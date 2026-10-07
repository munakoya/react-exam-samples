import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import { AppProviders } from "@/app/providers/AppProviders";

/**
 * アプリの起点。index.html の <div id="root"> に React を描画する。
 *
 * CSS のリセットや全体の色は、MUI の CssBaseline と theme（app/styles/theme.ts）が受け持つので、
 * CSS ファイルの import は要らない（AppProviders の中で読み込んでいる）。
 *
 * StrictMode：開発中だけ、コンポーネントをわざと2回描画して、副作用の書き間違いに気付かせる。
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
