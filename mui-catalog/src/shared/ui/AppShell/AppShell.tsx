import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { alpha, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useState, type ReactNode } from "react";
import { Link as RouterLink, NavLink } from "react-router";

/**
 * アプリ全体の枠：ヘッダー（AppBar）＋ サイドメニュー（Drawer）＋ メイン ── shared/ui
 *
 *   ┌────────────────────────────┐
 *   │ ☰ タイトル        AppBar    │
 *   ├────────┬───────────────────┤
 *   │ Drawer │ main（children）   │
 *   └────────┴───────────────────┘
 *
 * - PC（md = 900px 以上） … メニューを常に表示（Drawer の variant="permanent"）
 * - スマホ                … ☰ で開閉し、画面の上に重ねて表示（variant="temporary"）
 *
 * 使い方（app/layouts/RootLayout.tsx）:
 *   <AppShell title="蔵書管理" navItems={navItems}>
 *     <Outlet />
 *   </AppShell>
 */

const DRAWER_WIDTH = 240;

export type AppShellNavItem = {
  to: string;
  label: string;
  /** メニューの左に出すアイコン（<MenuBookIcon /> など） */
  icon?: ReactNode;
  /** true なら URL が完全に一致したときだけ選択中にする（"/" や "/books" の一覧など） */
  end?: boolean;
  /** 見出しでまとめるときのグループ名。同じ group が続く項目の上に見出しを出す */
  group?: string;
};

type AppShellProps = {
  title: string;
  navItems: AppShellNavItem[];
  /** タイトルを押したときの移動先 */
  homeTo?: string;
  /** ヘッダーの右側に置く要素 */
  headerRight?: ReactNode;
  children: ReactNode;
};

export const AppShell = ({ title, navItems, homeTo = "/", headerRight, children }: AppShellProps) => {
  // 画面幅が md（900px）以上かどうか。ブレークポイントは theme の値を使う
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // スマホでメニューを開いているか
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = (
    <List sx={{ px: 1 }}>
      {navItems.map((item, index) => {
        // 前の項目とグループが変わったところに見出しを出す
        const showGroup = item.group !== undefined && item.group !== navItems[index - 1]?.group;
        return (
          // <ul> の直下は <li> だけにする。ListSubheader も ListItem も <li> なので、Fragment で横に並べる
          <Fragment key={item.to}>
            {showGroup && (
              <ListSubheader disableSticky sx={{ lineHeight: "36px", mt: index === 0 ? 0 : 1 }}>
                {item.group}
              </ListSubheader>
            )}
            <ListItem disablePadding>
              {/*
                component={NavLink}：MUI のボタンの見た目で、React Router のリンクとして動かす。
                NavLink は今のページのリンクに "active" クラスを付けるので、"&.active" で強調する
              */}
              <ListItemButton
                component={NavLink}
                to={item.to}
                end={item.end}
                dense={!item.icon} // アイコンのない項目（数が多いメニュー）は詰めて表示する
                onClick={() => setMobileOpen(false)} // スマホではリンクを押したら閉じる
                sx={{
                  borderRadius: 1,
                  "&.active": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1), // テーマの色を 10% の濃さに
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                  },
                }}
              >
                {item.icon && <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </Fragment>
        );
      })}
    </List>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      {/* zIndex を Drawer より上にして、ヘッダーをメニューの上に重ねる */}
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* PC ではメニューが常に見えているので、開閉ボタンは出さない */}
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              aria-label="メニューを開く"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={RouterLink}
            to={homeTo}
            noWrap
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none", fontWeight: 700 }}
          >
            {title}
          </Typography>
          {headerRight}
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop || mobileOpen}
        onClose={() => setMobileOpen(false)} // スマホで背景のクリック・Esc で閉じる
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        {/* 空の Toolbar：固定ヘッダーと同じ高さの余白。中身がヘッダーの下に隠れないようにする */}
        <Toolbar />
        <Box component="nav" aria-label="メインメニュー" sx={{ overflowY: "auto" }}>
          {menu}
        </Box>
      </Drawer>

      {/* minWidth: 0 で、表などの長い中身があってもメインが横にはみ出さないようにする */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
