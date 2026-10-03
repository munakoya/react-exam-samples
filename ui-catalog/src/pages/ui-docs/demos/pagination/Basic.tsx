import { useState } from "react";
import { Pagination, Stack } from "@/shared/ui";

const PER_PAGE = 5;

// 仮のデータ（47件）
const items = Array.from({ length: 47 }, (_, index) => ({
  id: index + 1,
  name: `商品 ${index + 1}`,
}));

// 表示する範囲を slice で切り出す。ページ数は「件数 ÷ 1ページの件数」の切り上げ
export default function PaginationBasic() {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(items.length / PER_PAGE);
  const visibleItems = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Stack gap={3}>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} />
    </Stack>
  );
}
