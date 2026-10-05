import { useSearchParams } from "react-router";
import { thisMonthString } from "@/shared/lib";

/**
 * 表示する月を URL（?month=2026-10）から読み書きするフック ── features/select-month/model
 *
 *   const { month, setMonth } = useSelectedMonth();
 *
 * URL に持つと、再読み込み・「戻る」・URL の共有をしても、同じ月が表示される。
 * ?month がない・形がおかしいときは今月にする（URL は手で書き換えられるので必ず確かめる）。
 */
export const useSelectedMonth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get("month") ?? "";
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : thisMonthString();

  const setMonth = (next: string) =>
    // 今月なら ?month を消して URL を短くする。replace：月を変えるたびに履歴を増やさない
    setSearchParams(next === thisMonthString() ? {} : { month: next }, { replace: true });

  return { month, setMonth };
};
