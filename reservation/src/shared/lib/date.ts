/**
 * 日付の文字列（"YYYY-MM-DD"）を扱う関数
 *
 * <input type="date"> の値は "2026-10-03" の形の文字列。
 * Date 型に変えずに文字列のまま保存・比較すると、時差（タイムゾーン）でずれる心配がない。
 * "YYYY-MM-DD" は桁がそろっているので、文字列の大小（<・>）がそのまま日付の前後になる。
 *   "2026-10-03" < "2026-10-10"  → true
 */

/** Date → "YYYY-MM-DD"（その端末の地域の日付） */
export const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth は 0 始まり（1月 = 0）
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 今日の日付 "YYYY-MM-DD"
 *
 * ⚠ new Date().toISOString().slice(0, 10) は UTC の日付になるので、日本時間の 0〜9 時は前日になる。使わない
 */
export const todayString = () => toDateString(new Date());

/** "YYYY-MM-DD" → Date（その日の 0:00、端末の地域の時刻） */
const fromDateString = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * n 日後（マイナスなら n 日前）の日付
 *   addDays("2026-10-31", 1) → "2026-11-01"（月またぎも Date が計算してくれる）
 */
export const addDays = (dateString: string, days: number) => {
  const date = fromDateString(dateString);
  date.setDate(date.getDate() + days);
  return toDateString(date);
};

/** "2026-10-03" → "2026/10/03" */
export const formatDate = (dateString: string) => dateString.replaceAll("-", "/");

const weekdayFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

/** "2026-10-03" → "10月3日(土)" */
export const formatDateWithWeekday = (dateString: string) =>
  weekdayFormatter.format(fromDateString(dateString));
