import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useItemStore, type Item } from "@/entities/item";
import { movementTypeOptions, useStockMovementStore } from "@/entities/stock-movement";
import { Button, RadioGroup, Stack, TextField, useToast } from "@/shared/ui";
import { createAdjustStockSchema, type AdjustStockValues } from "../model/schema";
import styles from "./AdjustStockForm.module.css";

/**
 * 入出庫フォーム ── features/adjust-stock/ui
 *
 * 送信すると、2つの store をまとめて更新する。
 *   1. entities/item           … 在庫数を増減（adjustQuantity）
 *   2. entities/stock-movement … 履歴を1件追加（addMovement）
 * entities 同士は import し合えないので、両方を使う処理は features に書く。
 */

type AdjustStockFormProps = {
  item: Item;
  /** 送信・キャンセルの後に呼ばれる（モーダルを閉じる） */
  onDone: () => void;
};

export const AdjustStockForm = ({ item, onDone }: AdjustStockFormProps) => {
  const adjustQuantity = useItemStore((state) => state.adjustQuantity);
  const addMovement = useStockMovementStore((state) => state.addMovement);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // 今の在庫数を渡してスキーマを作る（出庫の上限チェックに使う）
    resolver: zodResolver(createAdjustStockSchema(item.quantity)),
    defaultValues: { type: "in" as const, quantity: 1, note: "" },
  });

  /*
   * useWatch：入力中の値を読む。値が変わるたびにこのコンポーネントが再描画される。
   * 送信前に「入出庫後の在庫数」をプレビューするために使う。
   */
  const type = useWatch({ control, name: "type" });
  const quantity = useWatch({ control, name: "quantity" });
  const delta = Number.isNaN(quantity) ? 0 : type === "in" ? quantity : -quantity;
  const after = item.quantity + delta;

  const onSubmit = (values: AdjustStockValues) => {
    adjustQuantity(item.id, values.type === "in" ? values.quantity : -values.quantity);
    addMovement({ itemId: item.id, ...values });
    toast.show(`「${item.name}」を${values.type === "in" ? "入庫" : "出庫"}しました`, "success");
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={4}>
        <RadioGroup
          label="種類"
          direction="row"
          options={movementTypeOptions}
          {...register("type")}
        />
        <TextField
          label="数量"
          type="number"
          inputMode="numeric"
          min={1}
          {...register("quantity", { valueAsNumber: true })}
          error={errors.quantity?.message}
        />
        <TextField
          label="メモ"
          placeholder="例：仕入れ・販売・廃棄"
          hint="任意"
          {...register("note")}
          error={errors.note?.message}
        />

        {/* 入出庫後の在庫数のプレビュー。マイナスになるなら赤くする */}
        <p className={styles.preview} data-invalid={after < 0}>
          在庫数：{item.quantity} → <strong>{after}</strong>
        </p>

        <Stack direction="row" gap={2} justify="end">
          <Button variant="secondary" onClick={onDone}>
            キャンセル
          </Button>
          <Button type="submit">確定</Button>
        </Stack>
      </Stack>
    </form>
  );
};
