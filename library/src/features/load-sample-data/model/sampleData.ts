import type { Book, BookInput } from "@/entities/book";
import type { Loan } from "@/entities/loan";
import { addDays } from "@/shared/lib";

/**
 * 動作確認用のサンプルデータ ── features/load-sample-data/model
 *
 * お題の要件ではない。公開ページ・手元で「表・ページ送り・期限切れ」をすぐ確かめるためのもの。
 * 日付は「今日」から計算するので、いつ読み込んでも 期限切れ・期限間近・貸出中・返却済み がそろう。
 */

const books: BookInput[] = [
  { title: "坊っちゃん", author: "夏目漱石", genre: "novel", isbn: "", publishedYear: 1906, rating: 4, tags: ["古典", "名作"], memo: "" },
  { title: "こころ", author: "夏目漱石", genre: "novel", isbn: "", publishedYear: 1914, rating: 5, tags: ["古典", "名作"], memo: "" },
  { title: "銀河鉄道の夜", author: "宮沢賢治", genre: "novel", isbn: "", publishedYear: 1934, rating: 5, tags: ["古典", "ファンタジー"], memo: "" },
  { title: "走れメロス", author: "太宰治", genre: "novel", isbn: "", publishedYear: 1940, rating: 3, tags: ["古典", "短編"], memo: "" },
  { title: "羅生門", author: "芥川龍之介", genre: "novel", isbn: "", publishedYear: 1915, rating: 4, tags: ["古典", "短編"], memo: "" },
  { title: "はじめての TypeScript", author: "山田 太郎", genre: "tech", isbn: "978-4-00-000001-0", publishedYear: 2025, rating: 4, tags: ["TypeScript", "入門"], memo: "第3章の型の絞り込みが分かりやすい" },
  { title: "React 実践入門", author: "佐藤 花子", genre: "tech", isbn: "978-4-00-000002-7", publishedYear: 2026, rating: 5, tags: ["React", "入門"], memo: "" },
  { title: "設計の考え方", author: "鈴木 一郎", genre: "tech", isbn: "978-4-00-000003-4", publishedYear: 2024, rating: 3, tags: ["設計"], memo: "" },
  { title: "伝わるデザインの基本", author: "高橋 美咲", genre: "design", isbn: "978-4-00-000004-1", publishedYear: 2023, rating: 4, tags: ["デザイン", "入門"], memo: "" },
  { title: "UI デザインの教科書", author: "田中 健", genre: "design", isbn: "978-4-00-000005-8", publishedYear: 2022, rating: 0, tags: ["デザイン", "UI"], memo: "" },
  { title: "チームで成果を出す仕事術", author: "伊藤 誠", genre: "business", isbn: "978-4-00-000006-5", publishedYear: 2024, rating: 3, tags: ["仕事術"], memo: "" },
  { title: "数字で考える会議", author: "渡辺 直子", genre: "business", isbn: "978-4-00-000007-2", publishedYear: 2021, rating: 2, tags: ["仕事術", "会議"], memo: "" },
  { title: "はじめてのパン作り", author: "中村 さくら", genre: "hobby", isbn: "978-4-00-000008-9", publishedYear: 2020, rating: 4, tags: ["料理"], memo: "" },
  { title: "週末キャンプ入門", author: "小林 翔", genre: "hobby", isbn: "978-4-00-000009-6", publishedYear: 2023, rating: 0, tags: ["アウトドア", "入門"], memo: "" },
];

// [本の番号, 借りた人, 貸出日（今日から何日前）, 返却期限（今日から何日後。マイナスは過去）, 返却日（何日前。null は未返却）]
const loans: [number, string, number, number, number | null][] = [
  [0, "佐藤", 20, -6, null], // 期限切れ
  [6, "鈴木", 10, 2, null], // 期限間近
  [2, "高橋", 3, 11, null], // 貸出中
  [8, "田中", 1, 13, null], // 貸出中
  [12, "伊藤", 30, -16, null], // 期限切れ
  [0, "渡辺", 60, -46, 50], // 返却済み
  [5, "中村", 40, -26, 30], // 返却済み
  [6, "小林", 35, -21, 25], // 返却済み
];

/** 今日の日付から、本と貸出の記録を作る */
export const createSampleData = (today: string) => {
  const now = Date.now();
  const sampleBooks: Book[] = books.map((input, index) => {
    // 登録日時を1時間ずつずらし、「登録が新しい順」で並びが分かるようにする
    const createdAt = new Date(now - index * 60 * 60 * 1000).toISOString();
    return { ...input, id: crypto.randomUUID(), createdAt, updatedAt: createdAt };
  });

  const sampleLoans: Loan[] = loans.map(([bookIndex, borrower, loanedDaysAgo, dueIn, returnedDaysAgo]) => ({
    id: crypto.randomUUID(),
    bookId: sampleBooks[bookIndex].id,
    borrower,
    loanedAt: addDays(today, -loanedDaysAgo),
    dueDate: addDays(today, dueIn),
    returnedAt: returnedDaysAgo === null ? "" : addDays(today, -returnedDaysAgo),
  }));

  return { books: sampleBooks, loans: sampleLoans };
};
