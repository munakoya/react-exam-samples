import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import type { Book } from "@/entities/book";
import { useLoanStore } from "@/entities/loan";
import { addDays, todayString } from "@/shared/lib";
import { FormTextField, notify } from "@/shared/ui";
import { createLendSchema, MAX_LOAN_DAYS, type LendFormValues } from "../model/schema";

/**
 * 貸出フォーム（ダイアログの中身） ── features/lend-book/ui
 *
 * <form> で DialogTitle・DialogContent・DialogActions を包み、送信ボタンを type="submit" にする。
 * MUI の Dialog は、閉じると中身を消す（次に開いたときに作り直す）。
 * なので、開くたびに初期値・エラーなしの状態から始まり、reset() を呼ばなくてよい。
 */

type LendBookFormProps = {
  book: Book;
  /** 送信・キャンセルの後に呼ばれる（ダイアログを閉じる） */
  onDone: () => void;
};

// 返却期限をワンタッチで入れるボタン
const quickPeriods = [
  { label: "1週間", days: 7 },
  { label: "2週間", days: 14 },
  { label: "4週間", days: 28 },
];

export const LendBookForm = ({ book, onDone }: LendBookFormProps) => {
  const addLoan = useLoanStore((state) => state.addLoan);
  const today = todayString();

  const { control, handleSubmit, setValue } = useForm<LendFormValues>({
    // 今日の日付を渡してスキーマを作る（返却期限の範囲チェックに使う）
    resolver: zodResolver(createLendSchema(today)),
    defaultValues: { borrower: "", dueDate: addDays(today, 14) }, // 初期値は2週間後
  });

  const onSubmit = (values: LendFormValues) => {
    addLoan({ bookId: book.id, loanedAt: today, ...values });
    notify(`「${book.title}」を${values.borrower}さんに貸し出しました`);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>貸し出す：{book.title}</DialogTitle>
      <DialogContent>
        {/* DialogContent の最初の要素は上の余白が詰まるので、pt で少し空ける */}
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormTextField control={control} name="borrower" label="借りる人" required autoFocus />
          <FormTextField
            control={control}
            name="dueDate"
            label="返却期限"
            type="date"
            required
            helperText={`今日から${MAX_LOAN_DAYS}日以内`}
            // 日付の入力欄は値がなくても「年/月/日」が出るので、ラベルを常に上に置く（shrink）
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today, max: addDays(today, MAX_LOAN_DAYS) } }}
          />
          <Stack direction="row" spacing={1}>
            {quickPeriods.map((period) => (
              <Chip
                key={period.days}
                label={period.label}
                variant="outlined"
                // setValue：フォームの値を JS から書き換える。shouldValidate でエラー表示も更新する
                onClick={() =>
                  setValue("dueDate", addDays(today, period.days), { shouldValidate: true })
                }
              />
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDone}>キャンセル</Button>
        <Button type="submit" variant="contained">
          貸し出す
        </Button>
      </DialogActions>
    </form>
  );
};
