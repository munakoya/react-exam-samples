import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { Notifier } from "@/shared/ui";
import { theme } from "../styles/theme";

/**
 * アプリ全体を包む Provider をまとめたもの ── app/providers
 *
 * main.tsx では <AppProviders><App /></AppProviders> と書くだけでよい。
 *
 *   ThemeProvider … 中のすべての MUI の部品が theme（色・角丸・初期設定）を使えるようにする
 *   CssBaseline   … ブラウザごとの差をなくすリセット CSS。body の余白を消し、背景色を theme に合わせる
 *   BrowserRouter … URL とページを対応させる（useNavigate・<Link> などはこの中でしか使えない）
 *   Notifier      … notify("…") で出す通知（スナックバー）の表示場所。アプリに1つだけ置く
 *
 * Zustand の store は Provider が要らない（どこからでも useXxxStore を呼べる）。
 */

/*
 * アプリを置く場所（basename）。
 * ふだんは "/"。GitHub Pages のように "/リポジトリ名/アプリ名/" の下に置くときは、
 * ビルド時の vite build --base で決めた値が import.meta.env.BASE_URL に入る。
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/*
        useTransitions={false}：ページの移動を、すぐに画面へ反映させる。
        初期設定の React Router はページの移動を少し遅らせて反映するが、Zustand の更新はすぐ反映されるので、
        「navigate してから store を変える」と書いた順に動かないことがある。false にすると書いた順に動く。
      */}
      <BrowserRouter basename={basename} useTransitions={false}>
        {children}
        <Notifier />
      </BrowserRouter>
    </ThemeProvider>
  );
};
