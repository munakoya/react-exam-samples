import { useNavigate, useParams } from "react-router";
import { useItem, useItemStore } from "@/entities/item";
import { ItemForm, toFormInput, type ItemFormValues } from "@/features/item-form";
import { Button, Card, Container, EmptyState, PageHeader, Stack, useToast } from "@/shared/ui";

/**
 * 編集ページ（/items/:itemId/edit） ── pages/item-edit/ui
 *
 * 新規登録ページとの違いは2つだけ:
 *   - フォームの初期値に今の値を入れる（toFormInput(item)）
 *   - 送信したら addItem ではなく updateItem を呼ぶ
 */
export const ItemEditPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { itemId } = useParams<{ itemId: string }>();
  const item = useItem(itemId);
  const updateItem = useItemStore((state) => state.updateItem);

  if (!item) {
    return (
      <Container size="sm">
        <EmptyState
          title="商品が見つかりません"
          description="削除されたか、URL が間違っている可能性があります。"
          action={<Button onClick={() => navigate("/items")}>一覧へ戻る</Button>}
        />
      </Container>
    );
  }

  const handleSubmit = (values: ItemFormValues) => {
    updateItem(item.id, values);
    toast.show(`「${values.name}」を更新しました`, "success");
    navigate(`/items/${item.id}`); // 詳細ページへ戻る
  };

  return (
    <Container size="sm">
      <Stack gap={5}>
        <PageHeader title="編集" description={item.name} />
        <Card>
          {/*
            defaultValues はフォームを作った最初の1回だけ使われる。
            key に id を渡すと、別の Item の編集ページへ移ったときにフォームが作り直され、初期値が入れ替わる
          */}
          <ItemForm
            key={item.id}
            defaultValues={toFormInput(item)}
            submitLabel="更新"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/items/${item.id}`)}
          />
        </Card>
      </Stack>
    </Container>
  );
};
