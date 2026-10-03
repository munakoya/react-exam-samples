import type { CSSProperties } from "react";
import { Link } from "react-router";
import {
  BUSINESS_HOURS,
  formatTimeRange,
  SLOT_MINUTES,
  type Reservation,
} from "@/entities/reservation";
import { rooms } from "@/entities/room";
import { createTimeList, timeToMinutes } from "@/shared/lib";
import styles from "./DaySchedule.module.css";

/**
 * 1日分のスケジュール表（会議室ごとの列 × 30分ごとの行） ── widgets/day-schedule/ui
 *
 *          会議室A   会議室B   大会議室
 *   09:00  ┌────┐
 *   09:30  │定例  │  （空き）
 *   10:00  └────┘
 *
 * CSS Grid の「線の番号」で、予約のブロックを置く場所を決める。
 *   列：1列目が時刻、2列目から会議室     → gridColumn = 会議室の番号 + 2
 *   行：1行目が見出し、2行目から 09:00〜 → gridRow = "開始の行 / 終了の行"
 * 空きの枠をクリックすると、その会議室・時刻を入れた状態で新規予約ページを開く。
 */

// 枠の開始時刻：09:00, 09:30, … 20:30（最後の 21:00 は終わりの線なので枠にしない）
const slots = createTimeList(BUSINESS_HOURS.start, BUSINESS_HOURS.end, SLOT_MINUTES).slice(0, -1);

// 時刻 → Grid の行の線の番号（1行目は見出しなので +2）
const rowLine = (time: string) =>
  (timeToMinutes(time) - timeToMinutes(BUSINESS_HOURS.start)) / SLOT_MINUTES + 2;

type DayScheduleProps = {
  date: string;
  /** その日の予約 */
  reservations: Reservation[];
  /** false なら空きの枠から予約できない（過去の日付） */
  canReserve: boolean;
};

export const DaySchedule = ({ date, reservations, canReserve }: DayScheduleProps) => {
  return (
    // 会議室が多い・画面が狭いときは、表だけを横スクロールさせる
    <div className={styles.scroll}>
      <div
        className={styles.grid}
        // 列と行の数を CSS 変数で渡し、CSS 側の repeat() で使う
        style={{ "--room-count": rooms.length, "--slot-count": slots.length } as CSSProperties}
      >
        {/* ----- 1行目：会議室の見出し ----- */}
        <div className={styles.corner} />
        {rooms.map((room, index) => (
          <div key={room.id} className={styles.roomHeader} style={{ gridColumn: index + 2 }}>
            {room.name}
            <span className={styles.capacity}>{room.capacity}名</span>
          </div>
        ))}

        {/* ----- 1列目：時刻（正時だけ表示） ----- */}
        {slots.map((time) => (
          <div key={time} className={styles.timeLabel} style={{ gridRow: rowLine(time) }}>
            {time.endsWith(":00") ? time : ""}
          </div>
        ))}

        {/* ----- 空きの枠（会議室 × 時刻）。予約のブロックはこの上に重ねる ----- */}
        {rooms.map((room, index) =>
          slots.map((time) => {
            const position = { gridColumn: index + 2, gridRow: rowLine(time) };
            const isHour = time.endsWith(":00");
            return canReserve ? (
              <Link
                key={`${room.id}-${time}`}
                to={`/reservations/new?date=${date}&roomId=${room.id}&start=${time}`}
                className={styles.slot}
                data-hour={isHour}
                style={position}
                aria-label={`${room.name} ${time}から予約する`}
              />
            ) : (
              <div
                key={`${room.id}-${time}`}
                className={styles.slot}
                data-hour={isHour}
                style={position}
              />
            );
          }),
        )}

        {/* ----- 予約のブロック ----- */}
        {reservations.map((reservation) => {
          const roomIndex = rooms.findIndex((room) => room.id === reservation.roomId);
          return (
            <Link
              key={reservation.id}
              to={`/reservations/${reservation.id}`}
              className={styles.block}
              style={{
                gridColumn: roomIndex + 2,
                // "4 / 7" のように「始まりの線 / 終わりの線」で、何行ぶん縦に広げるかを決める
                gridRow: `${rowLine(reservation.startTime)} / ${rowLine(reservation.endTime)}`,
              }}
            >
              <span className={styles.blockTime}>{formatTimeRange(reservation)}</span>
              <span className={styles.blockTitle}>{reservation.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
