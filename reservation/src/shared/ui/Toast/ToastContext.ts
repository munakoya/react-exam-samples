import { createContext, useContext } from "react";

/**
 * Toast（画面の隅に数秒だけ出る通知）の Context と、通知を出すためのフック
 *
 * 通知の一覧は ToastProvider が持ち、どこからでも useToast().show() で通知を出せる。
 *
 *   const toast = useToast();
 *   toast.show("保存しました");
 *   toast.show("保存に失敗しました", "error");
 */

export type ToastTone = "info" | "success" | "error";

type ToastContextValue = {
  show: (message: string, tone?: ToastTone) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast は ToastProvider の中で使ってください");
  return context;
};
