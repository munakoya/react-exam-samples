import { useNavigate, useSearchParams } from "react-router";
import { compareByStart, useReservationStore } from "@/entities/reservation";
import { findRoom, roomOptions } from "@/entities/room";
import { todayString } from "@/shared/lib";
import { Button, Container, PageHeader, SelectField, Stack, Switch } from "@/shared/ui";
import { ReservationTable } from "@/widgets/reservation-table";
import styles from "./ReservationListPage.module.css";

/**
 * 予約一覧ページ（/reservations?room=a&past=1） ── pages/reservation-list/ui
 *
 * 初めは「今日以降の予約」だけを、日時の早い順に表示する。
 */
export const ReservationListPage = () => {
  const navigate = useNavigate();
  const reservations = useReservationStore((state) => state.reservations);

  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = findRoom(searchParams.get("room") ?? undefined)?.id ?? ""; // 存在しない会議室なら「すべて」
  const showPast = searchParams.get("past") === "1";

  /** URL の値を1つだけ変える（他は残す）。value が "" なら消す */
  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const today = todayString();
  const visibleReservations = reservations
    .filter((r) => roomId === "" || r.roomId === roomId)
    .filter((r) => showPast || r.date >= today) // 日付だけで判定（今日の終わった予約も「今日以降」に含める）
    .toSorted(compareByStart);

  return (
    <Container size="lg">
      <Stack gap={5}>
        <PageHeader
          title="予約一覧"
          action={<Button onClick={() => navigate("/reservations/new")}>＋ 新規予約</Button>}
        />

        <Stack direction="row" gap={4} align="end" wrap>
          <div className={styles.room}>
            {/* placeholder の選択肢（value=""）を「すべて」として使う */}
            <SelectField
              label="会議室"
              options={roomOptions}
              placeholder="すべての会議室"
              value={roomId}
              onChange={(event) => updateParam("room", event.target.value)}
            />
          </div>
          <Switch
            label="過去の予約も表示"
            checked={showPast}
            onChange={(event) => updateParam("past", event.target.checked ? "1" : "")}
          />
        </Stack>

        <ReservationTable
          reservations={visibleReservations}
          emptyMessage={showPast ? "予約はありません" : "今日以降の予約はありません"}
        />
      </Stack>
    </Container>
  );
};
