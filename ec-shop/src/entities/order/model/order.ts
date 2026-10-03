import { z } from "zod";

/**
 * 注文の型 ── entities/order/model
 *
 * 注文は「確定した時点の記録」なので、商品名・価格・合計金額もすべてコピーして持つ。
 * あとから商品の価格が変わっても、過去の注文の金額は変わらない。
 */

export const paymentMethods = ["card", "bank", "cod"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: "クレジットカード",
  bank: "銀行振込",
  cod: "代金引換",
};

export const paymentMethodOptions = paymentMethods.map((value) => ({
  value,
  label: paymentMethodLabels[value],
}));

const orderLineSchema = z.object({
  productId: z.string(),
  name: z.string(),
  emoji: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(), // 画面に出す注文番号（id は長いので別に作る）
  lines: z.array(orderLineSchema),
  customer: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    postalCode: z.string(),
    address: z.string(),
  }),
  paymentMethod: z.enum(paymentMethods),
  subtotal: z.number(),
  shippingFee: z.number(),
  total: z.number(),
  createdAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderLine = z.infer<typeof orderLineSchema>;
export type OrderInput = Omit<Order, "id" | "orderNumber" | "createdAt">;
