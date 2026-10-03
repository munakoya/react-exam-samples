import { Button, PageHeader } from "@/shared/ui";

// タイトルを左、操作ボタンを右に置く。狭い画面ではボタンが下へ折り返す
export default function PageHeaderBasic() {
  return (
    <PageHeader
      title="商品一覧"
      description="登録されている商品を管理します"
      action={<Button>新規登録</Button>}
    />
  );
}
