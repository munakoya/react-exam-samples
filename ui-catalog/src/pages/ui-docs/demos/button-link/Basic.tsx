import { ButtonLink, Stack } from "@/shared/ui";

// ページを移動するだけのボタンは、<button> ＋ navigate() ではなく ButtonLink（中身は Link）にする。
// 新しいタブで開ける・読み上げで「リンク」と伝わる。保存・削除など処理をするものは Button
export default function ButtonLinkBasic() {
  return (
    <Stack direction="row" gap={2} wrap>
      <ButtonLink to="/button">新規登録</ButtonLink>
      <ButtonLink to="/button" variant="secondary">
        編集
      </ButtonLink>
      <ButtonLink to="/button" variant="ghost" size="sm">
        一覧へ戻る
      </ButtonLink>
    </Stack>
  );
}
