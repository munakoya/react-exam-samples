import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  productCategories,
  productCategoryOptions,
  products,
  ProductCard,
  type Product,
  type ProductCategory,
} from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import {
  Container,
  EmptyState,
  Grid,
  PageHeader,
  SegmentedControl,
  SelectField,
  Stack,
  TextField,
} from "@/shared/ui";
import styles from "./ProductListPage.module.css";

/**
 * 商品一覧ページ（/products） ── pages/product-list/ui
 *
 * 絞り込み・並び替え・検索の条件は、URL にも残す（?q=りんご&category=fruit&sort=price-asc）。
 *   - 再読み込みしても条件が残る
 *   - 条件つきの URL を共有できる
 *   - 商品詳細から「戻る」で、同じ条件の一覧に戻れる
 */

type CategoryFilter = "all" | ProductCategory;
const sortKeys = ["recommended", "price-asc", "price-desc"] as const;
type SortKey = (typeof sortKeys)[number];

const categoryFilterOptions: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "すべて" },
  ...productCategoryOptions,
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "おすすめ順" },
  { value: "price-asc", label: "価格の安い順" },
  { value: "price-desc", label: "価格の高い順" },
];

const compareFns: Record<SortKey, (a: Product, b: Product) => number> = {
  recommended: () => 0, // 元の順番のまま
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

// URL の値は手で書き換えられるので、選択肢のどれかでなければ初期値にする
const parseCategory = (value: string | null): CategoryFilter =>
  productCategories.find((c) => c === value) ?? "all";
const parseSort = (value: string | null): SortKey =>
  sortKeys.find((s) => s === value) ?? "recommended";

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = parseCategory(searchParams.get("category"));
  const sort = parseSort(searchParams.get("sort"));

  /** URL の値を1つだけ変える（他は残す）。初期値と同じなら URL から消してすっきりさせる */
  const updateParam = (key: string, value: string, defaultValue: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  /*
   * キーワードの入力欄だけは、値を useState で持ち、URL には書き写すだけにする。
   * React Router の初期設定では URL の変更が少し遅れて反映される（startTransition）ため、
   * 入力欄の value を URL から直接読むと、速く打ったときや日本語の変換中に文字が消えることがある。
   * （このアプリは AppProviders で useTransitions={false} にしているが、どちらの設定でも安全な書き方にしておく）
   * 最初の値だけ URL から読むので、再読み込みしても検索語は残る。
   */
  const [keyword, setKeyword] = useState(() => searchParams.get("q") ?? "");

  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleProducts = products
    .filter((p) => category === "all" || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(normalizedKeyword))
    .toSorted(compareFns[sort]);

  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader title="商品一覧" description="3,000円以上のお買い上げで送料無料" />

        <Stack direction="row" gap={3} align="end" wrap>
          <div className={styles.search}>
            <TextField
              label="キーワード"
              type="search"
              placeholder="商品名で検索"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                updateParam("q", event.target.value, "");
              }}
            />
          </div>
          <div className={styles.sort}>
            <SelectField
              label="並び順"
              options={sortOptions}
              placeholder={false}
              value={sort}
              onChange={(event) => updateParam("sort", event.target.value, "recommended")}
            />
          </div>
        </Stack>

        <SegmentedControl
          label="カテゴリで絞り込む"
          options={categoryFilterOptions}
          value={category}
          onChange={(next) => updateParam("category", next, "all")}
        />

        {visibleProducts.length === 0 ? (
          <EmptyState title="条件に合う商品はありません" />
        ) : (
          // 1枚あたり最小 200px で、画面幅に入る数だけ並べる
          <Grid min={200}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                actions={<AddToCartButton product={product} />}
              />
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
};
