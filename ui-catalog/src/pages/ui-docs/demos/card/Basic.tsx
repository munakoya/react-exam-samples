import { Badge, Button, Card } from "@/shared/ui";

// title・本文（children）・footer（ボタン置き場）の3つに分かれる
export default function CardBasic() {
  return (
    <Card
      title="にんじん"
      footer={
        <>
          <Button variant="secondary" size="sm">
            編集
          </Button>
          <Button variant="danger" size="sm">
            削除
          </Button>
        </>
      }
    >
      <p>数量：3本</p>
      <Badge tone="success">在庫あり</Badge>
    </Card>
  );
}
