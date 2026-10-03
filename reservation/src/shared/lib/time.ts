/**
 * 時刻の文字列（"HH:mm"）を扱う関数
 *
 * 時刻の計算（何分後・重なり・何マス目か）は「0時からの分数」に直すと足し算・引き算で済む。
 *   "09:30" → 570（9 × 60 + 30）
 */

/** "09:30" → 570 */
export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/** 570 → "09:30" */
export const minutesToTime = (totalMinutes: number) => {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * start から end まで、step 分ごとの時刻の一覧
 *   createTimeList("09:00", "10:00", 30) → ["09:00", "09:30", "10:00"]
 */
export const createTimeList = (start: string, end: string, step: number) => {
  const times: string[] = [];
  for (let m = timeToMinutes(start); m <= timeToMinutes(end); m += step) {
    times.push(minutesToTime(m));
  }
  return times;
};
