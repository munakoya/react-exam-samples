import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useState } from "react";

// value を数値にすると1つのつまみ、[最小, 最大] の配列にすると範囲の指定になる
export default function SliderBasic() {
  const [volume, setVolume] = useState(30);
  const [priceRange, setPriceRange] = useState([1000, 5000]);

  return (
    <Box sx={{ maxWidth: 360, px: 1 }}>
      <Typography id="volume-label" gutterBottom>
        音量：{volume}
      </Typography>
      <Slider
        aria-labelledby="volume-label"
        value={volume}
        onChange={(_event, value) => setVolume(value)}
        valueLabelDisplay="auto" // つまみを動かすと値の吹き出しを出す
      />

      <Typography id="price-label" gutterBottom sx={{ mt: 2 }}>
        価格：{priceRange[0].toLocaleString()}円 〜 {priceRange[1].toLocaleString()}円
      </Typography>
      <Slider
        aria-labelledby="price-label"
        value={priceRange}
        onChange={(_event, value) => setPriceRange(value)}
        min={0}
        max={10000}
        step={500} // 500円刻み
        marks // step ごとに目盛りを付ける
        valueLabelDisplay="auto"
        disableSwap // つまみ同士が入れ替わらないようにする
      />
    </Box>
  );
}
