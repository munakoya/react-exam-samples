import Box from "@mui/material/Box";

// component で HTML のタグを変えられる。display: "flex" で横に並べる
export default function BoxFlex() {
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2, // 16px
        p: 2,
        bgcolor: "grey.100",
        borderRadius: 1,
      }}
    >
      <Box sx={{ fontWeight: "bold" }}>左側（タイトル）</Box>
      <Box sx={{ color: "text.secondary", fontSize: 14 }}>右側（補足）</Box>
    </Box>
  );
}
