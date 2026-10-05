import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBudgetStore } from "@/entities/budget";
import { FormTextField, notify } from "@/shared/ui";

/**
 * 「予算を設定」ボタン ＋ 入力ダイアログ ── features/set-budget/ui
 *
 * 入力が1つだけの小さなフォームでも、チェックとエラー表示は React Hook Form ＋ zod でそろえる。
 * 0 を入れると「予算なし」に戻る。
 */

const budgetSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+$/, "0以上の整数で入力してください（0 で予算なし）")
    .transform(Number)
    .pipe(z.number().max(99_999_999, "99,999,999円以下で入力してください")),
});

type BudgetFormInput = z.input<typeof budgetSchema>;
type BudgetFormValues = z.output<typeof budgetSchema>;

export const SetBudgetButton = () => {
  const [open, setOpen] = useState(false);
  const monthlyBudget = useBudgetStore((state) => state.monthlyBudget);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        {monthlyBudget === 0 ? "予算を設定" : "予算を変更"}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <BudgetForm initialAmount={monthlyBudget} onDone={() => setOpen(false)} />
      </Dialog>
    </>
  );
};

// ダイアログの中身。開くたびに作り直されるので、今の予算が初期値になる
const BudgetForm = ({ initialAmount, onDone }: { initialAmount: number; onDone: () => void }) => {
  const setMonthlyBudget = useBudgetStore((state) => state.setMonthlyBudget);
  const { control, handleSubmit } = useForm<BudgetFormInput, unknown, BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { amount: String(initialAmount) },
  });

  const onSubmit = (values: BudgetFormValues) => {
    setMonthlyBudget(values.amount);
    notify(values.amount === 0 ? "予算をなしにしました" : "予算を設定しました");
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>月の予算（支出の上限）</DialogTitle>
      <DialogContent>
        <FormTextField
          control={control}
          name="amount"
          label="予算"
          autoFocus
          helperText="毎月同じ金額を使う。0 で予算なし"
          sx={{ mt: 1 }}
          slotProps={{
            htmlInput: { inputMode: "numeric" },
            input: { endAdornment: <InputAdornment position="end">円</InputAdornment> },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDone}>キャンセル</Button>
        <Button type="submit" variant="contained">
          保存
        </Button>
      </DialogActions>
    </form>
  );
};
