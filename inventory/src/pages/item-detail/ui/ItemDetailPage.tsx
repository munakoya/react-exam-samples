import { useNavigate, useParams } from "react-router";
import { itemCategoryLabels, ItemStockBadge, useItem } from "@/entities/item";
import { StockMovementTable, useStockMovementStore } from "@/entities/stock-movement";
import { AdjustStockButton } from "@/features/adjust-stock";
import { DeleteItemButton } from "@/features/delete-item";
import {
  Breadcrumb,
  ButtonLink,
  Card,
  Container,
  DescriptionList,
  EmptyState,
  PageHeader,
  Stack,
} from "@/shared/ui";
import { formatDateTime } from "@/shared/lib";
import styles from "./ItemDetailPage.module.css";

/**
 * 詳細ページ（/items/:itemId） ── pages/item-detail/ui
 *
 * useParams で URL の :itemId の部分を取り出し、store から1件を探して表示する。
 *   /items/abc-123  →  useParams() は { itemId: "abc-123" }
 */
export const ItemDetailPage = () => {
  const navigate = useNavigate();
  // <Route path="/items/:itemId"> の :itemId と同じ名前で取り出す
  const { itemId } = useParams<{ itemId: string }>();
  const item = useItem(itemId);
  // 履歴は全商品分の配列を選び、この商品の分だけを画面側で取り出す（セレクターの中で filter しない）
  const movements = useStockMovementStore((state) => state.movements);

  // URL の id が存在しない（削除済み・打ち間違い）ときの表示
  if (!item) {
    return (
      <Container size="sm">
        <EmptyState
          title="商品が見つかりません"
          description="削除されたか、URL が間違っている可能性があります。"
          action={<ButtonLink to="/items">一覧へ戻る</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Stack gap={5}>
        <Breadcrumb items={[{ label: "商品一覧", to: "/items" }, { label: item.name }]} />

        <PageHeader
          title={item.name}
          action={
            <Stack direction="row" gap={2}>
              <AdjustStockButton item={item} />
              {/* ページを移動するだけなので、Button ＋ navigate ではなくリンク（ButtonLink）にする */}
              <ButtonLink to={`/items/${item.id}/edit`} variant="secondary">
                編集
              </ButtonLink>
              {/* 削除したら一覧へ移動する。replace：戻るボタンで削除済みのページに戻らないように */}
              <DeleteItemButton
                item={item}
                onDeleted={() => navigate("/items", { replace: true })}
              />
            </Stack>
          }
        />

        <Card>
          <DescriptionList
            items={[
              { term: "カテゴリ", description: itemCategoryLabels[item.category] },
              {
                term: "在庫数",
                description: (
                  <Stack direction="row" gap={2} align="center">
                    {item.quantity}
                    <ItemStockBadge item={item} />
                  </Stack>
                ),
              },
              { term: "発注点", description: `${item.minQuantity}（この数以下で「在庫少」）` },
              { term: "お気に入り", description: item.favorite ? "★ お気に入り" : "—" },
              { term: "メモ", description: item.memo || "—", multiline: true },
              { term: "登録日時", description: formatDateTime(item.createdAt) },
              { term: "更新日時", description: formatDateTime(item.updatedAt) },
            ]}
          />
        </Card>

        {/* ----- 入出庫の履歴 ----- */}
        <section className={styles.section} aria-labelledby="history-title">
          <h2 id="history-title" className={styles.sectionTitle}>
            入出庫の履歴
          </h2>
          <StockMovementTable
            movements={movements.filter((movement) => movement.itemId === item.id)}
          />
        </section>
      </Stack>
    </Container>
  );
};
