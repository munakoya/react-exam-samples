import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import { PageHeader } from "@/shared/ui";

// ページの一番上に置く見出し。breadcrumbs の最後（to なし）は今のページ
export default function PageHeaderBasic() {
  return (
    <PageHeader
      title="坊っちゃん"
      description="夏目漱石"
      breadcrumbs={[{ label: "本の一覧", to: "/page-header" }, { label: "坊っちゃん" }]}
      action={
        <Button variant="outlined" startIcon={<EditOutlinedIcon />}>
          編集
        </Button>
      }
    />
  );
}
