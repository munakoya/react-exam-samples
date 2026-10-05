import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState } from "react";
// 画像は import すると URL（文字列）になる。公開先のパスが変わっても Vite が正しい URL にしてくれる
import landscapeImage from "./landscape.svg";

// CardMedia で画像を出す。image は背景画像として表示されるので、高さ（height）を必ず決める。
// CardActionArea で包むと、カード全体が押せるボタンになる
export default function CardWithMedia() {
  const [count, setCount] = useState(0);

  return (
    <Card sx={{ maxWidth: 320 }}>
      <CardActionArea onClick={() => setCount((prev) => prev + 1)}>
        <CardMedia sx={{ height: 160 }} image={landscapeImage} title="山と湖の風景" />
        <CardContent>
          <Typography variant="h6" component="h3">
            山と湖のツアー
          </Typography>
          <Typography variant="body2" color="text.secondary">
            カードのどこを押しても反応する（押した回数：{count}）
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
