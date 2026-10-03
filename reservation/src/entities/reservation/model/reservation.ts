import { z } from "zod";
import { timeToMinutes } from "@/shared/lib";

/**
 * 予約の型と、予約に関するルール ── entities/reservation/model
 *
 * 会議室とは roomId（会議室の id）でつなぐ。
 * 日付は "YYYY-MM-DD"、時刻は "HH:mm" の文字列で持つ（<input type="date"> などと同じ形）。
 */

// ---------- 予約できる時間帯 ----------

export const BUSINESS_HOURS = { start: "09:00", end: "21:00" } as const;
/** 何分刻みで予約できるか */
export const SLOT_MINUTES = 30;

// ---------- 予約本体 ----------

export const reservationSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  date: z.string(), // "2026-10-03"
  startTime: z.string(), // "09:00"
  endTime: z.string(), // "10:30"
  title: z.string(),
  reserverName: z.string(),
  attendees: z.number().int().min(1),
  note: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationInput = Omit<Reservation, "id" | "createdAt" | "updatedAt">;

// ---------- ルール（予約の知識なので entities に置く） ----------

/**
 * 2つの予約の時間が重なっているか（同じ会議室・同じ日のときだけ）
 *
 * 時間の重なりは「A の開始 < B の終了」かつ「B の開始 < A の終了」で判定できる。
 *   A 10:00〜11:00 と B 10:30〜12:00 → 重なる
 *   A 10:00〜11:00 と B 11:00〜12:00 → 重ならない（ちょうど終わってから始まる）
 */
export const isOverlapping = (
  a: Pick<Reservation, "roomId" | "date" | "startTime" | "endTime">,
  b: Pick<Reservation, "roomId" | "date" | "startTime" | "endTime">,
) =>
  a.roomId === b.roomId &&
  a.date === b.date &&
  timeToMinutes(a.startTime) < timeToMinutes(b.endTime) &&
  timeToMinutes(b.startTime) < timeToMinutes(a.endTime);

/** 予約の時間を「10:00〜11:30」の形で表す */
export const formatTimeRange = (reservation: Pick<Reservation, "startTime" | "endTime">) =>
  `${reservation.startTime}〜${reservation.endTime}`;

/** 開始時刻の早い順に並べる比較関数（日付 → 時刻の順） */
export const compareByStart = (a: Reservation, b: Reservation) =>
  a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
// ||：日付が同じ（0）なら、時刻で比べる
