import { useNavigate, useSearchParams } from "react-router";
import { useReservationStore } from "@/entities/reservation";
import { findRoom } from "@/entities/room";
import {
  ReservationForm,
  toFormInput,
  type ReservationFormValues,
} from "@/features/reservation-form";
import { Card, Container, PageHeader, Stack, useToast } from "@/shared/ui";

/**
 * 新規予約ページ（/reservations/new?date=2026-10-03&roomId=a&start=10:00） ── pages/reservation-new/ui
 *
 * スケジュール表の空き枠から来たときは、URL の値をフォームの初期値に入れておく。
 * URL は手で書き換えられるので、使う前に形を確かめる（おかしな値は使わない）。
 */
export const ReservationNewPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const addReservation = useReservationStore((state) => state.addReservation);
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date") ?? "";
  const start = searchParams.get("start") ?? "";
  const defaultValues = toFormInput(undefined, {
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
    roomId: findRoom(searchParams.get("roomId") ?? undefined)?.id,
    startTime: /^\d{2}:(00|30)$/.test(start) ? start : undefined,
  });

  const handleSubmit = (values: ReservationFormValues) => {
    addReservation(values);
    toast.show(`「${values.title}」を予約しました`, "success");
    navigate(`/schedule?date=${values.date}`); // 予約した日のスケジュールを開く
  };

  return (
    <Container size="sm">
      <Stack gap={5}>
        <PageHeader title="新規予約" />
        <Card>
          <ReservationForm
            defaultValues={defaultValues}
            submitLabel="予約する"
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
          />
        </Card>
      </Stack>
    </Container>
  );
};
