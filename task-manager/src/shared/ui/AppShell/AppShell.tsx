import { useId, useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import styles from "./AppShell.module.css";

/**
 * アプリ全体の枠（ヘッダー ＋ サイドメニュー ＋ メイン）
 *
 *   ┌───────────────────────────┐
 *   │ ☰ タイトル      （右側の要素）│  header
 *   ├────────┬──────────────────┤
 *   │ メニュー │ children（各ページ） │
 *   └────────┴──────────────────┘
 *
 * 幅が広いとき：メニューを常に表示
 * 幅が狭いとき（768px 未満）：☰ で開閉し、メインの上に重ねて表示
 *
 * 使い方（React Router のレイアウトルートにする場合は children に <Outlet /> を渡す）:
 *   <AppShell
 *     title="在庫管理"
 *     navItems={[{ to: "/", label: "ホーム" }, { to: "/items", label: "商品一覧" }]}
 *     headerRight={<Button size="sm">ログアウト</Button>}
 *   >
 *     <Outlet />
 *   </AppShell>
 */

export type AppShellNavItem = { to: string; label: string };

type AppShellProps = {
  title: string;
  navItems: AppShellNavItem[];
  /** ヘッダーの右側に置く要素（ユーザー名・ボタンなど） */
  headerRight?: ReactNode;
  /** 枠の最低の高さ。初期値は画面の高さいっぱい */
  minHeight?: string;
  children: ReactNode;
};

export const AppShell = ({
  title,
  navItems,
  headerRight,
  minHeight = "100dvh",
  children,
}: AppShellProps) => {
  // 狭い幅でメニューを開いているか
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  return (
    // data-menu-open で、狭い幅のときのメニューの表示を CSS で切り替える
    <div className={styles.shell} data-menu-open={menuOpen} style={{ minHeight }}>
      <header className={styles.header}>
        {/* 狭い幅のときだけ表示される開閉ボタン（CSS で切り替え） */}
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          ☰
        </button>
        <p className={styles.title}>{title}</p>
        {headerRight && <div className={styles.headerRight}>{headerRight}</div>}
      </header>

      <div className={styles.body}>
        <nav id={menuId} className={styles.nav} aria-label="メインメニュー">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.to}>
                {/* NavLink は今のページのリンクに "active" クラスを付ける。押したらメニューを閉じる */}
                <NavLink to={item.to} className={styles.navLink} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 狭い幅でメニューを開いたときの暗い背景。クリックで閉じる */}
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-hidden="true" />

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};
