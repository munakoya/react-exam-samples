import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  getStockStatus,
  itemCategories,
  itemCategoryOptions,
  useItemStore,
  type ItemCategory,
} from "@/entities/item";
import {
  Button,
  Container,
  EmptyState,
  PageHeader,
  SegmentedControl,
  Stack,
  Switch,
  TextField,
} from "@/shared/ui";
import { ItemTable } from "@/widgets/item-table";
import styles from "./ItemListPage.module.css";

/**
 * 一覧ページ（/items） ── pages/item-list/ui
 *
 * pages は、URL 1つ分の画面。下の層（widgets・features・entities・shared）を組み合わせるだけにして、
 * 細かい処理は下の層に任せる。
 *
 * このページで使っている React Router の機能:
 *   - useNavigate      … ボタンのクリックでページを移動する
 *   - useSearchParams  … URL の ?category=food&low=1 を読み書きする（絞り込みを URL に残す）
 */

// 絞り込みの選択肢：「すべて」＋ 各カテゴリ
type CategoryFilter = "all" | ItemCategory;

const categoryFilterOptions: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "すべて" },
  ...itemCategoryOptions,
];

// URL の値は何が入っているか分からない（手で書き換えられる）ので、カテゴリのどれかでなければ "all" にする
const parseCategory = (value: string | null): CategoryFilter =>
  itemCategories.find((category) => category === value) ?? "all";

export const ItemListPage = () => {
  const navigate = useNavigate();

  // store から一覧を選ぶ。絞り込みはセレクターの中ではなく、下で行う（itemStore.ts の注意を参照）
  const items = useItemStore((state) => state.items);

  // ----- 絞り込みの条件 -----

  // カテゴリ・要発注のみ：URL の ?category=...&low=1 に持つ。再読み込み・URL の共有をしても絞り込みが残る
  const [searchParams, setSearchParams] = useSearchParams();
  const category = parseCategory(searchParams.get("category"));
  const lowOnly = searchParams.get("low") === "1";

  /**
   * URL の値を1つだけ変える（他の値は残す）
   *
   * setSearchParams に関数を渡すと、今の値（prev）を元に次の値を作れる。
   * setSearchParams({ category: "food" }) と書くと、?low=1 が消えてしまうので注意。
   * value が null ならその値を消す。replace：絞り込みのたびにブラウザの履歴を増やさない。
   */
  const updateParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === null) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  // キーワード：このページの中だけで使うので useState（1文字ごとに URL を書き換えないように）
  const [keyword, setKeyword] = useState("");

  // ----- 表示する一覧 -----
  // items と絞り込みの条件から計算できるので、state にしない（毎回計算する）
  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleItems = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (!lowOnly || getStockStatus(item) !== "ok") &&
      item.name.toLowerCase().includes(normalizedKeyword),
  );

  // 要発注（在庫少・在庫切れ）の件数。0件でなければ見出しの下に知らせる
  const lowCount = items.filter((item) => getStockStatus(item) !== "ok").length;

  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader
          title="商品一覧"
          description={
            lowCount > 0
              ? `要発注（在庫少・在庫切れ）の商品が ${lowCount}件 あります`
              : "登録したデータはブラウザ（localStorage）に保存されます"
          }
          action={<Button onClick={() => navigate("/items/new")}>新規登録</Button>}
        />

        {items.length === 0 ? (
          // ----- 1件もないとき：一覧の代わりに案内を出す -----
          <EmptyState
            title="まだ商品がありません"
            description="「新規登録」から追加してください。"
            action={<Button onClick={() => navigate("/items/new")}>新規登録</Button>}
          />
        ) : (
          <>
            {/* ----- 絞り込み ----- */}
            <Stack direction="row" gap={3} align="end" wrap>
              <div className={styles.search}>
                <TextField
                  label="キーワード"
                  type="search"
                  placeholder="商品名で検索"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <SegmentedControl
                label="カテゴリで絞り込む"
                options={categoryFilterOptions}
                value={category}
                // "all" のときは ?category を URL から消す
                onChange={(next) => updateParam("category", next === "all" ? null : next)}
              />
            </Stack>

            <Stack direction="row" justify="between" align="center" wrap gap={2}>
              <Switch
                label="要発注のみ表示"
                checked={lowOnly}
                onChange={(event) => updateParam("low", event.target.checked ? "1" : null)}
              />
              <p className={styles.count}>
                {visibleItems.length}件 / 全{items.length}件
              </p>
            </Stack>

            {/* ----- 一覧 ----- */}
            <ItemTable items={visibleItems} emptyMessage="条件に一致する商品はありません" />
          </>
        )}
      </Stack>
    </Container>
  );
};
