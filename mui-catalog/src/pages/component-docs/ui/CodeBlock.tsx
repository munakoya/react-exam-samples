import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useCopy } from "../model/useCopy";

/**
 * コードの表示（ファイル名＋コピーボタン）
 *
 *   <CodeBlock code={code} fileName="Button.tsx" />
 */

type CodeBlockProps = {
  code: string;
  /** 上部に出すファイル名やラベル */
  fileName?: string;
};

export const CodeBlock = ({ code, fileName }: CodeBlockProps) => {
  const { copied, copy } = useCopy();

  return (
    // 背景は暗い色に固定する（theme の色ではなく、コードを読みやすい色）
    <Paper elevation={0} sx={{ bgcolor: "#1e1e2e", color: "#e4e4ef", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 0.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Typography variant="caption" sx={{ color: "#a6a6c0", overflowWrap: "anywhere" }}>
          {fileName}
        </Typography>
        <Button size="small" onClick={() => copy(code)} sx={{ color: "inherit", flexShrink: 0 }}>
          {copied ? "コピーしました" : "コピー"}
        </Button>
      </Box>
      {/* <pre> は空白・改行をそのまま表示する。横に長い行は枠の中でスクロールする */}
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          overflow: "auto",
          maxHeight: 560,
          fontSize: 13,
          lineHeight: 1.6,
          fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
        }}
      >
        <code>{code.trimEnd()}</code>
      </Box>
    </Paper>
  );
};
