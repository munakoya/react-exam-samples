import { useState } from "react";
import { useReservationStore, type Reservation } from "@/entities/reservation";
import { Button, ConfirmDialog, useToast } from "@/shared/ui";

/**
 * 予約の取り消しボタン ＋ 確認ダイアログ ── features/cancel-reservation/ui
 *
 *   <CancelReservationButton reservation={reservation} onCanceled={() => navigate("/schedule")} />
 */

type Props = {
  reservation: Reservation;
  onCanceled?: () => void;
};

export const CancelReservationButton = ({ reservation, onCanceled }: Props) => {
  const [open, setOpen] = useState(false);
  const cancelReservation = useReservationStore((state) => state.cancelReservation);
  const toast = useToast();

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        予約を取り消す
      </Button>
      <ConfirmDialog
        open={open}
        title="予約を取り消しますか？"
        message={`「${reservation.title}」の予約を取り消します。`}
        confirmLabel="取り消す"
        onConfirm={() => {
          setOpen(false);
          onCanceled?.(); // 先にページを移動してから消す（「見つかりません」を一瞬出さないため）
          cancelReservation(reservation.id);
          toast.show(`「${reservation.title}」の予約を取り消しました`, "success");
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
