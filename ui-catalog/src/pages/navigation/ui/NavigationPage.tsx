import { useState } from "react";
import {
  Breadcrumb,
  ButtonLink,
  Container,
  PageHeader,
  Pagination,
  SegmentedControl,
  Stack,
  Tabs,
} from "@/shared/ui";
import { DemoSection } from "@/widgets/demo-section";

/**
 * ナビゲーションの部品（/navigation）
 */

type Filter = "all" | "active" | "done";

export const NavigationPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(4);

  return (
    <Container>
      <Stack gap={5}>
        <PageHeader title="ナビゲーション" />

        <DemoSection name="ButtonLink" usage="ボタンの見た目のリンク。新しいタブでも開ける">
          <Stack direction="row" gap={2} wrap>
            <ButtonLink to="/">一覧へ</ButtonLink>
            <ButtonLink to="/display" variant="secondary">
              表示の部品へ
            </ButtonLink>
            <ButtonLink to="/form" variant="ghost" size="sm">
              フォームの例へ
            </ButtonLink>
          </Stack>
        </DemoSection>

        <DemoSection name="Breadcrumb" usage="今いるページまでの道すじ。最後の項目は今のページ">
          <Breadcrumb
            items={[
              { label: "部品の一覧", to: "/" },
              { label: "ナビゲーション", to: "/navigation" },
              { label: "Breadcrumb" },
            ]}
          />
        </DemoSection>

        <DemoSection name="Tabs" usage="同じ画面の中で内容を切り替える（← → キーでも移動）">
          <Tabs
            label="ユーザーの情報"
            items={[
              { id: "profile", label: "プロフィール", content: <p>名前・メールなど</p> },
              { id: "courses", label: "受講中の講座", content: <p>講座の一覧</p> },
              { id: "history", label: "履歴", content: <p>操作の履歴</p> },
            ]}
          />
        </DemoSection>

        <DemoSection name="SegmentedControl" usage="押した瞬間に切り替わる絞り込み">
          <SegmentedControl
            label="表示するタスク"
            options={[
              { value: "all", label: "すべて" },
              { value: "active", label: "未完了" },
              { value: "done", label: "完了" },
            ]}
            value={filter}
            onChange={setFilter}
          />
          <p>選択中：{filter}</p>
        </DemoSection>

        <DemoSection name="Pagination" usage="件数が多い一覧のページ送り">
          <Pagination page={page} pageCount={10} onChange={setPage} />
          <p>{page} ページ目</p>
        </DemoSection>
      </Stack>
    </Container>
  );
};
