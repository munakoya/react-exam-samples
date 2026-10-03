import type { ReactNode } from "react";
import { Link } from "react-router";
import { SIDEBAR_ID } from "../Sidebar/Sidebar";
import styles from "./Header.module.css";

/**
 * 画面の上のヘッダー（☰ ボタン ＋ アプリ名 ＋ 右側の要素）
 *
 * ☰ ボタンは onMenuClick を渡したときだけ作られ、AppShell の幅が狭いときだけ表示される。
 * 押されたことを伝えるだけで、開閉の state は持たない（Sidebar と共有するので外で持つ）。
 *
 * 使い方:
 *   <Header title="在庫管理" />                                   … サイドバーのない画面
 *   <Header
 *     title="在庫管理"
 *     homeTo="/"                                                  … アプリ名をトップへのリンクにする
 *     menuOpen={menuOpen}
 *     onMenuClick={() => setMenuOpen((prev) => !prev)}
 *     right={<Button size="sm">ログアウト</Button>}               … 右端に置く要素
 *   />
 */

type HeaderProps = {
  title: string;
  /** 渡すと、アプリ名がそのページへのリンクになる */
  homeTo?: string;
  /** 右端に置く要素（カート・ユーザー名・ボタンなど） */
  right?: ReactNode;
  /** サイドバーが開いているか（☰ ボタンの読み上げに使う） */
  menuOpen?: boolean;
  /** ☰ ボタンが押されたとき。渡さなければ ☰ ボタンを出さない */
  onMenuClick?: () => void;
};

export const Header = ({ title, homeTo, right, menuOpen = false, onMenuClick }: HeaderProps) => {
  return (
    <header className={styles.header}>
      {onMenuClick && (
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-expanded={menuOpen} // 開いているかを読み上げで伝える
          aria-controls={SIDEBAR_ID} // どの要素を開閉するボタンか（Sidebar の id）
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          ☰
        </button>
      )}
      {homeTo ? (
        <Link to={homeTo} className={styles.title}>
          {title}
        </Link>
      ) : (
        <p className={styles.title}>{title}</p>
      )}
      {right && <div className={styles.right}>{right}</div>}
    </header>
  );
};
