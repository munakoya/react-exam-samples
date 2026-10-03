import { Link, type LinkProps } from "react-router";
import styles from "../Button/Button.module.css";

/**
 * ボタンの見た目をしたリンク（ページを移動するだけのボタンに使う）
 *
 * 「押すとページが変わる」ものは、<button> ＋ navigate() より <a>（Link）の方がよい。
 *   - 右クリック・中クリックで新しいタブに開ける
 *   - 読み上げで「リンク」と伝わる
 * 保存・削除など「処理をする」ものは Button を使う。
 *
 * 見た目は Button と同じ CSS（Button.module.css）を使い回している。
 *
 * 使い方:
 *   <ButtonLink to="/items/new">新規登録</ButtonLink>
 *   <ButtonLink to={`/items/${item.id}/edit`} variant="secondary" size="sm">編集</ButtonLink>
 */

type ButtonLinkProps = LinkProps & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  fullWidth?: boolean;
};

export const ButtonLink = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...rest // to・children など、残りはそのまま Link へ渡す
}: ButtonLinkProps) => {
  return (
    <Link
      {...rest}
      className={styles.button}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth}
    />
  );
};
