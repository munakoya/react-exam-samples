import { Accordion } from "@/shared/ui";

const faqs = [
  {
    title: "送料はいくらですか？",
    content: <p>全国一律 500円です。5,000円以上のご注文で無料になります。</p>,
  },
  {
    title: "返品できますか？",
    content: <p>商品の到着から7日以内であれば返品できます。</p>,
    defaultOpen: true,
  },
  { title: "支払い方法は？", content: <p>クレジットカードと銀行振込に対応しています。</p> },
];

// よくある質問など。defaultOpen で最初から開いておける
export default function AccordionBasic() {
  return <Accordion items={faqs} />;
}
