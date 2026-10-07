import Box from "@mui/material/Box";
import { DataTable, type DataTableColumn } from "@/shared/ui";

type Product = { id: string; name: string; stock: number; price: number };

const products: Product[] = [
  { id: "A-001", name: "ボールペン", stock: 120, price: 110 },
  { id: "A-002", name: "ノート", stock: 8, price: 180 },
  { id: "A-003", name: "クリップ", stock: 0, price: 220 },
  { id: "A-004", name: "付箋", stock: 45, price: 150 },
];

// 列の定義を配列で書く。sortValue を渡した列は、見出しを押して並び替えられる。
// selectedIds・rowActions・pageSize を渡さなければ、ただの表になる
const columns: DataTableColumn<Product>[] = [
  { key: "id", label: "品番", render: (p) => p.id },
  { key: "name", label: "品名", render: (p) => p.name, sortValue: (p) => p.name },
  {
    key: "stock",
    label: "在庫数",
    align: "right",
    sortValue: (p) => p.stock,
    // 中身は ReactNode なので、条件で色を変えたり部品を置いたりできる
    render: (p) => (
      <Box component="span" sx={{ color: p.stock === 0 ? "error.main" : undefined }}>
        {p.stock}
      </Box>
    ),
  },
  { key: "price", label: "単価", align: "right", sortValue: (p) => p.price, render: (p) => `${p.price.toLocaleString()}円` },
];

export default function DataTableBasic() {
  return <DataTable ariaLabel="商品一覧" rows={products} columns={columns} defaultSort={{ key: "stock", order: "asc" }} />;
}
