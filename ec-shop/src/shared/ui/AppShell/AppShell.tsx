import type { ReactNode } from "react";
import styles from "./AppShell.module.css";

/**
 * アプリ全体の枠（ヘッダー ＋ サイドバー ＋ メイン を並べるだけ）
 *
 *   ┌──────────────────────────┐
 *   │ header（<Header />）                │
 *   ├─────────┬────────────────┤
 *   │ sidebar   │ children（各ページ）       │
 *   │（<Sidebar />）│                         │
 *   └─────────┴────────────────┘
 *
 * 中身（Header・Sidebar）は外から渡す。サイドバーなしの画面なら sidebar を渡さない。
 * この枠の幅が 768px 未満になると、Sidebar は ☰ で開閉するメニューに変わる（CSS のコンテナクエリ）。
 *
 * 使い方（☰ の開閉の state は、Header と Sidebar の両方で使うので外で持つ）:
 *   const [menuOpen, setMenuOpen] = useState(false);
 *
 *   <AppShell
 *     header={<Header title="在庫管理" menuOpen={menuOpen} onMenuClick={() => setMenuOpen(!menuOpen)} />}
 *     sidebar={<Sidebar navItems={navItems} open={menuOpen} onClose={() => setMenuOpen(false)} />}
 *   >
 *     <Outlet />
 *   </AppShell>
 */

type AppShellProps = {
  header: ReactNode;
  /** 左のメニュー。渡さなければメインが横幅いっぱいになる */
  sidebar?: ReactNode;
  /** 枠の最低の高さ。初期値は画面の高さいっぱい */
  minHeight?: string;
  children: ReactNode;
};

export const AppShell = ({ header, sidebar, minHeight = "100dvh", children }: AppShellProps) => {
  return (
    <div className={styles.shell} style={{ minHeight }}>
      {header}
      <div className={styles.body}>
        {sidebar}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};
