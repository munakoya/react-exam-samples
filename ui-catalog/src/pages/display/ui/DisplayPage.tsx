import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  DescriptionList,
  Grid,
  PageHeader,
  ProgressBar,
  Rating,
  Stack,
  Stat,
  Table,
  type TableColumn,
} from "@/shared/ui";
import { DemoSection } from "@/widgets/demo-section";

/**
 * 表示の部品（/display）
 */

type Book = { id: string; title: string; author: string; rating: number; note: string };

const books: Book[] = [
  {
    id: "1",
    title: "リーダブルコード",
    author: "D. Boswell",
    rating: 5,
    note: "名前の付け方・コメントの書き方。何度も読み返したい。",
  },
  { id: "2", title: "達人プログラマー", author: "D. Thomas", rating: 4, note: "考え方の本。" },
  { id: "3", title: "Web を支える技術", author: "山本 陽平", rating: 3, note: "" },
];

const columns: TableColumn<Book>[] = [
  { key: "title", header: "タイトル", rowHeader: true, render: (b) => b.title },
  { key: "author", header: "著者", render: (b) => b.author },
  { key: "rating", header: "評価", render: (b) => <Rating value={b.rating} /> },
  { key: "note", header: "メモ", render: (b) => b.note || "—", wrap: true }, // 長い文章は折り返す
];

export const DisplayPage = () => {
  return (
    <Container>
      <Stack gap={5}>
        <PageHeader title="表示" />

        <DemoSection name="Card / Grid" usage="カードを、1枚の最小幅を決めて入るだけ並べる">
          <Grid min={180} gap={3}>
            {books.map((book) => (
              <Card key={book.id} title={book.title} footer={<Button size="sm">詳細</Button>}>
                <p>{book.author}</p>
                <Rating value={book.rating} />
              </Card>
            ))}
          </Grid>
        </DemoSection>

        <DemoSection name="Table" usage="一覧表。文章の列は wrap: true で折り返す">
          <Table caption="本の一覧" columns={columns} rows={books} getRowKey={(b) => b.id} />
        </DemoSection>

        <DemoSection
          name="DescriptionList"
          usage="詳細ページの「項目名：値」。狭い場所では1列になる"
        >
          <DescriptionList
            items={[
              { term: "タイトル", description: "リーダブルコード" },
              { term: "評価", description: <Rating value={5} /> },
              { term: "状態", description: <Badge tone="success">貸出可</Badge> },
              {
                term: "メモ",
                description: "1行目\n2行目（multiline で改行を残す）",
                multiline: true,
              },
            ]}
          />
        </DemoSection>

        <DemoSection name="Badge" usage="状態のラベル">
          <Stack direction="row" gap={2} wrap>
            <Badge>neutral</Badge>
            <Badge tone="info">info：進行中</Badge>
            <Badge tone="success">success：在庫あり</Badge>
            <Badge tone="warning">warning：在庫少</Badge>
            <Badge tone="danger">danger：在庫切れ</Badge>
          </Stack>
        </DemoSection>

        <DemoSection
          name="Avatar"
          usage="ユーザーのアイコン。画像がなければ名前の1文字目（色は名前で決まる）"
        >
          <Stack direction="row" gap={3} align="center">
            <Avatar name="山田 太郎" size="sm" />
            <Avatar name="佐藤 花子" />
            <Avatar name="Suzuki" size="lg" />
            <Stack direction="row" gap={2} align="center">
              <Avatar name="田中 一郎" size="sm" />
              <span>田中 一郎</span>
            </Stack>
          </Stack>
        </DemoSection>

        <DemoSection name="Rating" usage="★ の評価の表示（読み上げは「5点中4点」）">
          <Stack direction="row" gap={4}>
            <Rating value={1} />
            <Rating value={3} />
            <Rating value={4.6} />
          </Stack>
        </DemoSection>

        <DemoSection name="Stat" usage="集計の数字。Grid で並べる">
          <Grid min={150} gap={3}>
            <Stat label="今月の収入" value="¥320,000" tone="success" />
            <Stat label="今月の支出" value="¥248,500" note="先月より +12,000円" />
            <Stat label="予算オーバー" value="2件" tone="danger" />
          </Grid>
        </DemoSection>

        <DemoSection name="ProgressBar" usage="進み具合・使用率（max を超えても 100% で止まる）">
          <Stack gap={3}>
            <ProgressBar label="受講の進み具合" value={6} max={10} valueText="6 / 10 回" />
            <ProgressBar label="食費の予算" value={38000} max={40000} tone="warning" />
            <ProgressBar
              label="交際費の予算"
              value={15000}
              max={10000}
              tone="danger"
              valueText="150%"
            />
          </Stack>
        </DemoSection>

        <DemoSection name="Accordion" usage="開閉する見出し（FAQ・注文の明細）">
          <Accordion
            items={[
              { title: "送料はいくらですか？", content: <p>3,000円以上で無料です。</p> },
              { title: "返品できますか？", content: <p>到着から7日以内なら可能です。</p> },
            ]}
          />
        </DemoSection>
      </Stack>
    </Container>
  );
};
