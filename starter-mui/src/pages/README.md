# pages ── URL 1 つ分の画面

ページの役目は**組み立て**と**ダイアログの開閉**だけ。計算・保存の処理は entities・features に置く。
作ったら `app/App.tsx` に Route を足し、`app/layouts/RootLayout.tsx` のメニューに足す。

```text
pages/
├── item-list/ui/ItemListPage.tsx      /items      一覧（追加・編集はダイアログ）
├── item-detail/ui/ItemDetailPage.tsx  /items/:id  詳細
├── home/                              雛形の仮のページ（一覧ができたら消す）
└── not-found/                         404
```

完成形の例：[ユーザー管理の UserListPage](https://github.com/munakoya/react-exam-samples/blob/main/user-management/src/pages/user-list/ui/UserListPage.tsx)・
[UserDetailPage](https://github.com/munakoya/react-exam-samples/blob/main/user-management/src/pages/user-detail/ui/UserDetailPage.tsx)

## item-list/ui/ItemListPage.tsx

```tsx
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useItemStore, type Item } from "@/entities/item";
import { ItemFormDialog } from "@/features/item-form";
import { EmptyState, PageHeader, useFormDialog } from "@/shared/ui";
import { ItemTable } from "@/widgets/item-table";

export const ItemListPage = () => {
  const items = useItemStore((state) => state.items);
  const dialog = useFormDialog<Item>(); // open・target・openNew・openEdit(item)・close

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>
      追加
    </Button>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="一覧" action={addButton} />
        {items.length === 0 ? (
          <EmptyState title="まだありません" description="「追加」から登録してください。" action={addButton} />
        ) : (
          <ItemTable items={items} onEdit={dialog.openEdit} />
        )}
      </Stack>
      {/* 追加・編集で同じダイアログを1つだけ置く。target が undefined なら追加 */}
      <ItemFormDialog open={dialog.open} item={dialog.target} onClose={dialog.close} />
    </Container>
  );
};
```

## item-detail/ui/ItemDetailPage.tsx

```tsx
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { itemCategoryLabels, useItemStore, type Item } from "@/entities/item";
import { DeleteItemButton } from "@/features/delete-item";
import { ItemFormDialog } from "@/features/item-form";
import { DescriptionList, EmptyState, PageHeader, useFormDialog } from "@/shared/ui";

export const ItemDetailPage = () => {
  const { id } = useParams();
  const item = useItemStore((state) => state.items.find((i) => i.id === id));
  const navigate = useNavigate();
  const dialog = useFormDialog<Item>();

  // 削除済み・URL の打ち間違い
  if (!item) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="見つかりません"
          action={<Button component={RouterLink} to="/items" variant="contained">一覧へ</Button>}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title={item.name}
          breadcrumbs={[{ label: "一覧", to: "/items" }, { label: item.name }]}
          action={
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => dialog.openEdit(item)}>編集</Button>
              <DeleteItemButton item={item} onDeleted={() => navigate("/items", { replace: true })} />
            </Stack>
          }
        />
        <Paper variant="outlined" sx={{ p: 3 }}>
          <DescriptionList
            items={[
              { term: "種類", description: itemCategoryLabels[item.category] },
              { term: "価格", description: `${item.price.toLocaleString()}円` },
              { term: "メモ", description: item.memo || "なし", multiline: true },
            ]}
          />
        </Paper>
      </Stack>
      <ItemFormDialog open={dialog.open} item={dialog.target} onClose={dialog.close} />
    </Container>
  );
};
```

画面の型（一覧・詳細・登録・ダッシュボード）は [MUI 画面構築ガイド › 6. 画面パターン集](https://munakoya.github.io/react-exam-samples/guide/mui-guide/06-page-patterns)。
