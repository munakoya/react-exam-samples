import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const products = [
  { id: "1", name: "りんご", price: 150 },
  { id: "2", name: "バナナ", price: 120 },
  { id: "3", name: "ぶどう", price: 480 },
  { id: "4", name: "みかん", price: 90 },
  { id: "5", name: "もも", price: 300 },
  { id: "6", name: "なし", price: 200 },
];

// size に { xs, sm, md } を渡すと、画面幅ごとに列の数が変わる
//   xs: 12 → 1列（スマホ） / sm: 6 → 2列 / md: 4 → 3列（PC）
export default function GridResponsive() {
  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" component="h3">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.price.toLocaleString()}円
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
