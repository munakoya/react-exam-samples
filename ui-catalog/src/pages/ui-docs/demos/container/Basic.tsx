import { Card, Container } from "@/shared/ui";

// ページの一番外側に置き、中身の最大幅を決めて中央に寄せる
export default function ContainerBasic() {
  return (
    <Container size="sm">
      <Card title='size="sm"'>最大幅 640px。フォームなど1列の画面向け</Card>
    </Container>
  );
}
