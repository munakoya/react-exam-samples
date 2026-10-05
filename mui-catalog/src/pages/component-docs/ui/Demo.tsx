import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { getDemo } from "../model/sources";
import { useCopy } from "../model/useCopy";
import { CodeBlock } from "./CodeBlock";

/**
 * 見本1つ分：動く見本（プレビュー）＋ コードの表示・コピー
 *
 *   <Demo title="種類" file="button/Variants" />
 *
 * file は demos/ からのパス。同じファイルを「部品」と「文字列」の両方で読み込んでいる（model/sources.ts）。
 */

type DemoProps = {
  title: string;
  file: string;
};

export const Demo = ({ title, file }: DemoProps) => {
  const { Component, code } = getDemo(file);
  const [showCode, setShowCode] = useState(false);
  const { copied, copy } = useCopy();

  return (
    <Stack component="section" spacing={1}>
      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        {/* 動く見本 */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Component />
        </Box>

        {/* コードの表示切り替えとコピー */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ justifyContent: "flex-end", px: 1, py: 0.5, borderTop: 1, borderColor: "divider", bgcolor: "grey.50" }}
        >
          <Button size="small" color="inherit" onClick={() => setShowCode((prev) => !prev)} aria-expanded={showCode}>
            {showCode ? "コードを隠す" : "コードを表示"}
          </Button>
          <Button size="small" color="inherit" onClick={() => copy(code)}>
            {copied ? "コピーしました" : "コードをコピー"}
          </Button>
        </Stack>
      </Paper>

      {/* Collapse：開閉をアニメーションさせる。unmountOnExit で閉じている間は中身を作らない */}
      <Collapse in={showCode} unmountOnExit>
        <CodeBlock code={code} fileName={`demos/${file}.tsx`} />
      </Collapse>
    </Stack>
  );
};
