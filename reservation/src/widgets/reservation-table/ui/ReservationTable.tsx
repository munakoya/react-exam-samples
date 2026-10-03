import { Link } from "react-router";
import { formatTimeRange, type Reservation } from "@/entities/reservation";
import { findRoom } from "@/entities/room";
import { Table, type TableColumn } from "@/shared/ui";
import { formatDateWithWeekday } from "@/shared/lib";

/**
 * 予約の一覧表 ── widgets/reservation-table/ui
 *
 * 予約（entities/reservation）は会議室の id しか持たないので、
 * 表示するときに会議室（entities/room）から名前を探す。2つの entities を組み合わせるので widgets に置く。
 */

const columns: TableColumn<Reservation>[] = [
  { key: "date", header: "日付", render: (r) => formatDateWithWeekday(r.date) },
  { key: "time", header: "時間", render: (r) => formatTimeRange(r) },
  {
    key: "room",
    header: "会議室",
    render: (r) => findRoom(r.roomId)?.name ?? "（削除された会議室）",
  },
  {
    key: "title",
    header: "会議名",
    rowHeader: true,
    render: (r) => <Link to={`/reservations/${r.id}`}>{r.title}</Link>,
  },
  { key: "reserverName", header: "予約者", render: (r) => r.reserverName },
  { key: "attendees", header: "人数", align: "right", render: (r) => `${r.attendees}名` },
];

type ReservationTableProps = {
  reservations: Reservation[];
  emptyMessage?: string;
};

export const ReservationTable = ({ reservations, emptyMessage }: ReservationTableProps) => {
  return (
    <Table
      caption="予約一覧"
      columns={columns}
      rows={reservations}
      getRowKey={(r) => r.id}
      emptyMessage={emptyMessage}
    />
  );
};
