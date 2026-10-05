import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useBudgetStore } from "@/entities/budget";
import { categoryLabels, sumByCategory, summarize, type Transaction } from "@/entities/transaction";
import { SetBudgetButton } from "@/features/set-budget";
import { formatYen } from "@/shared/lib";
import { StatCard } from "@/shared/ui";

/**
 * 月のまとめ（収入・支出・収支、予算の使い方、カテゴリ別の支出） ── widgets/monthly-summary/ui
 *
 *   <MonthlySummary transactions={monthTransactions} />
 *
 * 数字はすべて、受け取った記録から計算する（合計を store に保存しない）。
 * 予算（entities/budget）と予算の設定ボタン（features/set-budget）も組み合わせるので widgets に置く。
 */
export const MonthlySummary = ({ transactions }: { transactions: Transaction[] }) => {
  const monthlyBudget = useBudgetStore((state) => state.monthlyBudget);
  const { income, expense, balance } = summarize(transactions);
  const byCategory = sumByCategory(transactions);

  // 予算を何 % 使ったか。バーは 100 までしか塗れないので Math.min で止める
  const budgetRate = monthlyBudget === 0 ? 0 : Math.round((expense / monthlyBudget) * 100);
  const overBudget = monthlyBudget > 0 && expense > monthlyBudget;

  return (
    <Stack spacing={2}>
      {/* ----- 収入・支出・収支：スマホは縦に、600px 以上は 3 列 ----- */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="収入" value={formatYen(income)} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="支出" value={formatYen(expense)} color="error" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="収支（収入 − 支出）"
            value={formatYen(balance)}
            color={balance < 0 ? "error" : "primary"}
            caption={balance < 0 ? "赤字" : "黒字"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* ----- 予算 ----- */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
                  予算
                </Typography>
                <SetBudgetButton />
              </Stack>
              {monthlyBudget === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  予算を決めると、使った割合が表示されます。
                </Typography>
              ) : (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {formatYen(expense)} / {formatYen(monthlyBudget)}（{budgetRate}%）
                  </Typography>
                  {/* 予算を超えたら赤、8 割を超えたら注意の色 */}
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(budgetRate, 100)}
                    color={overBudget ? "error" : budgetRate >= 80 ? "warning" : "primary"}
                    aria-label="予算の使った割合"
                    sx={{ height: 10, borderRadius: 1 }}
                  />
                  <Typography variant="body2" color={overBudget ? "error" : "text.secondary"} sx={{ mt: 1 }}>
                    {overBudget
                      ? `予算を ${formatYen(expense - monthlyBudget)} 超えています`
                      : `残り ${formatYen(monthlyBudget - expense)}`}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ----- カテゴリ別の支出 ----- */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                カテゴリ別の支出
              </Typography>
              {byCategory.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  この月の支出はまだありません。
                </Typography>
              ) : (
                <Stack component="ul" spacing={1.5} sx={{ m: 0, p: 0, listStyle: "none" }}>
                  {byCategory.map(({ category, amount }) => {
                    const rate = Math.round((amount / expense) * 100); // 支出の合計に対する割合
                    return (
                      <Box component="li" key={category}>
                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                          <Typography variant="body2">{categoryLabels[category]}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatYen(amount)}（{rate}%）
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={rate}
                          color="error"
                          aria-label={`${categoryLabels[category]}の割合`}
                          sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
