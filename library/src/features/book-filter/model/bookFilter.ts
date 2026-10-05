import { bookGenres, type Book, type BookGenre } from "@/entities/book";
import { availabilities, getAvailability, type Availability, type Loan } from "@/entities/loan";

/**
 * 本の一覧の絞り込み・並び替え・ページ送りの条件 ── features/book-filter/model
 *
 * 条件は URL の ?q=…&genre=novel&status=onLoan&sort=title&order=asc&page=2 に持つ。
 * URL に持つと、再読み込み・ブックマーク・URL の共有をしても同じ表示になり、
 * 詳細ページから「戻る」で帰ってきたときも条件が残る。
 *
 * このファイルは React を使わない「ふつうの関数」だけを置く（読みやすく、確かめやすい）。
 * URL との読み書きは useBookFilter.ts が受け持つ。
 */

// ---------- 条件の型と初期値 ----------

export const bookSortKeys = ["createdAt", "title", "rating"] as const;
export type BookSortKey = (typeof bookSortKeys)[number];
export type SortOrder = "asc" | "desc";

/** 列の見出しを初めて押したときの向き（文字は あ→ん、日付・評価は新しい・高い順） */
export const defaultSortOrders: Record<BookSortKey, SortOrder> = {
  createdAt: "desc",
  title: "asc",
  rating: "desc",
};

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export type BookFilter = {
  /** タイトル・著者・タグのキーワード */
  q: string;
  genre: BookGenre | "all";
  status: Availability | "all";
  sort: BookSortKey;
  order: SortOrder;
  /** 今のページ（1 から数える） */
  page: number;
  /** 1ページの件数 */
  perPage: number;
};

export const defaultBookFilter: BookFilter = {
  q: "",
  genre: "all",
  status: "all",
  sort: "createdAt",
  order: "desc",
  page: 1,
  perPage: ROWS_PER_PAGE_OPTIONS[0],
};

// ---------- URL ⇄ 条件 ----------

/**
 * 配列（as const）の中にある値なら、その値（型つき）を返す。なければ undefined
 *
 * URL の値は手で書き換えられるので、選択肢のどれかかを必ず確かめてから使う。
 * find の結果は「配列の要素の型」になるので、型を絞り込める。
 */
const pick = <T extends string>(options: readonly T[], value: string | null) =>
  options.find((option) => option === value);

/** 1以上の整数なら数値、そうでなければ undefined */
const toPositiveInt = (value: string | null) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 ? number : undefined;
};

/** URL の値 → 条件（おかしな値は初期値にする） */
export const parseBookFilter = (params: URLSearchParams): BookFilter => {
  const sort = pick(bookSortKeys, params.get("sort")) ?? defaultBookFilter.sort;
  return {
    q: params.get("q") ?? "",
    genre: pick(bookGenres, params.get("genre")) ?? "all",
    status: pick(availabilities, params.get("status")) ?? "all",
    sort,
    order: pick(["asc", "desc"] as const, params.get("order")) ?? defaultSortOrders[sort],
    page: toPositiveInt(params.get("page")) ?? 1,
    perPage:
      ROWS_PER_PAGE_OPTIONS.find((n) => n === Number(params.get("per"))) ??
      defaultBookFilter.perPage,
  };
};

/** 条件 → URL の値（初期値と同じ項目は URL に書かない。URL が短く読みやすくなる） */
export const toSearchParams = (filter: BookFilter) => {
  const params = new URLSearchParams();
  if (filter.q !== "") params.set("q", filter.q);
  if (filter.genre !== "all") params.set("genre", filter.genre);
  if (filter.status !== "all") params.set("status", filter.status);
  if (filter.sort !== defaultBookFilter.sort) params.set("sort", filter.sort);
  if (filter.order !== defaultSortOrders[filter.sort]) params.set("order", filter.order);
  if (filter.page !== 1) params.set("page", String(filter.page));
  if (filter.perPage !== defaultBookFilter.perPage) params.set("per", String(filter.perPage));
  return params;
};

/** キーワード・ジャンル・状態のどれかで絞り込んでいるか（「条件をクリア」を出すかに使う） */
export const isFiltering = (filter: BookFilter) =>
  filter.q.trim() !== "" || filter.genre !== "all" || filter.status !== "all";

// ---------- 絞り込み・並び替え ----------

/**
 * 条件に合う本だけを返す
 *
 * 本の状態（貸出中など）は本のデータにはなく、貸出の記録から計算する。
 * そのため「今の貸出」の Map（本の id → 貸出）と今日の日付も受け取る。
 */
export const filterBooks = (
  books: Book[],
  currentLoans: Map<string, Loan>,
  filter: BookFilter,
  today: string,
) => {
  const keyword = filter.q.trim().toLowerCase();
  return books.filter(
    (book) =>
      (filter.genre === "all" || book.genre === filter.genre) &&
      (filter.status === "all" ||
        getAvailability(currentLoans.get(book.id), today) === filter.status) &&
      (keyword === "" ||
        // タイトル・著者・タグのどれかにキーワードが含まれるか
        [book.title, book.author, ...book.tags].some((text) =>
          text.toLowerCase().includes(keyword),
        )),
  );
};

// 並び替えの比較関数。どれも「小さい順（asc）」で書き、desc のときは結果を逆にする
const compareFns: Record<BookSortKey, (a: Book, b: Book) => number> = {
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
  // "ja"：ひらがな・カタカナを日本語の順で比べる（漢字は読みではなく文字の番号の順になる）
  title: (a, b) => a.title.localeCompare(b.title, "ja"),
  rating: (a, b) => a.rating - b.rating,
};

/** 並び替えた新しい配列を返す（toSorted は元の配列を変えない） */
export const sortBooks = (books: Book[], sort: BookSortKey, order: SortOrder) =>
  books.toSorted((a, b) => (order === "asc" ? 1 : -1) * compareFns[sort](a, b));
