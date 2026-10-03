import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BUSINESS_HOURS, SLOT_MINUTES, useReservationStore } from "@/entities/reservation";
import { roomOptions } from "@/entities/room";
import { createTimeList, todayString } from "@/shared/lib";
import { Button, SelectField, Stack, TextAreaField, TextField } from "@/shared/ui";
import {
  createReservationSchema,
  type ReservationFormInput,
  type ReservationFormValues,
} from "../model/schema";
import styles from "./ReservationForm.module.css";

/**
 * 予約の登録・編集フォーム ── features/reservation-form/ui
 *
 *   <ReservationForm
 *     defaultValues={toFormInput(reservation)}
 *     excludeId={reservation.id}   // 編集のときだけ（自分自身との重なりを無視する）
 *     submitLabel="更新"
 *     onSubmit={(values) => updateReservation(reservation.id, values)}
 *     onCancel={() => navigate(-1)}
 *   />
 */

// 30分刻みの時刻。開始は 09:00〜20:30、終了は 09:30〜21:00
const allTimes = createTimeList(BUSINESS_HOURS.start, BUSINESS_HOURS.end, SLOT_MINUTES);
const toOptions = (times: string[]) => times.map((time) => ({ value: time, label: time }));
const startTimeOptions = toOptions(allTimes.slice(0, -1)); // 最後（21:00）を除く
const endTimeOptions = toOptions(allTimes.slice(1)); // 最初（09:00）を除く

type ReservationFormProps = {
  defaultValues: ReservationFormInput;
  excludeId?: string;
  submitLabel: string;
  onSubmit: (values: ReservationFormValues) => void;
  onCancel: () => void;
};

export const ReservationForm = ({
  defaultValues,
  excludeId,
  submitLabel,
  onSubmit,
  onCancel,
}: ReservationFormProps) => {
  // 重なりのチェックに、保存済みの予約を使う
  const reservations = useReservationStore((state) => state.reservations);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationFormInput, unknown, ReservationFormValues>({
    // 描画のたびに最新の予約からスキーマを作り直す（React Hook Form は毎回の resolver を使う）
    resolver: zodResolver(
      createReservationSchema({ reservations, excludeId, today: todayString() }),
    ),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={4}>
        <SelectField
          label="会議室"
          options={roomOptions}
          {...register("roomId")}
          error={errors.roomId?.message}
        />
        <TextField
          label="日付"
          type="date"
          min={todayString()} // 日付選択で過去の日を選べないようにする（チェックは zod でも行う）
          {...register("date")}
          error={errors.date?.message}
        />

        {/* 開始・終了を横に並べる */}
        <div className={styles.times}>
          <SelectField
            label="開始"
            options={startTimeOptions}
            placeholder="--:--"
            {...register("startTime")}
            error={errors.startTime?.message}
          />
          <span className={styles.tilde} aria-hidden="true">
            〜
          </span>
          <SelectField
            label="終了"
            options={endTimeOptions}
            placeholder="--:--"
            {...register("endTime")}
            error={errors.endTime?.message}
          />
        </div>

        <TextField
          label="会議名"
          placeholder="例：週次定例"
          {...register("title")}
          error={errors.title?.message}
        />
        <TextField
          label="予約者名"
          autoComplete="name"
          {...register("reserverName")}
          error={errors.reserverName?.message}
        />
        <TextField
          label="人数"
          type="number"
          inputMode="numeric"
          min={1}
          {...register("attendees", { valueAsNumber: true })}
          error={errors.attendees?.message}
        />
        <TextAreaField
          label="メモ"
          hint="任意"
          rows={2}
          {...register("note")}
          error={errors.note?.message}
        />

        <Stack direction="row" gap={2} justify="end">
          <Button variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </Stack>
      </Stack>
    </form>
  );
};
