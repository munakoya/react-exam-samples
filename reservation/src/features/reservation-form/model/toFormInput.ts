import type { Reservation } from "@/entities/reservation";
import { minutesToTime, timeToMinutes } from "@/shared/lib";
import type { ReservationFormInput } from "./schema";

/**
 * フォームの初期値を作る ── features/reservation-form/model
 *
 *   toFormInput(reservation)                         … 編集：今の値
 *   toFormInput(undefined, { date, roomId, startTime }) … 新規：スケジュール表で押した枠の値を入れておく
 *
 * 新規で開始時刻だけ分かっているときは、終了時刻を1時間後にしておく。
 */
export const toFormInput = (
  reservation?: Reservation,
  prefill: { date?: string; roomId?: string; startTime?: string } = {},
): ReservationFormInput => {
  if (reservation) {
    return {
      roomId: reservation.roomId,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      title: reservation.title,
      reserverName: reservation.reserverName,
      attendees: reservation.attendees,
      note: reservation.note,
    };
  }

  const startTime = prefill.startTime ?? "";
  return {
    roomId: prefill.roomId ?? "",
    date: prefill.date ?? "",
    startTime,
    endTime: startTime ? minutesToTime(Math.min(timeToMinutes(startTime) + 60, 21 * 60)) : "",
    title: "",
    reserverName: "",
    attendees: 1,
    note: "",
  };
};
