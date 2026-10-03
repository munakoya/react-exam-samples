import { useNavigate } from "react-router";
import { Button, Container, EmptyState } from "@/shared/ui";

/**
 * どのルートにも一致しない URL のページ（<Route path="*">） ── pages/not-found/ui
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm">
      <EmptyState
        title="ページが見つかりません"
        description="URL を確認してください。"
        action={<Button onClick={() => navigate("/")}>トップへ戻る</Button>}
      />
    </Container>
  );
};
