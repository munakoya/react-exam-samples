import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  categoryOptionsOf,
  transactionTypeOptions,
  transactionTypes,
  useTransactionStore,
  type Transaction,
} from "@/entities/transaction";
import { FormTextField, notify } from "@/shared/ui";
import {
  transactionFormSchema,
  toFormInput,
  type TransactionFormInput,
  type TransactionFormValues,
} from "../model/schema";

/**
 * 収支の記録の追加・編集ダイアログ ── features/transaction-form/ui
 *
 *   transaction を渡さない → 追加 / 渡す → 編集
 *
 * ポイント：「種類（支出・収入）」によって「カテゴリ」の選択肢が変わる。
 *   useWatch で選んでいる種類を読み、選択肢を作り直す。種類を変えたら、カテゴリを空に戻す（setValue）。
 *
 * MUI の Dialog は閉じると中身を消すので、開くたびにフォームが初期値から始まる（reset() は要らない）。
 */

type TransactionFormDialogProps = {
  open: boolean;
  transaction?: Transaction;
  /** 新規のときの日付の初期値（表示している月に合わせる） */
  defaultDate: string;
  onClose: () => void;
};

export const TransactionFormDialog = ({ open, transaction, defaultDate, onClose }: TransactionFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <TransactionForm transaction={transaction} defaultDate={defaultDate} onDone={onClose} />
    </Dialog>
  );
};

type TransactionFormProps = {
  transaction?: Transaction;
  defaultDate: string;
  onDone: () => void;
};

const TransactionForm = ({ transaction, defaultDate, onDone }: TransactionFormProps) => {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);

  const { control, handleSubmit, setValue } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: toFormInput(transaction, defaultDate),
  });

  // 入力中の「種類」を読む。値が変わるたびにこの部品が再描画され、カテゴリの選択肢が作り直される
  const type = useWatch({ control, name: "type" });
  const categoryOptions = categoryOptionsOf(type);

  const onSubmit = (values: TransactionFormValues) => {
    if (transaction) {
      updateTransaction(transaction.id, values);
      notify("記録を更新しました");
    } else {
      addTransaction(values);
      notify("記録しました");
    }
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>{transaction ? "記録を編集" : "収支を記録"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {/* 種類：ToggleButtonGroup を Controller でつなぐ。onChange の第2引数に値が届く */}
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                fullWidth
                color={field.value === "income" ? "success" : "error"}
                value={field.value}
                onChange={(_event, value: string | null) => {
                  const next = transactionTypes.find((t) => t === value);
                  if (!next) return; // 選択中をもう一度押すと null が届く。無視する
                  field.onChange(next);
                  // 種類が変わったら、前の種類のカテゴリを消す（ここではまだエラーを出さない。送信のときにチェックする）
                  setValue("category", "");
                }}
                aria-label="種類"
              >
                {transactionTypeOptions.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />

          <FormTextField
            control={control}
            name="date"
            label="日付"
            type="date"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <FormTextField control={control} name="category" label="カテゴリ" select required>
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </FormTextField>

          <FormTextField
            control={control}
            name="amount"
            label="金額"
            required
            autoFocus
            slotProps={{
              htmlInput: { inputMode: "numeric" }, // スマホで数字のキーボードを出す
              input: { endAdornment: <InputAdornment position="end">円</InputAdornment> },
            }}
          />

          <FormTextField control={control} name="memo" label="メモ" helperText="任意・50文字以内" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDone}>キャンセル</Button>
        <Button type="submit" variant="contained">
          {transaction ? "更新" : "記録"}
        </Button>
      </DialogActions>
    </form>
  );
};
