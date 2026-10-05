import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useSearchParams } from "react-router";
import { searchDocs, SearchField, SearchResults } from "@/features/doc-search";
import { PageHeader } from "@/shared/ui";

/**
 * 検索ページ（/search?q=…） ── pages/search/ui
 *
 * キーワードは URL に持つ。結果から見出しへ飛んで「戻る」で帰ってきても、同じ検索結果が出る。
 */
export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // 結果は state にせず、キーワードから毎回計算する
  const results = searchDocs(query);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="検索" description="見出しと本文から探す。見出しに含むものが上に出る。" />
        <SearchField
          value={query}
          // replace：1文字ごとにブラウザの履歴を増やさない
          onChange={(value) => setSearchParams(value === "" ? {} : { q: value }, { replace: true })}
          autoFocus
        />
        {query.trim() !== "" && <SearchResults results={results} />}
      </Stack>
    </Container>
  );
};
