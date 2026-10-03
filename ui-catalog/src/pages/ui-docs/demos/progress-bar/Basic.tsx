import { ProgressBar, Stack } from "@/shared/ui";

const used = 38000;
const budget = 40000;

// value / max の割合でバーを伸ばす。max を超えても 100% で止まる。
// valueText を省略すると「60%」のようにパーセントを出す
export default function ProgressBarBasic() {
  return (
    <Stack gap={3}>
      <ProgressBar label="受講の進み具合" value={6} max={10} valueText="6 / 10 回" />
      <ProgressBar
        label="食費の予算"
        value={used}
        max={budget}
        // 超えたら赤、9割を超えたら橙
        tone={used > budget ? "danger" : used / budget >= 0.9 ? "warning" : "primary"}
      />
      <ProgressBar label="課題の提出" value={10} max={10} tone="success" valueText="完了" />
    </Stack>
  );
}
