/**
 * 表示用の整形関数（日時） ── shared/lib
 *
 * Intl を使うと、日付の書式をブラウザが整えてくれる。フォーマッタは関数の外で1回だけ作り、使い回す。
 */

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** "2026-10-01T09:05:00.000Z" → "2026/10/01 18:05"（日本時間） */
export const formatDateTime = (isoString: string) => dateTimeFormatter.format(new Date(isoString));
