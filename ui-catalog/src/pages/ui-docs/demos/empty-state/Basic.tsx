import { Button, EmptyState } from "@/shared/ui";

// 一覧が0件のときに、一覧の代わりに表示する
//   {items.length === 0 ? <EmptyState … /> : <ul>…</ul>}
export default function EmptyStateBasic() {
  return (
    <EmptyState
      title="商品がありません"
      description="「追加する」から登録してください。"
      action={<Button>追加する</Button>}
    />
  );
}
