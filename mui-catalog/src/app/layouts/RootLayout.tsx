import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { Outlet } from "react-router";
import { muiCategories, muiDocs } from "@/pages/component-docs";
import { AppShell, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ 部品のメニュー） ── app/layouts
 *
 * 部品のメニューは、部品の一覧（muiDocs）から分類ごとに作る。
 * group を付けると、AppShell が分類の見出しを出す。
 */

const navItems: AppShellNavItem[] = [
  { to: "/", label: "はじめに", icon: <HomeOutlinedIcon />, end: true, group: "ガイド" },
  { to: "/theme", label: "テーマと sx", icon: <PaletteOutlinedIcon />, group: "ガイド" },
  // 分類の順に並べる（flatMap：分類ごとの配列を1つの配列につなげる）
  ...muiCategories.flatMap((category) =>
    muiDocs
      .filter((doc) => doc.category === category)
      .map((doc) => ({ to: `/${doc.slug}`, label: doc.name, group: category })),
  ),
];

export const RootLayout = () => {
  return (
    <AppShell title="MUI 部品カタログ" navItems={navItems}>
      <Outlet />
    </AppShell>
  );
};
