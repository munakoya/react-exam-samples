import { useSearchParams } from "react-router";
import { parseBookFilter, toSearchParams, type BookFilter } from "./bookFilter";

/**
 * 本の一覧の条件を URL から読み、URL に書き込むフック ── features/book-filter/model
 *
 *   const { filter, updateFilter, resetFilter } = useBookFilter();
 *
 *   filter.genre                          // 今の条件（URL から作る。state には持たない）
 *   updateFilter({ genre: "novel" })      // 一部だけ変える（ほかの条件は残す）
 *   updateFilter({ page: 3 })             // ページだけ変える
 *   resetFilter()                         // 絞り込みを全部やめる（並び順は残す）
 *
 * 絞り込みの条件を変えたときは、1ページ目に戻す（3ページ目のまま件数が減ると、空のページになるため）。
 */
export const useBookFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL が変わるたびに、ここで条件を作り直す（URL が「正」。useState と二重に持たない）
  const filter = parseBookFilter(searchParams);

  const updateFilter = (changes: Partial<BookFilter>) => {
    const next: BookFilter = {
      ...filter,
      ...changes,
      // page を指定していなければ 1 ページ目へ（?? は左が undefined なら右）
      page: changes.page ?? 1,
    };
    // replace：条件を変えるたびにブラウザの履歴を増やさない（「戻る」で前のページに戻れるように）
    setSearchParams(toSearchParams(next), { replace: true });
  };

  const resetFilter = () => updateFilter({ q: "", genre: "all", status: "all" });

  return { filter, updateFilter, resetFilter };
};
