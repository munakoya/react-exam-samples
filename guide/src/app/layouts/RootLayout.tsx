import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Link as RouterLink, Outlet } from "react-router";
import { docBooks, docUrl } from "@/entities/doc";
import { AppShell, SamplesTopLink, type AppShellNavItem } from "@/shared/ui";

/**
 * 全ページ共通の枠（ヘッダー ＋ 読みもののメニュー） ── app/layouts
 *
 * メニューは読みものの一覧（docBooks）から、本ごとにまとめて作る。
 */

const navItems: AppShellNavItem[] = [
  { to: "/", label: "トップ", icon: <HomeOutlinedIcon />, end: true },
  { to: "/search", label: "検索", icon: <SearchIcon /> },
  ...docBooks.flatMap((book) =>
    book.docs.map((doc) => ({
      to: docUrl(doc),
      label: doc.slug === "" ? "目次" : doc.title,
      group: book.title,
      end: true, // 本の目次（/library）が、章のページ（/library/01-setup）でも選択中にならないように
    })),
  ),
];

export const RootLayout = () => {
  return (
    <AppShell
      title="解説書・ガイド"
      navItems={navItems}
      headerRight={
        <>
          <SamplesTopLink /> {/* 公開ページだけに出る「← サンプル集」 */}
          <Tooltip title="検索">
            <IconButton component={RouterLink} to="/search" color="inherit" aria-label="検索">
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      <Outlet />
    </AppShell>
  );
};
