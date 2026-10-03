import { useNavigate, useParams } from "react-router";
import { useReservation, useReservationStore } from "@/entities/reservation";
import {
  ReservationForm,
  toFormInput,
  type ReservationFormValues,
} from "@/features/reservation-form";
import { ButtonLink, Card, Container, EmptyState, PageHeader, Stack, useToast } from "@/shared/ui";

/**
 * 予約の変更ページ（/reservations/:reservationId/edit） ── pages/reservation-edit/ui
 *
 * 新規とほぼ同じ。違いは excludeId を渡すこと（自分自身の時間帯と「重なっている」と判定させない）。
 */
export const ReservationEditPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { reservationId } = useParams<{ reservationId: string }>();
  const reservation = useReservation(reservationId);
  const updateReservation = useReservationStore((state) => state.updateReservation);

  if (!reservation) {
    return (
      <Container size="sm">
        <EmptyState
          title="予約が見つかりません"
          action={<ButtonLink to="/schedule">スケジュールへ</ButtonLink>}
        />
      </Container>
    );
  }

  const handleSubmit = (values: ReservationFormValues) => {
    updateReservation(reservation.id, values);
    toast.show(`「${values.title}」を変更しました`, "success");
    navigate(`/reservations/${reservation.id}`);
  };

  return (
    <Container size="sm">
      <Stack gap={5}>
        <PageHeader title="予約の変更" description={reservation.title} />
        <Card>
          <ReservationForm
            key={reservation.id} // 別の予約に移ったら、フォームを作り直して初期値を入れ替える
            defaultValues={toFormInput(reservation)}
            excludeId={reservation.id}
            submitLabel="変更する"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/reservations/${reservation.id}`)}
          />
        </Card>
      </Stack>
    </Container>
  );
};
