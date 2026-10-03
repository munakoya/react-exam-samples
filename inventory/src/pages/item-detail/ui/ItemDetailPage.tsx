import { Link, useNavigate, useParams } from "react-router";
import { itemCategoryLabels, ItemStockBadge, useItem } from "@/entities/item";
import { StockMovementTable, useStockMovementStore } from "@/entities/stock-movement";
import { AdjustStockButton } from "@/features/adjust-stock";
import { DeleteItemButton } from "@/features/delete-item";
import { Button, Card, Container, EmptyState, PageHeader, Stack } from "@/shared/ui";
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
          action={<Button onClick={() => navigate("/items")}>一覧へ戻る</Button>}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Stack gap={5}>
        {/* ← 一覧へ：<Link> はページを再読み込みせずに移動する */}
        <Link to="/items" className={styles.back}>
          ← 一覧へ戻る
        </Link>

        <PageHeader
          title={item.name}
          action={
            <Stack direction="row" gap={2}>
              <AdjustStockButton item={item} />
              <Button variant="secondary" onClick={() => navigate(`/items/${item.id}/edit`)}>
                編集
              </Button>
              {/* 削除したら一覧へ移動する。replace：戻るボタンで削除済みのページに戻らないように */}
              <DeleteItemButton
                item={item}
                onDeleted={() => navigate("/items", { replace: true })}
              />
            </Stack>
          }
        />

        <Card>
          {/* 項目名と値の組は <dl>（説明リスト）。<dt> が項目名、<dd> が値 */}
          <dl className={styles.list}>
            <dt>カテゴリ</dt>
            <dd>{itemCategoryLabels[item.category]}</dd>

            <dt>在庫数</dt>
            <dd>
              <Stack direction="row" gap={2} align="center">
                {item.quantity}
                <ItemStockBadge item={item} />
              </Stack>
            </dd>

            <dt>発注点</dt>
            <dd>{item.minQuantity}（この数以下で「在庫少」）</dd>

            <dt>お気に入り</dt>
            <dd>{item.favorite ? "★ お気に入り" : "—"}</dd>

            <dt>メモ</dt>
            {/* data-multiline：改行をそのまま表示する（CSS の white-space: pre-wrap） */}
            <dd data-multiline>{item.memo || "—"}</dd>

            <dt>登録日時</dt>
            <dd>{formatDateTime(item.createdAt)}</dd>

            <dt>更新日時</dt>
            <dd>{formatDateTime(item.updatedAt)}</dd>
          </dl>
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
