import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

// maxWidth で中身の最大幅を決め、中央に寄せる。ページの一番外側に置く
//   xs 444px / sm 600px / md 900px / lg 1200px / xl 1536px
export default function ContainerBasic() {
  return (
    <Box sx={{ bgcolor: "grey.100", py: 2 }}>
      <Container maxWidth="sm">
        <Box sx={{ p: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1 }}>
          maxWidth="sm"（最大 600px）。左右の余白は Container が付ける
        </Box>
      </Container>
    </Box>
  );
}
