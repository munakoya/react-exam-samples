import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { EmptyState, PageHeader } from "@/shared/ui";
import { muiCategories, muiDocs, type MuiDoc } from "../model/muiDocs";
import { patternDocs, type PatternDoc } from "../model/patterns";
import { CodeBlock } from "./CodeBlock";
import { RichText } from "./RichText";

/**
 * カタログのトップ（/）：部品を探す・使い始め方・v9 の注意点
 */

const GUIDE_URL = "https://munakoya.github.io/react-exam-samples/guide/mui-guide";
const LIBRARY_URL = "https://munakoya.github.io/react-exam-samples/library/";

const installCode = `npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material   # アイコンを使うとき`;

const providerCode = `// app/providers/AppProviders.tsx
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../styles/theme";

<ThemeProvider theme={theme}>
  <CssBaseline />   {/* ブラウザごとの差をなくすリセット CSS */}
  <BrowserRouter>{children}</BrowserRouter>
</ThemeProvider>`;

const importCode = `// 部品は1つずつ読み込む（import { Button } from "@mui/material" と書いても動く）
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
// アイコンは @mui/icons-material/アイコン名
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";`;

const pageCode = `// ページの組み立ての型
<Container maxWidth="lg" sx={{ py: 3 }}>
  <Stack spacing={3}>
    <PageHeader title="本の一覧" action={<Button variant="contained">本を登録</Button>} />
    <BookFilterBar … />
    {books.length === 0 ? <EmptyState title="まだ本がありません" /> : <BookTable … />}
  </Stack>
</Container>`;

// v9 で書き方が変わったもの。古い記事・AI の答えはこの書き方のことが多い
const changes: { before: string; after: string; target: string }[] = [
  { before: "`InputProps={{ startAdornment }}`", after: "`slotProps={{ input: { startAdornment } }}`", target: "TextField" },
  { before: "`inputProps={{ min: 0 }}`", after: "`slotProps={{ htmlInput: { min: 0 } }}`", target: "TextField" },
  { before: "`InputLabelProps={{ shrink: true }}`", after: "`slotProps={{ inputLabel: { shrink: true } }}`", target: "TextField" },
  { before: "`<Grid item xs={12} md={6}>`", after: "`<Grid size={{ xs: 12, md: 6 }}>`（item は不要）", target: "Grid" },
  { before: "`<Box mt={2}>`・`<Stack alignItems=\"center\">`", after: "`sx={{ mt: 2 }}`・`sx={{ alignItems: \"center\" }}`", target: "Box・Stack・Typography・Grid" },
  { before: "`<Typography paragraph>`", after: "`gutterBottom` か `sx={{ mb: 2 }}`", target: "Typography" },
  { before: "`inputProps`・`inputRef`", after: "`slotProps={{ input: { …, ref } }}`", target: "Checkbox・Radio・Switch" },
  { before: "`renderTags`", after: "`renderValue`", target: "Autocomplete" },
  { before: "`disableEscapeKeyDown`", after: "onClose で `reason === \"escapeKeyDown\"` なら何もしない", target: "Dialog・Modal" },
  { before: "`PaperProps`・`TransitionProps`", after: "`slotProps={{ paper, transition }}`", target: "Dialog・Accordion・Snackbar など" },
  { before: "`<ListItem button>`", after: "`<ListItemButton>`", target: "List" },
  { before: "`<LoadingButton loading>`（@mui/lab）", after: "`<Button loading>`", target: "Button" },
  { before: "`DeleteOutline`・`ErrorOutline` など（アイコン）", after: "`DeleteOutlined`・`ErrorOutlined`（`…Outline` は削除）", target: "@mui/icons-material" },
];

/** 部品名・説明・押さえどころ・分類のどれかにキーワードを含むか */
const matches = (doc: MuiDoc, keyword: string) =>
  [doc.name, doc.description, doc.category, ...doc.points].some((text) =>
    text.toLowerCase().includes(keyword),
  );

/** 画面パターンの名前・説明・押さえどころのどれかにキーワードを含むか */
const matchesPattern = (pattern: PatternDoc, keyword: string) =>
  [pattern.name, pattern.description, ...pattern.points].some((text) => text.toLowerCase().includes(keyword));

// 一覧のカード1枚（部品・画面パターンで共通）
const LinkCard = ({ to, title, description }: { to: string; title: string; description: string }) => (
  <Card sx={{ height: "100%" }}>
    <CardActionArea component={RouterLink} to={to} sx={{ height: "100%", alignItems: "flex-start" }}>
      <CardContent>
        <Typography sx={{ fontWeight: 700, color: "primary.main" }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export const OverviewPage = () => {
  // 検索のキーワードは、このページの中だけで使うので useState
  const [keyword, setKeyword] = useState("");
  const normalized = keyword.trim().toLowerCase();
  const visibleDocs = muiDocs.filter((doc) => matches(doc, normalized));
  const visiblePatterns = patternDocs.filter((pattern) => matchesPattern(pattern, normalized));

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={5}>
        <PageHeader
          title="MUI 部品カタログ"
          description="Material UI（@mui/material v9）のよく使う部品を、公式ドキュメントをもとに日本語でまとめたもの。部品ごとに、押さえどころ・動く見本とコード・主な props を見られる。"
        />

        <Alert severity="info" icon={<MenuBookOutlinedIcon />}>
          画面の組み立て方（レイアウト・フォーム・一覧・ダイアログ・画面パターン）は{" "}
          <Link href={GUIDE_URL} target="_blank" rel="noopener">
            MUI 画面構築ガイド
          </Link>
          、ライブラリと組み合わせたアプリは{" "}
          <Link href={LIBRARY_URL} target="_blank" rel="noopener">
            蔵書管理（library）
          </Link>
          を見る。
        </Alert>

        {/* ----- 部品を探す ----- */}
        <Stack component="section" spacing={2}>
          <TextField
            type="search"
            label="部品を探す"
            placeholder="部品名・やりたいこと（例：モーダル、チェックボックス、並び替え、削除、通知）"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* ----- 画面パターン（CRUD）：試験でよく出る画面を、サンプルアプリのコードと紐付けて見る ----- */}
          {visiblePatterns.length > 0 && (
            <Stack spacing={1.5}>
              <Typography variant="h6" component="h2">
                画面パターン（CRUD）
              </Typography>
              <Typography variant="body2" color="text.secondary">
                追加ボタン → モーダル、カードの編集 → 編集モーダル、削除 → 確認ダイアログ、チェックボックス付きの表など。
                1ファイル版の見本と、FSD で分けたサンプルアプリ（ユーザー管理）のコードを並べて見られる。
              </Typography>
              <Grid container spacing={2}>
                {visiblePatterns.map((pattern) => (
                  <Grid key={pattern.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                    <LinkCard to={`/patterns/${pattern.slug}`} title={pattern.name} description={pattern.description} />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )}

          {visibleDocs.length === 0 && visiblePatterns.length === 0 ? (
            <EmptyState title="見つかりません" description="別のことばで探してください。" />
          ) : (
            muiCategories.map((category) => {
              const docs = visibleDocs.filter((doc) => doc.category === category);
              if (docs.length === 0) return null;
              return (
                <Stack key={category} spacing={1.5}>
                  <Typography variant="h6" component="h2">
                    {category}
                  </Typography>
                  {/* スマホ 1列・600px〜 2列・900px〜 3列 */}
                  <Grid container spacing={2}>
                    {docs.map((doc) => (
                      <Grid key={doc.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                        <LinkCard to={`/${doc.slug}`} title={doc.name} description={doc.description} />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              );
            })
          )}
        </Stack>

        {/* ----- 使い始める ----- */}
        <Stack component="section" spacing={2}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            使い始める
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <li>
              <Typography gutterBottom>パッケージを入れる（スタイルの仕組みに Emotion を使うので、一緒に入れる）。</Typography>
              <CodeBlock code={installCode} fileName="ターミナル" />
            </li>
            <li>
              <Typography gutterBottom>
                アプリ全体をテーマで包む。色や角丸は theme.ts の createTheme で決める（
                <Link component={RouterLink} to="/theme">
                  テーマと sx
                </Link>
                ）。
              </Typography>
              <CodeBlock code={providerCode} fileName="AppProviders.tsx" />
            </li>
            <li>
              <Typography gutterBottom>使う部品を読み込む。</Typography>
              <CodeBlock code={importCode} />
            </li>
            <li>
              <Typography gutterBottom>
                レイアウトは Container・Stack・Grid で組み、細かい見た目は sx で調整する。フォームは React Hook Form の
                Controller（shared/ui の FormTextField）でつなぐ。
              </Typography>
              <CodeBlock code={pageCode} />
            </li>
          </Box>
        </Stack>

        {/* ----- v9 の注意点 ----- */}
        <Stack component="section" spacing={2}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            v9 で変わったところ（古い記事のコードに注意）
          </Typography>
          <Typography color="text.secondary">
            v9 では、以前から非推奨だった書き方が削除された。ネットの記事や AI の答えにある古い書き方は、型エラーになるか、効かない。
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="v9 で変わった書き方">
              <TableHead>
                <TableRow>
                  <TableCell>古い書き方</TableCell>
                  <TableCell>v9 の書き方</TableCell>
                  <TableCell>部品</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {changes.map((change) => (
                  <TableRow key={change.before}>
                    <TableCell sx={{ minWidth: 200 }}>
                      <RichText text={change.before} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 240 }}>
                      <RichText text={change.after} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>{change.target}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </Container>
  );
};
