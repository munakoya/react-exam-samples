import { useCallback, useState, type ReactNode } from "react";
import { ToastContext, type ToastTone } from "./ToastContext";
import styles from "./ToastProvider.module.css";

/**
 * 通知（Toast）の一覧を持ち、画面の右下に表示する Provider
 *
 * アプリ全体を1回だけ包む（main.tsx や AppProviders など）:
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 * 中のどこからでも、useToast().show("保存しました") で通知を出せる。
 * 通知は DURATION_MS 後に自動で消える。× で先に消すこともできる。
 */

const DURATION_MS = 4000;

type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // useCallback：show 関数を毎回作り直さないようにする（useEffect の依存に入れても無限に動かない）
  const show = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => dismiss(id), DURATION_MS); // 一定時間後に自動で消す
    },
    [dismiss],
  );

  return (
    <ToastContext value={{ show }}>
      {children}

      {/*
        aria-live="polite"：通知が追加されたら、読み上げ中の内容が終わってから読み上げる。
        この領域は最初から置いておく（後から作ると読み上げられないことがある）
      */}
      <div className={styles.viewport} aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={styles.toast} data-tone={toast.tone}>
            <span className={styles.message}>{toast.message}</span>
            <button
              type="button"
              className={styles.close}
              onClick={() => dismiss(toast.id)}
              aria-label="通知を閉じる"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
};
