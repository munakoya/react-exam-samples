/**
 * 表示用の整形関数（金額） ── shared/lib
 *
 * Intl を使うと、桁区切りや通貨の記号をブラウザが整えてくれる。フォーマッタは関数の外で1回だけ作る。
 */

const yenFormatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

/** 1200 → "￥1,200" */
export const formatYen = (amount: number) => yenFormatter.format(amount);
