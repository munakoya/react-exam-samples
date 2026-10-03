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
 *     { to: "/items", label: "商品一覧", end: true },
 *     { to: "/items/new", label: "新規登録" },
 *   ];
 *   <Sidebar navItems={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />
 *
 *   // 見出しつきのグループに分ける（管理画面など、メニューが多いとき）
 *   <Sidebar
 *     navItems={[{ to: "/", label: "ダッシュボード", end: true }]}
 *     groups={[
 *       { title: "ユーザー", items: [{ to: "/users", label: "ユーザー一覧" }] },
 *       { title: "設定", items: [{ to: "/settings", label: "全般" }] },
 *     ]}
 *   />
 *
 * NavLink は「今の URL の先頭が to と一致する」リンクを選択中にする。
 * /items は /items/new でも選択中になるので、/items だけを選択中にしたいなら end: true を付ける。
 */

export type SidebarNavItem = {
  to: string;
  label: string;
  /** true なら、URL が完全に一致するときだけ選択中にする */
  end?: boolean;
};

export type SidebarGroup = {
  title: string;
  items: SidebarNavItem[];
};

/** Header の ☰ ボタン（aria-controls）と結びつける id の初期値 */
export const SIDEBAR_ID = "app-sidebar";

type SidebarProps = {
  /** 見出しのないリンク（いちばん上に並ぶ） */
  navItems?: SidebarNavItem[];
  /** 見出しつきのリンクのグループ（navItems の下に並ぶ） */
  groups?: SidebarGroup[];
  /** 狭い幅で開いているか */
  open?: boolean;
  /** 狭い幅で閉じるとき（暗い背景・リンク・Esc） */
  onClose?: () => void;
  /** メニューの下に置く要素（ログイン中のユーザーなど） */
  footer?: ReactNode;
  /** 1つの画面に Sidebar を2つ置くときだけ変える（Header の menuId と同じ値にする） */
  id?: string;
};

export const Sidebar = ({
  navItems = [],
  groups = [],
  open = false,
  onClose,
  footer,
  id = SIDEBAR_ID,
}: SidebarProps) => {
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

  // リンクの並び。navItems とグループの両方で使う
  const renderList = (items: SidebarNavItem[]) => (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.to}>
          {/* NavLink は今のページのリンクに "active" クラスを付ける。押したらメニューを閉じる */}
          <NavLink to={item.to} end={item.end} className={styles.link} onClick={onClose}>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* data-open で、狭い幅のときの表示・非表示を CSS で切り替える */}
      <nav id={id} className={styles.nav} data-open={open} aria-label="メインメニュー">
        {/* 中身は inner に入れて、ページをスクロールしても画面に残す（CSS の sticky） */}
        <div className={styles.inner}>
          {navItems.length > 0 && renderList(navItems)}

          {groups.map((group) => (
            <div key={group.title} className={styles.group}>
              <p className={styles.groupTitle}>{group.title}</p>
              {renderList(group.items)}
            </div>
          ))}

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </nav>

      {/* 狭い幅でメニューを開いたときの暗い背景。クリックで閉じる */}
      <div className={styles.backdrop} data-open={open} onClick={onClose} aria-hidden="true" />
    </>
  );
};
