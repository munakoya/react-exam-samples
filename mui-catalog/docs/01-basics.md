# 1. 土台：導入・テーマ・sx

> [目次](README.md) ｜ 次：[2. レイアウト](02-layout.md)

## 1-1. 入れる

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material   # アイコンを使うとき
```

`@emotion/react`・`@emotion/styled` は MUI が CSS を作るのに使う。自分で直接使うことはほぼないが、**入れないと動かない**。

## 1-2. テーマ（色・角丸・文字・部品の初期値）

```ts
// src/app/styles/theme.ts
import { jaJP } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme(
  {
    palette: {
      primary: { main: "#4f46e5" }, // ボタン・リンク・選択中の色
      secondary: { main: "#0d9488" },
      error: { main: "#dc2626" },
      background: { default: "#f8f9fb", paper: "#ffffff" }, // ページの背景・Card などの背景
    },
    shape: { borderRadius: 8 }, // sx の borderRadius: 1 = 8px
    typography: {
      // 日本語が読みやすい OS 標準のフォント（Roboto を別に読み込まなくてよい）
      fontFamily: 'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Meiryo", sans-serif',
      button: { textTransform: "none", fontWeight: 600 }, // ボタンの英字を大文字にしない
    },
    components: {
      // 部品ごとの初期値。毎回 props を書かなくても使われる
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiCard: { defaultProps: { variant: "outlined" } },
      MuiTextField: { defaultProps: { size: "small" } }, // 入力欄を少し小さく（好みで）
      // 見た目の上書き
      MuiTableCell: { styleOverrides: { head: { fontWeight: 700 } } },
    },
  },
  jaJP, // MUI の部品の文言（表のページ送りの「1ページの行数」など）を日本語にする
);
```

| 書く場所                         | 何が変わるか                                                   |
| -------------------------------- | -------------------------------------------------------------- |
| `palette`                        | `color="primary"`・`sx={{ color: "error.main" }}` の色          |
| `shape.borderRadius`             | 部品の角丸、sx の `borderRadius` の単位                         |
| `spacing`（初期値 8）            | sx の `p: 1`・Stack の `spacing={1}` の単位                     |
| `typography`                     | 文字の種類・大きさ                                             |
| `components.MuiXxx.defaultProps` | 部品の props の初期値                                          |
| `components.MuiXxx.styleOverrides` | 部品の見た目（CSS）の上書き                                  |

**最初は palette の primary と fontFamily だけで十分**。凝るのは最後にする。

## 1-3. アプリを包む

```tsx
// src/app/providers/AppProviders.tsx
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* ブラウザごとの差をなくすリセット CSS。body の余白を消し、背景色を theme に */}
    <BrowserRouter>{children}</BrowserRouter>
  </ThemeProvider>
);
```

`CssBaseline` があるので、`index.css` などの CSS ファイルは要らない。

## 1-4. 部品とアイコンを読み込む

```tsx
// 部品は 1 つずつ読み込む（default export）
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// まとめて書いてもよい（どちらでも動く）
import { Button, TextField } from "@mui/material";

// 型は名前付きで一緒に読み込める
import Select, { type SelectChangeEvent } from "@mui/material/Select";

// アイコン：@mui/icons-material/アイコン名。名前は Material Icons の検索ページで探す
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
<DeleteOutlinedIcon fontSize="small" color="error" />
```

アイコンには種類がある：`Delete`（塗り）・`DeleteOutlined`（線）・`DeleteRounded`・`DeleteSharp`・`DeleteTwoTone`。
v9 では古い `…Outline`（`DeleteOutline` など）が削除された。**線のアイコンは `…Outlined`**。

## 1-5. 見た目の決め方：props → sx → theme

| 決め方                    | 例                                                    | 使う場面                     |
| ------------------------- | ----------------------------------------------------- | ---------------------------- |
| 部品の props              | `<Button variant="contained" color="error" size="small">` | まずこれ。用意された見た目 |
| `sx`（その場のスタイル）  | `<Box sx={{ p: 2, display: "flex", gap: 1 }}>`        | 余白・並べ方・少しの調整     |
| theme                     | `components.MuiButton.defaultProps`                   | アプリ全体で同じにしたいとき |

### sx の書き方

```tsx
<Box
  sx={{
    // 余白：数値は theme.spacing の倍数（1 = 8px）
    p: 2, // padding: 16px
    mt: 1, // margin-top: 8px
    px: { xs: 1, md: 3 }, // 画面幅で変える

    // 色：theme の palette の名前で書く（#xxxxxx を直接書かない）
    color: "text.secondary",
    bgcolor: "background.paper",
    borderColor: "divider",

    border: 1, // 1px solid
    borderRadius: 1, // 8px

    // flex・grid も CSS と同じ名前（キャメルケース）
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,

    // 大きさ：数値は px、0〜1 の数値は %（width: 1/2 = 50%）、文字列はそのまま
    width: { xs: "100%", sm: 320 },

    // 疑似クラス・子要素・MUI の部品のクラス
    "&:hover": { bgcolor: "action.hover" },
    "& .MuiChip-root": { ml: 1 },

    // theme を受け取る関数でも書ける
    zIndex: (theme) => theme.zIndex.drawer + 1,
  }}
/>
```

| 短い名前    | CSS                                    |
| ----------- | -------------------------------------- |
| `p`・`m`    | padding・margin                        |
| `px`・`py`  | 左右・上下（`mx: "auto"` で中央寄せ）  |
| `pt`・`pr`・`pb`・`pl` | 上・右・下・左               |
| `bgcolor`   | background-color                       |

**v9 では `<Box mt={2}>` のように props に直接書けない**（システム props が削除された）。必ず `sx={{ mt: 2 }}`。
`Stack` の `direction`・`spacing`、`Typography` の `color`・`align` は部品の props なので、そのまま書ける。

## 1-6. レスポンシブ（画面幅で変える）

| 名前 | 幅           | 目安                 |
| ---- | ------------ | -------------------- |
| `xs` | 0px〜        | スマホ               |
| `sm` | 600px〜      | 大きめのスマホ・タブレット（縦） |
| `md` | 900px〜      | タブレット（横）・小さめの PC |
| `lg` | 1200px〜     | PC                   |
| `xl` | 1536px〜     | 大きな画面           |

**その幅「以上」で切り替わる**（スマホを先に書いて、広い画面で上書きする）。

```tsx
// sx・Stack・Grid の値をオブジェクトにする
<Box sx={{ display: { xs: "none", md: "block" } }} />               // PC だけ表示
<Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2 }} />
<Grid size={{ xs: 12, sm: 6, md: 4 }} />                            // 1 列 → 2 列 → 3 列

// JS で判定する（表示するものを丸ごと変えるとき）
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
const theme = useTheme();
const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // 900px 以上なら true
```

## 1-7. component：見た目はそのままで、タグや部品を変える

```tsx
<Typography variant="h5" component="h1">ページのタイトル</Typography>  // 見た目は h5、タグは <h1>
<Stack component="form" onSubmit={…}>…</Stack>                         // Stack を <form> にする
<Box component="ul">…</Box>
<Button component={RouterLink} to="/books">一覧へ</Button>             // ボタンの見た目のリンク
<TableContainer component={Paper}>…</TableContainer>                  // 枠付きの白い面にする
```

見出しの順番（h1 → h2 → h3）は `component` で正しく保ち、大きさは `variant` で選ぶ。

## 1-8. slotProps：部品の中の部品に props を渡す

MUI の部品はいくつかの部品の組み合わせ（TextField ＝ ラベル ＋ 入力欄 ＋ 補足説明）。中の部品へは `slotProps` で渡す。

```tsx
<TextField
  label="価格"
  type="number"
  slotProps={{
    htmlInput: { min: 0, step: 100, inputMode: "numeric" }, // <input> 自体の属性
    input: { startAdornment: <InputAdornment position="start">¥</InputAdornment> }, // 入力欄の左右
    inputLabel: { shrink: true }, // ラベルを常に上に置く（日付の入力欄など）
  }}
/>

<Dialog slotProps={{ transition: { onExited: () => reset() } }} />     // 閉じるアニメーションの後
<Menu slotProps={{ list: { "aria-labelledby": "menu-button" } }} />
<Checkbox slotProps={{ input: { "aria-label": "選択" } }} />
```

古い記事の `InputProps`・`inputProps`・`InputLabelProps`・`PaperProps`・`TransitionProps` は v9 では使えない。

## 1-9. 型の調べ方

1. 部品の上でエディタの「定義へ移動」（F12）
2. `node_modules/@mui/material/<部品>/<部品>.d.ts` に、props・型・初期値（`@default`）が全部書いてある（説明は英語）
3. 公式ドキュメントの各部品のページ下の「API」リンク

---

> 次：[2. レイアウト](02-layout.md)
