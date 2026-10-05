import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Markdown のコードブロック（```）の表示。右上にコピーボタンを付ける ── entities/doc/ui
 *
 * 色付けは rehype-highlight（highlight.js）が済ませているので、ここでは枠とコピーだけ。
 */

type CodeBlockProps = {
  /** コピーする文字列（色付けの <span> を外した中身） */
  text: string;
  children: ReactNode;
};

export const CodeBlock = ({ text, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  // 「コピーしました」を 1.5 秒で元に戻す。先に画面が消えたらタイマーを止める
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text.trimEnd());
      setCopied(true);
    } catch {
      // http（https でない）環境などではコピーが許可されないことがある
    }
  };

  return (
    <Box sx={{ position: "relative", my: 2 }}>
      <Button
        size="small"
        onClick={handleCopy}
        sx={{ position: "absolute", top: 6, right: 6, color: "#c9d1d9", bgcolor: "rgba(255,255,255,0.08)", minWidth: 0 }}
      >
        {copied ? "コピーしました" : "コピー"}
      </Button>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          pr: 10, // コピーボタンと重ならないように
          overflow: "auto", // 横に長い行は枠の中でスクロール
          borderRadius: 1,
          bgcolor: "#0d1117", // github-dark の背景色
          color: "#e6edf3",
          fontSize: 13,
          lineHeight: 1.6,
          "& code": {
            fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
            fontVariantLigatures: "none", // => や === を記号（⇒・≡）にまとめない
            bgcolor: "transparent",
            p: 0,
          },
          "& .hljs": { background: "transparent", p: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
