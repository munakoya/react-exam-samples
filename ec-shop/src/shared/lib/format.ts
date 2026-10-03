/**
 * 表示用の整形関数（金額・日時）
 *
 * Intl を使うと、桁区切りや日付の書式をブラウザが整えてくれる。
 * フォーマッタは関数の外で1回だけ作り、使い回す。
 */

const priceFormatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

/** 1200 → "￥1,200" */
export const formatPrice = (price: number) => priceFormatter.format(price);

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** "2026-10-01T09:05:00.000Z" → "2026/10/01 18:05"（日本時間） */
export const formatDateTime = (isoString: string) => dateTimeFormatter.format(new Date(isoString));
