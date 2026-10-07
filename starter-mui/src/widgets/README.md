# widgets ── 見せ方 ＋ 操作 を組み合わせた大きめの UI

一覧の表・カードの並びなど。entities の見せ方（Card・Chip）に、features の操作（削除ボタン）を差し込む。
**ページが 1 つしかない小さなお題なら、widgets を作らずページに直接書いてもよい**（長くなったら移す）。

```text
widgets/
├── item-table/ui/ItemTable.tsx          表（DataTable ＋ 列の定義 ＋ 行の操作）
└── item-card-grid/ui/ItemCardGrid.tsx   カードを Grid に並べる
```

- 「編集」のダイアログはページが持つ。widgets は押されたことを `onEdit(item)` で伝えるだけ
- 選択中の行（チェックボックス）のように、その表の中だけで使う状態は `useState`

完成形の例：[ユーザー管理の UserTable](https://github.com/munakoya/react-exam-samples/blob/main/user-management/src/widgets/user-table/ui/UserTable.tsx)・
[UserCardGrid](https://github.com/munakoya/react-exam-samples/blob/main/user-management/src/widgets/user-card-grid/ui/UserCardGrid.tsx)

## item-table/ui/ItemTable.tsx（shared/ui の DataTable を使う）

```tsx
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { itemCategoryLabels, type Item } from "@/entities/item";
import { DeleteItemButton } from "@/features/delete-item";
import { DataTable, type DataTableColumn } from "@/shared/ui";

// 列の定義（sortValue を渡した列は見出しで並び替えられる）
const columns: DataTableColumn<Item>[] = [
  { key: "name", label: "名前", render: (item) => item.name, sortValue: (item) => item.name },
  { key: "category", label: "種類", render: (item) => itemCategoryLabels[item.category] },
  { key: "price", label: "価格", align: "right", sortValue: (item) => item.price, render: (item) => `${item.price.toLocaleString()}円` },
];

export const ItemTable = ({ items, onEdit }: { items: Item[]; onEdit: (item: Item) => void }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // チェックボックスを使わないなら消す

  return (
    <DataTable
      ariaLabel="一覧"
      rows={items}
      columns={columns}
      getRowLabel={(item) => item.name}
      pageSize={10}
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
      // selectionActions={(ids) => <DeleteItemsButton ids={ids} onDeleted={() => setSelectedIds([])} />}
      rowActions={(item) => (
        <>
          <Tooltip title="編集">
            <IconButton size="small" aria-label={`「${item.name}」を編集`} onClick={() => onEdit(item)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <DeleteItemButton item={item} />
        </>
      )}
    />
  );
};
```

DataTable の props は [MUI 部品カタログ › DataTable](https://munakoya.github.io/react-exam-samples/mui-catalog/data-table)。
