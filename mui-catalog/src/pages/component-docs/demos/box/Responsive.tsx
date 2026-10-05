import Box from "@mui/material/Box";

// 値を { xs, sm, md } のオブジェクトにすると、画面幅ごとに切り替わる
//   xs：0px〜 / sm：600px〜 / md：900px〜 / lg：1200px〜
export default function BoxResponsive() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // スマホは縦、PC は横
        gap: { xs: 1, md: 3 },
      }}
    >
      <Box sx={{ flex: 1, p: 2, bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 1 }}>
        メイン
      </Box>
      {/* display: { xs: "none", md: "block" }：スマホでは隠す */}
      <Box sx={{ display: { xs: "none", md: "block" }, width: 200, p: 2, bgcolor: "grey.200", borderRadius: 1 }}>
        サイド（PC だけ表示）
      </Box>
    </Box>
  );
}
