/**
 * 日付の文字列（"YYYY-MM-DD"）を扱う関数 ── shared/lib
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

/**
 * "YYYY-MM-DD" を Date（その日の 0 時）にする
 *
 * ⚠ new Date("2026-10-03") は UTC の 0 時として読まれる。年・月・日に分けて渡すと地域の 0 時になる
 */
const parseDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** "2026-10-03" の days 日後（マイナスなら前）の "YYYY-MM-DD" */
export const addDays = (dateString: string, days: number) => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days); // 月末を超えても、Date が翌月に繰り上げてくれる
  return toDateString(date);
};

/**
 * from から to まで何日あるか（to の方が後ならプラス）
 *
 *   diffDays("2026-10-03", "2026-10-10") → 7
 *   diffDays("2026-10-10", "2026-10-03") → -7
 */
export const diffDays = (from: string, to: string) => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  // Math.round：夏時間のある地域で 23・25 時間の日があってもずれないように
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / MS_PER_DAY);
};

/** "2026-10-03" → "2026/10/03" */
export const formatDate = (dateString: string) => dateString.replaceAll("-", "/");

// ---------- 月（"YYYY-MM"） ----------
// <input type="month"> の値も "2026-10" の形の文字列。日付と同じく、文字列のまま大小を比べられる

/** 今月 "YYYY-MM" */
export const thisMonthString = () => todayString().slice(0, 7);

/** "2026-10" の n か月後（マイナスなら前）。12 月の次は翌年の 1 月になる */
export const addMonths = (month: string, months: number) => {
  const [year, monthNumber] = month.split("-").map(Number);
  // 月は 0 始まりで渡す。13 月や -1 月を渡しても、Date が年をまたいで直してくれる
  const date = new Date(year, monthNumber - 1 + months, 1);
  return toDateString(date).slice(0, 7);
};

/** "2026-10" → "2026年10月" */
export const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return `${year}年${monthNumber}月`;
};
