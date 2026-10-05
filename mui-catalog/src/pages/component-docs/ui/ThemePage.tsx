import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTheme, type Theme, type TypographyVariant } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { PageHeader } from "@/shared/ui";
import { appProvidersTsx, themeTs } from "../model/sources";
import { useCopy } from "../model/useCopy";
import { CodeBlock } from "./CodeBlock";
import { RichText } from "./RichText";

/**
 * テーマと sx（/theme）
 *
 * アプリで使っている theme を useTheme() で受け取り、色・余白・文字などの実際の値を並べる。
 * theme.ts を書き換えると、このページにもそのまま反映される。名前をクリックするとコピーできる。
 */

type Row = { name: string; value: string; comment?: string };

const sxCode = `<Box
  sx={{
    // 余白：数値は theme.spacing の倍数（1 = 8px）
    p: 2,                 // padding: 16px
    mt: 1,                // margin-top: 8px
    px: { xs: 1, md: 3 }, // 左右の padding を画面幅で変える

    // 色：theme の palette の名前で書く
    color: "text.secondary",
    bgcolor: "primary.main",
    borderColor: "divider",

    borderRadius: 1, // 角丸：theme.shape.borderRadius（8px）の倍数
    border: 1,       // 枠線：数値は太さ（px）

    // 疑似クラス・子要素
    "&:hover": { bgcolor: "primary.dark" },
    "& .MuiButton-root": { minWidth: 0 },

    // theme を受け取る関数でも書ける
    boxShadow: (theme) => theme.shadows[2],
  }}
/>`;

// [palette の名前, 説明]
const paletteNames: [string, string][] = [
  ["primary.main", "メインの色（ボタン・リンク・選択中）"],
  ["primary.light", "primary の明るい色"],
  ["primary.dark", "primary の暗い色（マウスを乗せたとき）"],
  ["primary.contrastText", "primary の上に置く文字の色"],
  ["secondary.main", "2番目の色"],
  ["error.main", "削除・エラー・期限切れ"],
  ["warning.main", "注意・期限が近い"],
  ["info.main", "お知らせ"],
  ["success.main", "成功・完了"],
  ["text.primary", "本文の文字"],
  ["text.secondary", "補足の文字（説明・日付など）"],
  ["text.disabled", "押せない部品の文字"],
  ["background.default", "ページの背景"],
  ["background.paper", "Card・Dialog・Menu などの背景"],
  ["divider", "区切り線・枠線"],
  ["grey.100", "薄い灰色（grey.50〜900 まである）"],
  ["action.hover", "マウスを乗せたときの背景"],
];

// "primary.main" のような名前から、palette の値を取り出す
const getPaletteValue = (theme: Theme, name: string) =>
  String(name.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown>)[key], theme.palette));

const breakpointComments: Record<string, string> = {
  xs: "スマホ（すべての幅）",
  sm: "大きめのスマホ・タブレット（縦）",
  md: "タブレット（横）・小さめの PC",
  lg: "PC",
  xl: "大きな画面",
};

const typographyVariants: TypographyVariant[] = [
  "h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "caption", "overline", "button",
];

// 名前のボタン（押すとコピー）
const CopyName = ({ name }: { name: string }) => {
  const { copied, copy } = useCopy();
  return (
    <Button
      size="small"
      onClick={() => copy(name)}
      aria-label={`${name} をコピー`}
      sx={{ fontFamily: "ui-monospace, Consolas, monospace", minWidth: 0, textAlign: "left" }}
    >
      {copied ? "コピーしました" : name}
    </Button>
  );
};

// 値の表。render を渡すと、先頭に見本の列を出す
const ValueTable = ({ rows, render }: { rows: Row[]; render?: (row: Row) => ReactNode }) => (
  <TableContainer component={Paper} variant="outlined">
    <Table size="small">
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            {render && <TableCell sx={{ width: 140 }}>{render(row)}</TableCell>}
            <TableCell sx={{ width: 220 }}>
              <CopyName name={row.name} />
            </TableCell>
            <TableCell sx={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: 13 }}>{row.value}</TableCell>
            <TableCell sx={{ color: "text.secondary", minWidth: 160 }}>{row.comment}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// 見出し付きのまとまり
const Section = ({ title, description, children }: { title: string; description?: string; children: ReactNode }) => (
  <Stack component="section" spacing={1.5}>
    <Typography variant="h6" component="h2" sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary">
        <RichText text={description} />
      </Typography>
    )}
    {children}
  </Stack>
);

export const ThemePage = () => {
  // アプリで使っている theme（app/styles/theme.ts）
  const theme = useTheme();

  const paletteRows: Row[] = paletteNames.map(([name, comment]) => ({ name, value: getPaletteValue(theme, name), comment }));
  const spacingRows: Row[] = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8].map((step) => ({
    name: String(step),
    value: theme.spacing(step),
    comment: `p: ${step} / gap: ${step} / <Stack spacing={${step}}>`,
  }));
  const radiusRows: Row[] = [0.5, 1, 2].map((step) => ({
    name: `borderRadius: ${step}`,
    value: `${Number(theme.shape.borderRadius) * step}px`,
    comment: step === 1 ? "部品の角丸の基準" : undefined,
  }));
  const breakpointRows: Row[] = theme.breakpoints.keys.map((key) => ({
    name: key,
    value: `${theme.breakpoints.values[key]}px 〜`,
    comment: breakpointComments[key],
  }));
  const typographyRows: Row[] = typographyVariants.map((variant) => ({
    name: variant,
    value: `${theme.typography[variant].fontSize} / ${theme.typography[variant].fontWeight}`,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={5}>
        <PageHeader
          title="テーマと sx"
          description="色・余白・文字の大きさなどは theme.ts（createTheme）でまとめて決め、部品では sx や color から名前で使う。名前をクリックするとコピーできる。"
        />

        <Section
          title="sx の書き方"
          description="`sx` はすべての MUI 部品に書ける、その場のスタイル。CSS のプロパティ名をキャメルケースで書き、余白・色・角丸は theme の値を使う。"
        >
          <CodeBlock code={sxCode} />
        </Section>

        <Section title="色（palette）" description={'`color="text.secondary"`・`sx={{ bgcolor: "primary.main" }}` のように名前で使う。'}>
          <ValueTable
            rows={paletteRows}
            render={(row) => (
              <Box sx={{ width: 48, height: 28, bgcolor: row.value, border: 1, borderColor: "divider", borderRadius: 0.5 }} />
            )}
          />
        </Section>

        <Section
          title="余白（spacing）"
          description="数値 × 8px。`p`（padding）・`m`（margin）・`gap`、Stack・Grid の `spacing` で使う。`mt`・`px` のように向きも付けられる。"
        >
          <ValueTable rows={spacingRows} render={(row) => <Box sx={{ width: row.value, height: 12, bgcolor: "primary.main", borderRadius: "2px" }} />} />
        </Section>

        <Section title="角丸（shape）">
          <ValueTable
            rows={radiusRows}
            render={(row) => <Box sx={{ width: 48, height: 32, border: 2, borderColor: "primary.main", borderRadius: row.value }} />}
          />
        </Section>

        <Section
          title="ブレークポイント（画面幅）"
          description={'`sx={{ display: { xs: "none", md: "block" } }}` のように、その幅「以上」で切り替わる。JS で判定するときは `useMediaQuery(theme.breakpoints.up("md"))`。'}
        >
          <ValueTable rows={breakpointRows} />
        </Section>

        <Section title="文字（typography）" description={'`<Typography variant="h5">` の variant の一覧（大きさ / 太さ）。'}>
          <ValueTable
            rows={typographyRows}
            render={(row) => (
              // component="span"：見本なので、h1 などの見出しのタグにしない
              <Typography variant={row.name as TypographyVariant} component="span" noWrap sx={{ lineHeight: 1.2 }}>
                Aa
              </Typography>
            )}
          />
        </Section>

        <Section title="ファイル" description="theme は `ThemeProvider` でアプリ全体に配る（AppProviders.tsx）。文言の日本語化（`jaJP`）も theme.ts で行っている。">
          <CodeBlock code={themeTs} fileName="src/app/styles/theme.ts" />
          <CodeBlock code={appProvidersTsx} fileName="src/app/providers/AppProviders.tsx" />
        </Section>
      </Stack>
    </Container>
  );
};
