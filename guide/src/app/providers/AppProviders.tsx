import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { theme } from "../styles/theme";

/**
 * アプリ全体を包む Provider ── app/providers
 *
 *   ThemeProvider … MUI のテーマ（色・角丸・部品の初期値）
 *   CssBaseline   … リセット CSS
 *   BrowserRouter … URL とページの対応。basename は GitHub Pages の公開先（/リポジトリ名/guide/）
 */

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={basename} useTransitions={false}>
        {children}
      </BrowserRouter>
    </ThemeProvider>
  );
};
