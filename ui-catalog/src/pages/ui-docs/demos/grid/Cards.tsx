import { Badge, Button, Card, Grid } from "@/shared/ui";

const products = [
  { id: "1", name: "りんご", price: 180, inStock: true },
  { id: "2", name: "バナナ", price: 120, inStock: true },
  { id: "3", name: "ぶどう", price: 480, inStock: false },
  { id: "4", name: "みかん", price: 150, inStock: true },
];

// 1つあたりの最小幅（min）を決めると、入る数だけ横に並ぶ。狭い画面では自動で列が減る
export default function GridCards() {
  return (
    <Grid min={160}>
      {products.map((product) => (
        <Card
          key={product.id}
          title={product.name}
          footer={
            <Button size="sm" disabled={!product.inStock}>
              カートに入れる
            </Button>
          }
        >
          <p>¥{product.price}</p>
          <Badge tone={product.inStock ? "success" : "danger"}>
            {product.inStock ? "在庫あり" : "売り切れ"}
          </Badge>
        </Card>
      ))}
    </Grid>
  );
}
