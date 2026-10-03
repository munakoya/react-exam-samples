import { useNavigate } from "react-router";
import { useItemStore } from "@/entities/item";
import { ItemForm, toFormInput, type ItemFormValues } from "@/features/item-form";
import { Card, Container, PageHeader, Stack, useToast } from "@/shared/ui";

/**
 * 新規登録ページ（/items/new） ── pages/item-new/ui
 *
 * フォーム（features/item-form）は入力とチェックだけを担当する。
 * チェックを通った値を受け取り、store に保存して、通知を出し、一覧へ移動するのはページの役目。
 */
export const ItemNewPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const addItem = useItemStore((state) => state.addItem);

  const handleSubmit = (values: ItemFormValues) => {
    const created = addItem(values); // persist によって localStorage にも自動で保存される
    toast.show(`「${created.name}」を登録しました`, "success");
    navigate("/items");
  };

  return (
    <Container size="sm">
      <Stack gap={5}>
        <PageHeader title="新規登録" />
        <Card>
          <ItemForm
            defaultValues={toFormInput()} // 空欄から始める
            submitLabel="登録"
            onSubmit={handleSubmit}
            onCancel={() => navigate("/items")}
          />
        </Card>
      </Stack>
    </Container>
  );
};
