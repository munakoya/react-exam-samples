import { z } from "zod";
import { formatTimeRange, isOverlapping, type Reservation } from "@/entities/reservation";
import { findRoom } from "@/entities/room";
import { timeToMinutes } from "@/shared/lib";

/**
 * 予約フォームの入力チェック ── features/reservation-form/model
 *
 * 1つの項目だけでは判断できないチェックが3つある。
 *   ① 終了時刻が開始時刻より後か          … startTime と endTime を見比べる
 *   ② 人数が会議室の定員以内か            … roomId と attendees を見比べる
 *   ③ 同じ会議室・同じ時間に予約がないか   … 入力値と「保存済みの予約」を見比べる
 * ③ は保存済みの予約が要るので、予約の一覧を受け取ってスキーマを作る関数（スキーマの工場）にする。
 *
 *   const schema = createReservationSchema({ reservations, excludeId: reservation?.id, today });
 */

type Options = {
  /** 保存済みの予約（重なりのチェックに使う） */
  reservations: Reservation[];
  /** 編集中の予約の id。自分自身との重なりはチェックしない */
  excludeId?: string;
  /** 今日の日付（過去の日付をはじく） */
  today: string;
};

export const createReservationSchema = ({ reservations, excludeId, today }: Options) =>
  z
    .object({
      roomId: z.string().min(1, "会議室を選択してください"),
      date: z
        .string()
        .min(1, "日付を入力してください")
        .refine((date) => date >= today, "過去の日付は予約できません"), // "YYYY-MM-DD" は文字列のまま比べられる
      startTime: z.string().min(1, "開始時刻を選択してください"),
      endTime: z.string().min(1, "終了時刻を選択してください"),
      title: z
        .string()
        .trim()
        .min(1, "会議名を入力してください")
        .max(50, "50文字以内で入力してください"),
      reserverName: z
        .string()
        .trim()
        .min(1, "予約者名を入力してください")
        .max(30, "30文字以内で入力してください"),
      attendees: z
        .number({ error: "人数を入力してください" })
        .int("整数で入力してください")
        .min(1, "1名以上で入力してください"),
      note: z.string().trim().max(200, "200文字以内で入力してください"),
    })
    /*
     * superRefine：複数の項目を見比べて、エラーを好きな項目に好きなだけ付けられる。
     * ctx.addIssue の path に書いた項目の errors.○○.message にエラーが入る。
     *
     * ⚠ 各項目のチェック（上の z.object の中）がすべて通ってから動く。
     *   会議名が空欄のままだと、重なりのエラーはまだ出ない。
     */
    .superRefine((values, ctx) => {
      // ① 時刻の前後
      if (timeToMinutes(values.endTime) <= timeToMinutes(values.startTime)) {
        ctx.addIssue({
          code: "custom",
          message: "終了時刻は開始時刻より後にしてください",
          path: ["endTime"],
        });
      }

      // ② 定員
      const room = findRoom(values.roomId);
      if (room && values.attendees > room.capacity) {
        ctx.addIssue({
          code: "custom",
          message: `${room.name}の定員は${room.capacity}名です`,
          path: ["attendees"],
        });
      }

      // ③ 重なり（編集中の予約自身は除く）
      const conflict = reservations.find((r) => r.id !== excludeId && isOverlapping(r, values));
      if (conflict) {
        ctx.addIssue({
          code: "custom",
          message: `${formatTimeRange(conflict)} に「${conflict.title}」の予約があります`,
          path: ["startTime"],
        });
      }
    });

type ReservationSchema = ReturnType<typeof createReservationSchema>;
export type ReservationFormInput = z.input<ReservationSchema>;
export type ReservationFormValues = z.output<ReservationSchema>;
