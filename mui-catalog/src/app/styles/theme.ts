import { jaJP } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

/**
 * アプリ全体のテーマ（色・角丸・文字・部品の初期設定） ── app/styles
 *
 * CSS 版の tokens.css の役割をここが受け持つ。部品では色を直接書かず、theme の値を名前で使う。
 *
 *   <Box sx={{ color: "primary.main", p: 2 }}>   … p: 2 は theme.spacing(2) = 16px
 *   <Typography color="text.secondary">
 *
 * theme を変えれば、アプリ全体の見た目がまとめて変わる。
 */
export const theme = createTheme(
  {
    // ---------- 色 ----------
    palette: {
      primary: { main: "#4f46e5" }, // メインの色（ボタン・リンク・選択中）
      secondary: { main: "#0d9488" },
      error: { main: "#dc2626" }, // 削除・期限切れ
      warning: { main: "#d97706" }, // 期限が近い
      success: { main: "#16a34a" }, // 貸出可・完了
      background: {
        default: "#f8f9fb", // ページの背景
        paper: "#ffffff", // Card・Dialog などの背景
      },
    },

    // ---------- 角丸 ----------
    // sx で borderRadius: 1 と書くと 8px になる（この値が基準）
    shape: { borderRadius: 8 },

    // ---------- 文字 ----------
    typography: {
      // 日本語が読みやすい OS 標準のフォント（Roboto を別に読み込まなくてよい）
      fontFamily: 'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Meiryo", sans-serif',
      // ボタンの文字を大文字にしない（MUI の初期設定は大文字）
      button: { textTransform: "none", fontWeight: 600 },
    },

    // ---------- 部品ごとの初期設定 ----------
    // defaultProps に書いた値は、毎回 props を書かなくても使われる
    components: {
      MuiButton: { defaultProps: { disableElevation: true } }, // 影なしのフラットなボタン
      MuiCard: { defaultProps: { variant: "outlined" } }, // 影ではなく枠線で区切る
      MuiPaper: {
        styleOverrides: { outlined: { borderColor: "#e2e4e9" } }, // 枠線の色を薄くする
      },
      MuiTableCell: {
        styleOverrides: { head: { fontWeight: 700, whiteSpace: "nowrap" } }, // 表の見出しを太字・折り返さない
      },
    },
  },
  // 2つ目の引数に渡すと、MUI の部品の文言が日本語になる（TablePagination の「1ページの行数」など）
  jaJP,
);
