import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { Outlet } from "react-router";
import { muiCategories, muiDocs, patternDocs } from "@/pages/component-docs";
import { AppShell, SamplesTopLink, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ 部品のメニュー） ── app/layouts
 *
 * 画面パターンのメニューは patternDocs から、部品のメニューは部品の一覧（muiDocs）から分類ごとに作る。
 * group を付けると、AppShell が分類の見出しを出す。
 */

const navItems: AppShellNavItem[] = [
  { to: "/", label: "はじめに", icon: <HomeOutlinedIcon />, end: true, group: "ガイド" },
  { to: "/theme", label: "テーマと sx", icon: <PaletteOutlinedIcon />, group: "ガイド" },
  // 試験でよく出る CRUD の画面（サンプルアプリのコードと紐付け）
  ...patternDocs.map((pattern) => ({
    to: `/patterns/${pattern.slug}`,
    label: pattern.shortName,
    group: "画面パターン（CRUD）",
  })),
  // 分類の順に並べる（flatMap：分類ごとの配列を1つの配列につなげる）
  ...muiCategories.flatMap((category) =>
    muiDocs
      .filter((doc) => doc.category === category)
      .map((doc) => ({ to: `/${doc.slug}`, label: doc.name, group: category })),
  ),
];

export const RootLayout = () => {
  return (
    // headerRight：公開ページだけに出る「← サンプル集」
    <AppShell title="MUI 部品カタログ" navItems={navItems} headerRight={<SamplesTopLink />}>
      <Outlet />
    </AppShell>
  );
};
