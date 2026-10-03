import { ButtonLink, Container, EmptyState } from "@/shared/ui";

/**
 * どのルートにも一致しない URL のページ（<Route path="*">） ── pages/not-found/ui
 */
export const NotFoundPage = () => {
  return (
    <Container size="sm">
      <EmptyState
        title="ページが見つかりません"
        description="URL を確認してください。"
        action={<ButtonLink to="/">トップへ戻る</ButtonLink>}
      />
    </Container>
  );
};
