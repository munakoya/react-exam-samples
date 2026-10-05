import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

// 横棒の進み具合。ページ上部の読み込み表示や、アップロードの進み具合に使う
export default function ProgressLinear() {
  const [progress, setProgress] = useState(40);

  return (
    <Stack spacing={3}>
      {/* value なし：流れ続ける（終わりが分からない処理） */}
      <LinearProgress aria-label="読み込み中" />

      {/* variant="determinate"：value（0〜100）まで塗る */}
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress variant="determinate" value={progress} aria-label="アップロードの進み具合" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
          {progress}%
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={() => setProgress((prev) => Math.max(prev - 10, 0))}>
          −10
        </Button>
        <Button size="small" onClick={() => setProgress((prev) => Math.min(prev + 10, 100))}>
          ＋10
        </Button>
      </Stack>
    </Stack>
  );
}
