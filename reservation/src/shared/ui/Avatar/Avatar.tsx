import type { CSSProperties } from "react";
import styles from "./Avatar.module.css";

/**
 * ユーザーのアイコン（丸い画像、画像がなければ名前の1文字目）
 *
 *   (山)  山田 太郎
 *
 * 画像がないときの背景色は、名前から決める（同じ名前なら いつも同じ色になる）。
 *
 * 使い方:
 *   <Avatar name="山田 太郎" />
 *   <Avatar name="山田 太郎" src={user.imageDataUrl} size="lg" />
 */

type AvatarProps = {
  name: string;
  /** 画像の URL（data URL も可）。なければ名前の1文字目を出す */
  src?: string;
  size?: "sm" | "md" | "lg";
};

/** 名前の文字コードを足し合わせて、0〜359 の色相（hue）にする */
const nameToHue = (name: string) =>
  [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;

export const Avatar = ({ name, src, size = "md" }: AvatarProps) => {
  return (
    <span
      className={styles.avatar}
      data-size={size}
      // 色相を CSS 変数で渡し、CSS 側で hsl() の色にする
      style={{ "--avatar-hue": nameToHue(name) } as CSSProperties}
      role="img"
      aria-label={name} // 読み上げでは名前を伝える
    >
      {src ? (
        <img src={src} alt="" className={styles.image} />
      ) : (
        // 前後の空白を除いた1文字目。[...name] にすると絵文字なども1文字として扱える
        <span aria-hidden="true">{[...name.trim()][0] ?? "?"}</span>
      )}
    </span>
  );
};
