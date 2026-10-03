import { useSearchParams } from "react-router";
import { compareByStart, useReservationStore } from "@/entities/reservation";
import { addDays, formatDateWithWeekday, todayString } from "@/shared/lib";
import { Alert, Button, ButtonLink, Container, PageHeader, Stack, TextField } from "@/shared/ui";
import { DaySchedule } from "@/widgets/day-schedule";
import styles from "./SchedulePage.module.css";

/**
 * スケジュールページ（/schedule?date=2026-10-03） ── pages/schedule/ui
 *
 * 表示する日付を URL に持つ。日付を変えると URL が変わるので、
 *   - ブラウザの「戻る」で前に見ていた日に戻れる
 *   - 予約の詳細から戻ったときも、同じ日のスケジュールが開く
 */

const isDateString = (value: string | null): value is string =>
  value !== null && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const SchedulePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayString();
  const dateParam = searchParams.get("date");
  const date = isDateString(dateParam) ? dateParam : today; // ?date がない・形が違うなら今日

  // replace を付けない：日付を変えるたびに履歴が増え、「戻る」で前の日に戻れる
  const changeDate = (next: string) => setSearchParams(next === today ? {} : { date: next });

  const reservations = useReservationStore((state) => state.reservations);
  const dayReservations = reservations.filter((r) => r.date === date).toSorted(compareByStart);
  const isPast = date < today;

  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader
          title="スケジュール"
          description="空いている枠をクリックすると、その時間で予約できます"
          action={<ButtonLink to={`/reservations/new?date=${date}`}>＋ 新規予約</ButtonLink>}
        />

        {/* ----- 日付の切り替え ----- */}
        <Stack direction="row" gap={2} align="end" wrap>
          <Button variant="secondary" onClick={() => changeDate(addDays(date, -1))}>
            ← 前の日
          </Button>
          <Button variant="secondary" onClick={() => changeDate(today)} disabled={date === today}>
            今日
          </Button>
          <Button variant="secondary" onClick={() => changeDate(addDays(date, 1))}>
            次の日 →
          </Button>
          <div className={styles.datePicker}>
            <TextField
              label="日付を選ぶ"
              type="date"
              value={date}
              // 日付選択の × で空にされたときは、何もしない
              onChange={(event) => event.target.value && changeDate(event.target.value)}
            />
          </div>
        </Stack>

        <h2 className={styles.dateTitle}>
          {formatDateWithWeekday(date)}
          <span className={styles.count}>予約 {dayReservations.length}件</span>
        </h2>

        {isPast && <Alert>過去の日付です。予約の追加はできません。</Alert>}

        <DaySchedule date={date} reservations={dayReservations} canReserve={!isPast} />
      </Stack>
    </Container>
  );
};
