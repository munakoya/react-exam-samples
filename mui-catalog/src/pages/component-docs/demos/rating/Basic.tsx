import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

// 星の評価。値は number | null（選んでいる星をもう一度押すと null になる）
export default function RatingBasic() {
  const [value, setValue] = useState<number | null>(3);

  return (
    <Stack spacing={2}>
      <div>
        <Typography component="legend">評価する</Typography>
        <Rating name="review" value={value} onChange={(_event, newValue) => setValue(newValue)} />
        <Typography variant="body2" color="text.secondary">
          {value === null ? "未評価" : `${value} / 5`}
        </Typography>
      </div>
      <div>
        {/* readOnly：表示だけ。precision={0.5} で半分の星も出せる（平均点の表示など） */}
        <Typography component="legend">平均 3.5（表示だけ）</Typography>
        <Rating value={3.5} precision={0.5} readOnly />
      </div>
    </Stack>
  );
}
