import Button from "@mui/material/Button";
import { EmptyState } from "@/shared/ui";

// 一覧が0件のとき、一覧の代わりに表示する
export default function EmptyStateBasic() {
  return (
    <EmptyState
      title="Todo がありません"
      description="上の入力欄から追加してください。"
      action={<Button variant="outlined">追加する</Button>}
    />
  );
}
