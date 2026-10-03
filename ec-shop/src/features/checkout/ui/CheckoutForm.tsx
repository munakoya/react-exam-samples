import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { calcCartTotals, useCartStore } from "@/entities/cart";
import { paymentMethodOptions, useOrderStore } from "@/entities/order";
import { Alert, Button, Checkbox, RadioGroup, Stack, TextAreaField, TextField } from "@/shared/ui";
import {
  checkoutDefaultValues,
  checkoutSchema,
  type CheckoutFormInput,
  type CheckoutFormValues,
} from "../model/schema";
import styles from "./CheckoutForm.module.css";

/**
 * 購入手続きフォーム ── features/checkout/ui
 *
 * 「注文を確定する」で次の順に動く。
 *   1. 入力チェック（zod）
 *   2. 注文を記録する（entities/order の addOrder）… カートの中身と合計をコピーして保存
 *   3. 完了ページへ移動する
 *   4. カートを空にする（entities/cart の clearCart）
 * 2つの store（order と cart）をまとめて動かすので、features に置く。
 */

// 通信の代わりに少し待つ（送信中の表示を確かめるため）。API がある問題なら fetch に置き換える
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CheckoutForm = () => {
  const navigate = useNavigate();
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isValid },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaultValues,
  });

  // onSubmit を async にすると、終わるまで isSubmitting が true になる（ボタンを「処理中…」にできる）
  const onSubmit = async (values: CheckoutFormValues) => {
    await wait(800);

    const totals = calcCartTotals(lines);
    const order = addOrder({
      // カートの行から、注文に必要な項目だけを取り出す（在庫数 stock は注文には要らない）
      lines: lines.map(({ productId, name, emoji, price, quantity }) => ({
        productId,
        name,
        emoji,
        price,
        quantity,
      })),
      customer: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        postalCode: values.postalCode,
        address: values.address,
      },
      paymentMethod: values.paymentMethod,
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      total: totals.total,
    });

    // 先に移動してからカートを空にする（購入手続きページの「カートが空なら戻す」が先に動かないように）
    navigate(`/orders/${order.id}/complete`, { replace: true });
    clearCart();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={4}>
        {/* 送信したのにエラーが残っているときは、上にまとめて知らせる */}
        {isSubmitted && !isValid && (
          <Alert tone="error">入力内容に誤りがあります。赤い項目を確認してください。</Alert>
        )}

        {/* autoComplete：ブラウザに保存された名前・住所などを自動入力できるようにする */}
        <TextField
          label="お名前"
          autoComplete="name"
          {...register("name")}
          error={errors.name?.message}
        />
        <TextField
          label="メールアドレス"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <TextField
          label="電話番号"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09012345678"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <TextField
          label="郵便番号"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="123-4567"
          {...register("postalCode")}
          error={errors.postalCode?.message}
        />
        <TextAreaField
          label="住所"
          rows={2}
          autoComplete="street-address"
          {...register("address")}
          error={errors.address?.message}
        />
        <RadioGroup
          label="お支払い方法"
          options={paymentMethodOptions}
          {...register("paymentMethod")}
          error={errors.paymentMethod?.message}
        />
        <div>
          <Checkbox label="利用規約に同意する" {...register("agreed")} />
          {/* Checkbox には error がないので、エラー文はここで出す */}
          {errors.agreed && <p className={styles.error}>{errors.agreed.message}</p>}
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          注文を確定する
        </Button>
      </Stack>
    </form>
  );
};
