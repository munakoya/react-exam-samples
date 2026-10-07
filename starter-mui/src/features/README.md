# features ── ユーザーの操作 1 つ分

「追加・編集する」「削除する」「絞り込む」など、**動詞**ごとにフォルダを作る。ボタンと、それが開くダイアログをセットで持つ。

```text
features/
├── item-form/                追加・編集（ダイアログ）
│   ├── model/schema.ts       フォームの zod スキーマと初期値 toFormInput(item?)
│   ├── ui/ItemFormDialog.tsx
│   └── index.ts
├── delete-item/              削除ボタン ＋ 確認ダイアログ
│   ├── ui/DeleteItemButton.tsx
│   └── index.ts
└── item-filter/              絞り込み（条件は URL に持つ）
```

- 使ってよいのは entities と shared だけ。features 同士は import しない（組み合わせは widgets・pages で）
- ダイアログの開閉が「そのボタンの中だけ」なら `useState`。追加・編集のように一覧のあちこちから開くなら、ページで `useFormDialog` を持つ

完成形の例：[ユーザー管理の features](https://github.com/munakoya/react-exam-samples/tree/main/user-management/src/features)・
見本と解説：[MUI 部品カタログ › 画面パターン（CRUD）](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/crud-overview)

## item-form/model/schema.ts

```ts
import { z } from "zod";
import { itemCategories, type Item } from "@/entities/item";

export const itemFormSchema = z.object({
  name: z.string().trim().min(1, "名前を入力してください").max(30, "30文字以内で入力してください"),
  category: z.enum(itemCategories),
  // 数値の入力欄は文字列で届く → coerce で数値にする（空欄は 0 になるので min で弾く）
  price: z.coerce.number<string>().int("整数で入力してください").min(1, "1以上で入力してください"),
  memo: z.string().trim().max(200, "200文字以内で入力してください"),
});

export type ItemFormInput = z.input<typeof itemFormSchema>; // フォームの値（price は文字列）
export type ItemFormValues = z.output<typeof itemFormSchema>; // チェック後の値（price は数値）

/** フォームの初期値。item があれば編集（今の値）、なければ追加（空） */
export const toFormInput = (item?: Item): ItemFormInput => ({
  name: item?.name ?? "",
  category: item?.category ?? "food",
  price: item ? String(item.price) : "",
  memo: item?.memo ?? "",
});
```

## item-form/ui/ItemFormDialog.tsx（追加・編集で共通）

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";
import { useForm } from "react-hook-form";
import { itemCategoryOptions, useItemStore, type Item } from "@/entities/item";
import { DialogForm, FormTextField, notify } from "@/shared/ui";
import { itemFormSchema, toFormInput, type ItemFormInput, type ItemFormValues } from "../model/schema";

type Props = { open: boolean; item?: Item; onClose: () => void };

export const ItemFormDialog = ({ open, item, onClose }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    {/* Dialog は閉じると中身を消す → 開くたびに ItemForm が初期値から始まる（reset 不要） */}
    <ItemForm item={item} onDone={onClose} />
  </Dialog>
);

const ItemForm = ({ item, onDone }: { item?: Item; onDone: () => void }) => {
  const addItem = useItemStore((state) => state.addItem);
  const updateItem = useItemStore((state) => state.updateItem);

  const { control, handleSubmit } = useForm<ItemFormInput, unknown, ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: toFormInput(item),
  });

  const onSubmit = (values: ItemFormValues) => {
    if (item) {
      updateItem(item.id, values);
      notify(`「${values.name}」を更新しました`);
    } else {
      addItem(values);
      notify(`「${values.name}」を追加しました`);
    }
    onDone();
  };

  return (
    <DialogForm
      title={item ? "編集" : "追加"}
      submitLabel={item ? "更新" : "追加"}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onDone}
    >
      <FormTextField control={control} name="name" label="名前" required autoFocus />
      <FormTextField control={control} name="category" label="種類" select>
        {itemCategoryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </FormTextField>
      <FormTextField control={control} name="price" label="価格" type="number" required />
      <FormTextField control={control} name="memo" label="メモ" multiline minRows={3} />
    </DialogForm>
  );
};
```

入力の種類ごとのつなぎ方（ラジオ・チェックボックス・スイッチ・日付・星・タグ）は
[MUI 画面構築ガイド › 3. フォーム](https://munakoya.github.io/react-exam-samples/guide/mui-guide/03-forms)。

## delete-item/ui/DeleteItemButton.tsx

```tsx
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useItemStore, type Item } from "@/entities/item";
import { ConfirmDialog, notify } from "@/shared/ui";

export const DeleteItemButton = ({ item, onDeleted }: { item: Item; onDeleted?: () => void }) => {
  const [open, setOpen] = useState(false); // このボタンの中だけで使うので useState
  const removeItems = useItemStore((state) => state.removeItems);

  const handleConfirm = () => {
    setOpen(false);
    removeItems([item.id]);
    notify(`「${item.name}」を削除しました`);
    onDeleted?.(); // 詳細ページなら一覧へ戻る
  };

  return (
    <>
      <Tooltip title="削除">
        <IconButton size="small" color="error" aria-label={`「${item.name}」を削除`} onClick={() => setOpen(true)}>
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${item.name}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
```

まとめて削除・絞り込み（URL に持つ）は、ユーザー管理の
[DeleteUsersButton](https://github.com/munakoya/react-exam-samples/blob/main/user-management/src/features/delete-user/ui/DeleteUsersButton.tsx)・
[useUserFilter](https://github.com/munakoya/react-exam-samples/blob/main/user-management/src/features/user-filter/model/useUserFilter.ts) を写す。
