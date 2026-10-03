import { Grid, Stat } from "@/shared/ui";

const formatPrice = (price: number) => `¥${price.toLocaleString()}`;

const income = 320000;
const expense = 248500;

// 集計の数字は Grid で並べる（1つ 150px 以上で、入るだけ横に並ぶ）
export default function StatBasic() {
  const balance = income - expense;
  return (
    <Grid min={150} gap={3}>
      <Stat label="今月の収入" value={formatPrice(income)} />
      <Stat label="今月の支出" value={formatPrice(expense)} note="先月より +12,000円" />
      <Stat
        label="収支"
        value={formatPrice(balance)}
        tone={balance >= 0 ? "success" : "danger"} // 黒字なら緑、赤字なら赤
      />
    </Grid>
  );
}
