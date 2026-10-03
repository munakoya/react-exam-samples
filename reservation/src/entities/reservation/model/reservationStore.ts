import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { reservationSchema, type Reservation, type ReservationInput } from "./reservation";

/**
 * 予約の store（persist で localStorage に保存） ── entities/reservation/model
 *
 * スケジュール表・予約一覧・予約フォーム（重なりチェック）と、いろいろな場所で同じ予約を使う。
 */

type ReservationStore = {
  reservations: Reservation[];
  addReservation: (input: ReservationInput) => Reservation;
  updateReservation: (id: string, input: ReservationInput) => void;
  cancelReservation: (id: string) => void;
};

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set) => ({
      reservations: [],

      addReservation: (input) => {
        const now = new Date().toISOString();
        const reservation: Reservation = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ reservations: [...state.reservations, reservation] }));
        return reservation;
      },

      updateReservation: (id, input) =>
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, ...input, updatedAt: new Date().toISOString() } : r,
          ),
        })),

      cancelReservation: (id) =>
        set((state) => ({ reservations: state.reservations.filter((r) => r.id !== id) })),
    }),
    {
      name: storageKey("reservations"),
      partialize: (state) => ({ reservations: state.reservations }),
      merge: mergeWithSchema(z.object({ reservations: z.array(reservationSchema) })),
    },
  ),
);

/** id から予約を1件取り出す */
export const useReservation = (id: string | undefined) =>
  useReservationStore((state) => state.reservations.find((r) => r.id === id));
