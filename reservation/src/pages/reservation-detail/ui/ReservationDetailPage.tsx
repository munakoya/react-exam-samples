import { Link, useNavigate, useParams } from "react-router";
import { formatTimeRange, useReservation } from "@/entities/reservation";
import { findRoom } from "@/entities/room";
import { CancelReservationButton } from "@/features/cancel-reservation";
import { formatDateTime, formatDateWithWeekday, todayString } from "@/shared/lib";
import { Badge, Button, Card, Container, EmptyState, PageHeader, Stack } from "@/shared/ui";
import styles from "./ReservationDetailPage.module.css";

/**
 * 予約の詳細ページ（/reservations/:reservationId） ── pages/reservation-detail/ui
 */
export const ReservationDetailPage = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();
  const reservation = useReservation(reservationId);

  if (!reservation) {
    return (
      <Container size="sm">
        <EmptyState
          title="予約が見つかりません"
          description="取り消されたか、URL が間違っている可能性があります。"
          action={<Button onClick={() => navigate("/schedule")}>スケジュールへ</Button>}
        />
      </Container>
    );
  }

  const room = findRoom(reservation.roomId);
  const isPast = reservation.date < todayString();
  const scheduleUrl = `/schedule?date=${reservation.date}`;

  return (
    <Container size="sm">
      <Stack gap={5}>
        <Link to={scheduleUrl} className={styles.back}>
          ← この日のスケジュール
        </Link>

        <PageHeader
          title={reservation.title}
          description={`${formatDateWithWeekday(reservation.date)} ${formatTimeRange(reservation)}`}
          action={
            // 過去の予約は変更できないようにする
            isPast ? (
              <Badge>終了</Badge>
            ) : (
              <Stack direction="row" gap={2}>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                >
                  変更
                </Button>
                <CancelReservationButton
                  reservation={reservation}
                  onCanceled={() => navigate(scheduleUrl, { replace: true })}
                />
              </Stack>
            )
          }
        />

        <Card>
          <dl className={styles.list}>
            <dt>会議室</dt>
            <dd>
              {room
                ? `${room.name}（定員${room.capacity}名・${room.equipment}）`
                : "（削除された会議室）"}
            </dd>
            <dt>予約者</dt>
            <dd>{reservation.reserverName}</dd>
            <dt>人数</dt>
            <dd>{reservation.attendees}名</dd>
            <dt>メモ</dt>
            <dd data-multiline>{reservation.note || "—"}</dd>
            <dt>登録日時</dt>
            <dd>{formatDateTime(reservation.createdAt)}</dd>
          </dl>
        </Card>
      </Stack>
    </Container>
  );
};
