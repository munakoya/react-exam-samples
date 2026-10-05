import Box from "@mui/material/Box";

// Box は「sx が書ける <div>」。ちょっとした余白・枠線・背景をその場で付けるときに使う
export default function BoxSx() {
  return (
    <Box
      sx={{
        p: 2, // padding：theme.spacing(2) = 16px
        border: 1, // 1px solid
        borderColor: "divider", // 色は theme の名前で指定する
        borderRadius: 1, // theme.shape.borderRadius × 1 = 8px
        bgcolor: "background.paper",
        // 疑似クラス・子要素のセレクタも書ける
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      マウスを乗せると枠の色が変わる
    </Box>
  );
}
