import { Badge, Button, Table, type TableColumn } from "@/shared/ui";

type Product = { id: string; name: string; category: string; price: number; stock: number };

const products: Product[] = [
  { id: "1", name: "りんご", category: "果物", price: 180, stock: 12 },
  { id: "2", name: "にんじん", category: "野菜", price: 90, stock: 0 },
  { id: "3", name: "緑茶", category: "飲み物", price: 150, stock: 3 },
];

// 列の定義。render で、1行分のデータからセルの中身を作る
const columns: TableColumn<Product>[] = [
  { key: "name", header: "商品名", render: (product) => product.name, rowHeader: true },
  { key: "category", header: "カテゴリ", render: (product) => product.category },
  { key: "price", header: "価格", render: (product) => `¥${product.price}`, align: "right" },
  {
    key: "stock",
    header: "在庫",
    render: (product) =>
      product.stock === 0 ? (
        <Badge tone="danger">在庫切れ</Badge>
      ) : (
        <Badge tone="success">{product.stock}点</Badge>
      ),
  },
  {
    key: "actions",
    header: "操作",
    align: "right",
    render: (product) => (
      <Button size="sm" variant="secondary" aria-label={`${product.name}を編集`}>
        編集
      </Button>
    ),
  },
];

export default function TableBasic() {
  return (
    <Table
      caption="商品一覧"
      columns={columns}
      rows={products}
      getRowKey={(product) => product.id}
    />
  );
}
