import { useEffect, type ReactNode } from "react";
import { NavLink } from "react-router";
import styles from "./Sidebar.module.css";

/**
 * 左のメニュー（ページへのリンクの一覧）
 *
 * 広い幅：常に表示
 * 狭い幅（AppShell が 768px 未満）：open のときだけ、メインの上に重ねて表示する。
 *   暗い背景・リンク・Esc キーで閉じる（onClose が呼ばれる）
 *
 * 使い方:
 *   const navItems: SidebarNavItem[] = [
 *     { to: "/items", label: "商品一覧" },
 *     { to: "/items/new", label: "新規登録" },
 *   ];
 *   <Sidebar navItems={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />
 *
 * NavLink は「今の URL の先頭が to と一致する」リンクを選択中にする。
 * /items は /items/new でも選択中になるので、/items だけを選択中にしたいなら end: true を付ける。
 *   { to: "/items", label: "商品一覧", end: true }
 */

export type SidebarNavItem = {
  to: string;
  label: string;
  /** true なら、URL が完全に一致するときだけ選択中にする */
  end?: boolean;
};

/** Header の ☰ ボタンの aria-controls と結びつける id（アプリに1つだけ置く前提） */
export const SIDEBAR_ID = "app-sidebar";

type SidebarProps = {
  navItems: SidebarNavItem[];
  /** 狭い幅で開いているか */
  open?: boolean;
  /** 狭い幅で閉じるとき（暗い背景・リンク・Esc） */
  onClose?: () => void;
  /** メニューの下に置く要素（ログイン中のユーザーなど） */
  footer?: ReactNode;
};

export const Sidebar = ({ navItems, open = false, onClose, footer }: SidebarProps) => {
  // 開いている間だけ、Esc キーで閉じられるようにする
  useEffect(() => {
    if (!open || !onClose) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    // 閉じたら（または部品が消えたら）登録を外す。外さないと押すたびに何回も呼ばれる
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* data-open で、狭い幅のときの表示・非表示を CSS で切り替える */}
      <nav id={SIDEBAR_ID} className={styles.nav} data-open={open} aria-label="メインメニュー">
        <ul className={styles.list}>
          {navItems.map((item) => (
            <li key={item.to}>
              {/* NavLink は今のページのリンクに "active" クラスを付ける。押したらメニューを閉じる */}
              <NavLink to={item.to} end={item.end} className={styles.link} onClick={onClose}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {footer && <div className={styles.footer}>{footer}</div>}
      </nav>

      {/* 狭い幅でメニューを開いたときの暗い背景。クリックで閉じる */}
      <div className={styles.backdrop} data-open={open} onClick={onClose} aria-hidden="true" />
    </>
  );
};
