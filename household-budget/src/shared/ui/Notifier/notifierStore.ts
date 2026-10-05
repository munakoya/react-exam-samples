import type { AlertColor } from "@mui/material/Alert";
import { create } from "zustand";

/**
 * 画面の下に出す通知（スナックバー）の store ── shared/ui
 *
 * 通知の中身を Zustand の store に置くと、どのコンポーネントからでも、
 * React の外（ふつうの関数）からでも notify("…") で出せる。Provider で包む必要もない。
 *
 *   notify("保存しました");                 // 成功（緑）
 *   notify("保存に失敗しました", "error");  // エラー（赤）
 *
 * 表示する部品（<Notifier />）は、アプリに1つだけ置く（AppProviders など）。
 */

export type Notification = {
  /** 同じ文言が続いても、出し直したと分かるようにする番号 */
  id: number;
  message: string;
  severity: AlertColor;
};

type NotifierStore = {
  notification: Notification | null;
  /**
   * 開いているか。閉じても notification は残しておく
   * （閉じるアニメーションの間に文言が消えて見えないように）
   */
  open: boolean;
  show: (message: string, severity?: AlertColor) => void;
  close: () => void;
};

export const useNotifierStore = create<NotifierStore>()((set) => ({
  notification: null,
  open: false,
  show: (message, severity = "success") =>
    set({ notification: { id: Date.now(), message, severity }, open: true }),
  close: () => set({ open: false }),
}));

/**
 * 通知を出す。コンポーネントの中でも外でも使える
 *
 * getState()：React の外から store の今の値（と action）を取り出す Zustand の機能
 */
export const notify = (message: string, severity: AlertColor = "success") =>
  useNotifierStore.getState().show(message, severity);
