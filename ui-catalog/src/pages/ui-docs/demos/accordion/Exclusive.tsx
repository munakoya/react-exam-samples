import { Accordion } from "@/shared/ui";

const steps = [
  {
    title: "1. アカウントを作る",
    content: <p>メールアドレスとパスワードを登録します。</p>,
    defaultOpen: true,
  },
  { title: "2. プロフィールを入力する", content: <p>名前と住所を入力します。</p> },
  { title: "3. 利用を始める", content: <p>ダッシュボードから各機能を使えます。</p> },
];

// exclusive：1つ開くと、ほかは自動で閉じる（同時に1つだけ）
export default function AccordionExclusive() {
  return <Accordion items={steps} exclusive />;
}
