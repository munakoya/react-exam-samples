# 3. フォーム

> [目次](README.md) ｜ 前：[2. レイアウト](02-layout.md) ｜ 次：[4. 一覧の見せ方](04-data-display.md)

React Hook Form（RHF）＋ zod ＋ MUI の組み合わせ。**MUI の入力欄は `register` ではなく `Controller` でつなぐ**のがいちばん大事な点。

## 3-1. 基本の形

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// 1. チェックはスキーマに書く
const schema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください").max(50, "50文字以内で入力してください"),
  genre: z.string().pipe(z.enum(["novel", "tech"], { error: "ジャンルを選択してください" })),
});
type FormInput = z.input<typeof schema>; // 入力中の値
type FormValues = z.output<typeof schema>; // チェック後の値

export const BookForm = ({ onSubmit }: { onSubmit: (values: FormValues) => void }) => {
  // 2. useForm に resolver と、すべての項目の初期値を渡す
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", genre: "" },
  });

  // 3. <form> の onSubmit に handleSubmit(onSubmit)。noValidate でブラウザの吹き出しを止める
  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormTextField control={control} name="title" label="タイトル" required />
      <FormTextField control={control} name="genre" label="ジャンル" select required>
        <MenuItem value="novel">小説</MenuItem>
        <MenuItem value="tech">技術書</MenuItem>
      </FormTextField>
      {/* 4. 送信ボタンは type="submit"。loading で二重送信を防ぐ */}
      <Button type="submit" variant="contained" loading={isSubmitting}>登録</Button>
    </Stack>
  );
};
```

**フォームは入力とチェックだけ**。保存（store を呼ぶ）・通知・ページ移動は、フォームを使うページ側に書く。登録と編集で同じフォームを使い回せる。

## 3-2. TextField を Controller でつなぐ

```tsx
<Controller
  control={control}
  name="title"
  render={({ field: { ref, ...field }, fieldState }) => (
    <TextField
      {...field} // value・onChange・onBlur・name
      inputRef={ref} // 中の <input> へ（送信時にエラーの欄へフォーカスが移る）
      label="タイトル"
      fullWidth
      error={fieldState.error !== undefined} // 赤枠
      helperText={fieldState.error?.message ?? "50文字以内"} // エラー文。なければ補足
    />
  )}
/>
```

毎回同じなので、部品にまとめる（自作の `FormTextField`）：

```tsx
export const FormTextField = <T extends FieldValues, U>({ name, control, helperText, ...props }: Props<T, U>) => {
  const { field: { ref, ...field }, fieldState } = useController({ name, control });
  return (
    <TextField
      fullWidth
      {...props}
      {...field}
      inputRef={ref}
      error={fieldState.error !== undefined}
      helperText={fieldState.error?.message ?? helperText}
    />
  );
};
```

## 3-3. 入力の種類ごとの書き方

### 文字・複数行

```tsx
<FormTextField control={control} name="title" label="タイトル" required autoFocus />
<FormTextField control={control} name="memo" label="メモ" multiline minRows={3} helperText="任意" />
```

```ts
title: z.string().trim().min(1, "…を入力してください").max(50, "…"),
memo: z.string().trim().max(500, "500文字以内で入力してください"), // 任意
email: z.email("メールアドレスの形式で入力してください"),
tel: z.string().regex(/^0\d{1,4}-?\d{1,4}-?\d{4}$/, "電話番号の形式で入力してください"),
```

### 数値

入力欄の値は `type="number"` でも**文字列**。zod で文字列のまま受け取り、チェックしてから数値にする。

```tsx
<FormTextField control={control} name="quantity" label="数量" type="number" slotProps={{ htmlInput: { min: 0, inputMode: "numeric" } }} />
```

```ts
// 必須の整数
quantity: z.string().min(1, "数量を入力してください").regex(/^\d+$/, "0以上の整数で入力してください").transform(Number),

// 任意の数値（未入力は null）
publishedYear: z.string().trim()
  .refine((v) => v === "" || /^\d{4}$/.test(v), { error: "4桁で入力してください", abort: true })
  .transform((v) => (v === "" ? null : Number(v))),
```

`z.coerce.number()` は空欄 `""` を `0` にしてしまい「未入力」を見逃すので、必須の数値には使わない。
`defaultValues` は `quantity: ""`（編集なら `String(item.quantity)`）。

### 日付・時刻

```tsx
<FormTextField
  control={control}
  name="dueDate"
  label="返却期限"
  type="date" // "time"・"datetime-local" も同じ
  slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }} // ラベルを常に上に
/>
```

```ts
dueDate: z.iso.date({ error: "返却期限を入力してください" })          // "YYYY-MM-DD"
  .refine((v) => v >= today, "今日以降の日付を選んでください"),       // 文字列のまま比べられる
startTime: z.iso.time({ error: "開始時刻を入力してください" }),       // "HH:MM"
```

`@mui/x-date-pickers` のカレンダーは別パッケージ（日付ライブラリも要る）。試験では `type="date"` で十分。

### セレクト（1 つ選ぶ）

```tsx
<FormTextField control={control} name="genre" label="ジャンル" select required>
  {genreOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
</FormTextField>
```

```ts
// 未選択の "" を初期値にできるよう、文字列で受け取ってから選択肢のどれかかを確かめる
genre: z.string().pipe(z.enum(genres, { error: "ジャンルを選択してください" })),
```

⚠ value が MenuItem のどれとも一致しないと「out-of-range value」の警告が出る。未選択は `""` にする。

### ラジオボタン

```tsx
<Controller
  control={control}
  name="plan"
  render={({ field, fieldState }) => (
    <FormControl error={fieldState.error !== undefined}>
      <FormLabel id="plan-label">プラン</FormLabel>
      <RadioGroup {...field} row aria-labelledby="plan-label"> {/* value・onChange をそのまま渡せる */}
        <FormControlLabel value="free" control={<Radio />} label="無料" />
        <FormControlLabel value="pro" control={<Radio />} label="有料" />
      </RadioGroup>
      {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
    </FormControl>
  )}
/>
```

### チェックボックス・スイッチ（true / false）

```tsx
<Controller
  control={control}
  name="agreed"
  render={({ field, fieldState }) => (
    <FormControl error={fieldState.error !== undefined}>
      <FormControlLabel
        label="利用規約に同意する"
        control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
      />
      {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
    </FormControl>
  )}
/>
```

```ts
agreed: z.boolean().refine((v) => v, "利用規約への同意が必要です"),
newsletter: z.boolean(), // スイッチ
```

**チェック系は `value` ではなく `checked`**、受け取りは `event.target.checked`。

### チェックボックスで複数選ぶ（配列）

```tsx
<Controller
  control={control}
  name="days"
  render={({ field, fieldState }) => (
    <FormControl component="fieldset" error={fieldState.error !== undefined}>
      <FormLabel component="legend">曜日</FormLabel>
      <FormGroup row>
        {days.map((day) => (
          <FormControlLabel
            key={day}
            label={day}
            control={
              <Checkbox
                checked={field.value.includes(day)}
                onChange={(e) =>
                  field.onChange(e.target.checked ? [...field.value, day] : field.value.filter((d) => d !== day))
                }
              />
            }
          />
        ))}
      </FormGroup>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )}
/>
```

```ts
days: z.array(z.string()).min(1, "1つ以上選んでください"), // defaultValues は []
```

### 評価（Rating）

```tsx
<Controller
  control={control}
  name="rating"
  render={({ field }) => (
    <Rating
      name={field.name}
      value={field.value === 0 ? null : field.value} // 0 = 未評価
      onChange={(_event, value) => field.onChange(value ?? 0)} // 第 2 引数が値。同じ星をもう一度押すと null
    />
  )}
/>
```

### 候補から選ぶ・タグ（Autocomplete）

```tsx
// 1 つ選ぶ（オブジェクトの選択肢）
<Controller
  control={control}
  name="prefecture"
  render={({ field, fieldState }) => (
    <Autocomplete
      options={prefectures}
      value={prefectures.find((p) => p.code === field.value) ?? null} // フォームには code だけ持つ
      onChange={(_event, option) => field.onChange(option?.code ?? "")}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField {...params} label="都道府県" error={!!fieldState.error} helperText={fieldState.error?.message} />
      )}
    />
  )}
/>

// 複数・自由入力（タグ）
<Controller
  control={control}
  name="tags"
  render={({ field }) => (
    <Autocomplete
      multiple
      freeSolo // 候補にない文字も Enter で追加できる
      options={tagOptions}
      value={field.value}
      onChange={(_event, value) => field.onChange(value)}
      renderInput={(params) => <TextField {...params} label="タグ" placeholder="入力して Enter" />}
    />
  )}
/>
```

`renderInput` の `params` は**必ず全部渡す**（中の `<input>` の設定が入っている）。

### 数量（± ボタン）

```tsx
<Controller
  control={control}
  name="quantity"
  render={({ field }) => <QuantityStepper label="数量" value={field.value} onChange={field.onChange} min={1} max={stock} />}
/>
```

## 3-4. 項目同士・ほかの値で変わるチェック

```ts
// 項目同士を比べる：エラーを出す項目を path で指定する
const schema = z
  .object({ startDate: z.iso.date(), endDate: z.iso.date() })
  .refine((v) => v.endDate >= v.startDate, { error: "終了日は開始日以降にしてください", path: ["endDate"] });

// ほかの値（今の在庫・今日）で変わる：スキーマを作る関数（スキーマの工場）
const createOutSchema = (stock: number) =>
  z.object({ quantity: z.string().regex(/^\d+$/).transform(Number) })
    .refine((v) => v.quantity <= stock, { error: `在庫（${stock}）までです`, path: ["quantity"] });

useForm({ resolver: zodResolver(createOutSchema(item.stock)), … });
```

## 3-5. 入力中の値を使う・JS から値を入れる

```tsx
const { control, setValue } = useForm(…);

// 入力中の値を読む（合計金額のプレビューなど）。値が変わるたびに再描画される
const quantity = useWatch({ control, name: "quantity" });

// JS から値を入れる（「1 週間後」のボタンなど）。shouldValidate でエラー表示も更新
<Chip label="1週間" onClick={() => setValue("dueDate", addDays(today, 7), { shouldValidate: true })} />
```

## 3-6. 登録ページと編集ページ

```tsx
// 登録：空の初期値
<BookForm defaultValues={toFormInput()} submitLabel="登録" onSubmit={(values) => { const b = addBook(values); navigate(`/books/${b.id}`); }} />

// 編集：今の値を初期値に。key で、別の本に移ったときにフォームを作り直す
<BookForm key={book.id} defaultValues={toFormInput(book)} submitLabel="更新" onSubmit={(values) => updateBook(book.id, values)} />
```

```ts
// 初期値を作る関数：新規なら空、編集なら今の値（数値は文字列に）
export const toFormInput = (book?: Book): FormInput => ({
  title: book?.title ?? "",
  genre: book?.genre ?? "",
  publishedYear: book?.publishedYear == null ? "" : String(book.publishedYear),
});
```

**`defaultValues` は最初の 1 回だけ使われる**。あとから変えたいときは `reset(新しい値)` か `key` で作り直す。

## 3-7. ダイアログの中のフォーム

```tsx
// ボタン ＋ Dialog（開閉はボタンの中の useState）
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>貸し出す</Button>
<Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
  <LendForm onDone={() => setOpen(false)} />
</Dialog>

// フォーム：<form> で DialogTitle・DialogContent・DialogActions を包む
const LendForm = ({ onDone }: { onDone: () => void }) => {
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: { borrower: "" } });
  return (
    <form onSubmit={handleSubmit((values) => { save(values); onDone(); })} noValidate>
      <DialogTitle>貸し出す</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}> {/* DialogContent の先頭はラベルが切れやすいので少し空ける */}
          <FormTextField control={control} name="borrower" label="借りる人" autoFocus />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDone}>キャンセル</Button>
        <Button type="submit" variant="contained">貸し出す</Button>
      </DialogActions>
    </form>
  );
};
```

**MUI の Dialog は閉じると中身を消す**（次に開いたときに作り直す）。`useForm` を Dialog の**中**の部品に書けば、開くたびに初期値・エラーなしから始まり、`reset()` は要らない。
`useForm` を Dialog の外に書く場合は、`slotProps={{ transition: { onExited: () => reset() } }}` で閉じた後にリセットする。

## 3-8. エラーの見せ方

| 見せ方                                 | 書き方                                                       |
| -------------------------------------- | ------------------------------------------------------------ |
| 入力欄の下（いちばん多い）             | `error` ＋ `helperText`（`FormTextField` が自動で）          |
| グループ（ラジオ・チェック）の下       | `FormControl error` ＋ `FormHelperText`                      |
| フォーム全体（保存に失敗した など）    | フォームの上に `<Alert severity="error">`                    |
| 送信できたこと                         | 通知（`notify("登録しました")`）か、`<Alert severity="success">` |

---

> 次：[4. 一覧の見せ方](04-data-display.md)
