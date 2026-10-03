import { useNavigate, useParams } from "react-router";
import { formatTimeRange, useReservation } from "@/entities/reservation";
import { findRoom } from "@/entities/room";
import { CancelReservationButton } from "@/features/cancel-reservation";
import { formatDateTime, formatDateWithWeekday, todayString } from "@/shared/lib";
import {
  Badge,
  Breadcrumb,
  ButtonLink,
  Card,
  Container,
  DescriptionList,
  EmptyState,
  PageHeader,
  Stack,
} from "@/shared/ui";

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
          action={<ButtonLink to="/schedule">スケジュールへ</ButtonLink>}
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
        <Breadcrumb
          items={[
            { label: formatDateWithWeekday(reservation.date), to: scheduleUrl },
            { label: reservation.title },
          ]}
        />

        <PageHeader
          title={reservation.title}
          description={`${formatDateWithWeekday(reservation.date)} ${formatTimeRange(reservation)}`}
          action={
            // 過去の予約は変更できないようにする
            isPast ? (
              <Badge>終了</Badge>
            ) : (
              <Stack direction="row" gap={2}>
                <ButtonLink to={`/reservations/${reservation.id}/edit`} variant="secondary">
                  変更
                </ButtonLink>
                <CancelReservationButton
                  reservation={reservation}
                  onCanceled={() => navigate(scheduleUrl, { replace: true })}
                />
              </Stack>
            )
          }
        />

        <Card>
          <DescriptionList
            items={[
              {
                term: "会議室",
                description: room
                  ? `${room.name}（定員${room.capacity}名・${room.equipment}）`
                  : "（削除された会議室）",
              },
              { term: "予約者", description: reservation.reserverName },
              { term: "人数", description: `${reservation.attendees}名` },
              { term: "メモ", description: reservation.note || "—", multiline: true },
              { term: "登録日時", description: formatDateTime(reservation.createdAt) },
            ]}
          />
        </Card>
      </Stack>
    </Container>
  );
};
