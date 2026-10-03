import { Navigate, Route, Routes } from "react-router";
import { NotFoundPage } from "@/pages/not-found";
import { ReservationDetailPage } from "@/pages/reservation-detail";
import { ReservationEditPage } from "@/pages/reservation-edit";
import { ReservationListPage } from "@/pages/reservation-list";
import { ReservationNewPage } from "@/pages/reservation-new";
import { SchedulePage } from "@/pages/schedule";
import { RootLayout } from "./layouts/RootLayout";

/**
 * URL とページの対応（ルーティング） ── app
 *
 *   /                                  → /schedule へ移動
 *   /schedule?date=2026-10-03          → 1日のスケジュール表
 *   /reservations?room=a&past=1        → 予約一覧
 *   /reservations/new?date=&roomId=&start= → 新規予約（スケジュール表の枠から値を受け取る）
 *   /reservations/:reservationId       → 予約の詳細
 *   /reservations/:reservationId/edit  → 予約の変更
 */
export const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/schedule" replace />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/reservations" element={<ReservationListPage />} />
        <Route path="/reservations/new" element={<ReservationNewPage />} />
        <Route path="/reservations/:reservationId" element={<ReservationDetailPage />} />
        <Route path="/reservations/:reservationId/edit" element={<ReservationEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
