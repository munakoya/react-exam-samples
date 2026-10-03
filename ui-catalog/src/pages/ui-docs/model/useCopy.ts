import { useEffect, useState } from "react";

/**
 * 文字列をクリップボードへコピーし、「コピーしました」を少しの間だけ表示するためのフック
 *
 *   const { copied, copy } = useCopy();
 *   <button onClick={() => copy(code)}>{copied ? "コピーしました" : "コピー"}</button>
 */
export const useCopy = (resetMs = 1500) => {
  const [copied, setCopied] = useState(false);

  // copied が true になったら、resetMs 後に false へ戻す
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(timer); // 先に画面が消えたらタイマーを止める
  }, [copied, resetMs]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // http（https でない）環境などではコピーが許可されないことがある
      setCopied(false);
    }
  };

  return { copied, copy };
};
