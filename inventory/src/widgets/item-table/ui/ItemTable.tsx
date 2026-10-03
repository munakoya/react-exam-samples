import { Link, useNavigate } from "react-router";
import { itemCategoryLabels, ItemStockBadge, type Item } from "@/entities/item";
import { AdjustStockButton } from "@/features/adjust-stock";
import { DeleteItemButton } from "@/features/delete-item";
import { Button, Stack, Table, type TableColumn } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib";

/**
 * 商品の一覧表 ── widgets/item-table/ui
 *
 * widgets には、entities（商品の表示）と features（入出庫・削除などの操作）を組み合わせた
 * 「大きめの UI のかたまり」を置く。features 同士は import し合えないので、ここで組み合わせる。
 *
 * 表示する items は外（ページ）から受け取る。絞り込みはページ側で済ませてから渡す。
 *
 *   <ItemTable items={visibleItems} />
 */

type ItemTableProps = {
  items: Item[];
  emptyMessage?: string;
};

export const ItemTable = ({ items, emptyMessage }: ItemTableProps) => {
  // ページの移動を JS から行う関数（ボタンのクリックで移動するときに使う）
  const navigate = useNavigate();

  // 列の定義：見出し（header）と、1行分のデータからセルの中身を作る関数（render）
  const columns: TableColumn<Item>[] = [
    {
      key: "name",
      header: "商品名",
      rowHeader: true, // この列を行の見出し（<th scope="row">）にする
      // <Link> はページを再読み込みせずに移動する <a>。to にパスを渡す
      render: (item) => (
        <Link to={`/items/${item.id}`}>
          {item.favorite && <span aria-label="お気に入り">★ </span>}
          {item.name}
        </Link>
      ),
    },
    { key: "category", header: "カテゴリ", render: (item) => itemCategoryLabels[item.category] },
    { key: "quantity", header: "在庫数", align: "right", render: (item) => item.quantity },
    { key: "minQuantity", header: "発注点", align: "right", render: (item) => item.minQuantity },
    { key: "stock", header: "状態", render: (item) => <ItemStockBadge item={item} /> },
    { key: "updatedAt", header: "更新日時", render: (item) => formatDateTime(item.updatedAt) },
    {
      key: "actions",
      header: "操作",
      render: (item) => (
        <Stack direction="row" gap={2}>
          <AdjustStockButton item={item} size="sm" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/items/${item.id}/edit`)}
            aria-label={`「${item.name}」を編集`}
          >
            編集
          </Button>
          <DeleteItemButton item={item} size="sm" />
        </Stack>
      ),
    },
  ];

  return (
    <Table
      caption="商品一覧"
      columns={columns}
      rows={items}
      getRowKey={(item) => item.id}
      emptyMessage={emptyMessage}
    />
  );
};
