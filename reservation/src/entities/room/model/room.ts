/**
 * 会議室の型とデータ ── entities/room/model
 *
 * 会議室は画面から増やしたり変えたりしないので、定数の配列（マスタデータ）として持つ。
 */

export type Room = {
  id: string;
  name: string;
  capacity: number; // 定員（人）
  equipment: string; // 設備
};

export const rooms: Room[] = [
  { id: "a", name: "会議室A", capacity: 4, equipment: "モニター" },
  { id: "b", name: "会議室B", capacity: 8, equipment: "モニター・ホワイトボード" },
  { id: "c", name: "大会議室", capacity: 20, equipment: "プロジェクター・マイク" },
];

export const roomOptions = rooms.map((room) => ({
  value: room.id,
  label: `${room.name}（${room.capacity}名）`,
}));

export const findRoom = (id: string | undefined) => rooms.find((room) => room.id === id);
