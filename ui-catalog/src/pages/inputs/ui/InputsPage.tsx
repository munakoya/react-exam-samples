import { useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  IconButton,
  ImageField,
  PageHeader,
  QuantityStepper,
  RadioGroup,
  RatingField,
  SelectField,
  Stack,
  Switch,
  TextAreaField,
  TextField,
} from "@/shared/ui";
import { DemoSection } from "@/widgets/demo-section";

/**
 * 入力の部品（/inputs）
 *
 * ここでは useState で値を持つ書き方の見本。React Hook Form での書き方は /form を見る。
 */

const genreOptions = [
  { value: "novel", label: "小説" },
  { value: "business", label: "ビジネス" },
  { value: "comic", label: "漫画" },
];

const planOptions = [
  { value: "free", label: "無料" },
  { value: "pro", label: "有料" },
];

export const InputsPage = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [genres, setGenres] = useState<string[]>(["novel"]);
  const [plan, setPlan] = useState("free");
  const [agreed, setAgreed] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState("");

  return (
    <Container>
      <Stack gap={5}>
        <PageHeader title="入力" description="値は useState で持っている（右の値がすぐ変わる）" />

        <DemoSection name="Button" usage="保存・削除などの処理。ページの移動だけなら ButtonLink">
          <Stack direction="row" gap={2} wrap align="center">
            <Button>primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="danger">danger</Button>
            <Button variant="ghost">ghost</Button>
            <Button size="sm">sm</Button>
            <Button disabled>disabled</Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
            >
              押すと loading
            </Button>
          </Stack>
        </DemoSection>

        <DemoSection name="IconButton" usage="記号だけのボタン。label（読み上げ用）は必須">
          <Stack direction="row" gap={2}>
            <IconButton label="閉じる">×</IconButton>
            <IconButton label="編集" variant="secondary">
              ✎
            </IconButton>
            <IconButton label="削除" variant="danger">
              🗑
            </IconButton>
          </Stack>
        </DemoSection>

        <DemoSection name="TextField / TextAreaField" usage="文字・数値・日付・メールの入力">
          <Stack gap={4}>
            <TextField
              label="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              hint="hint：補足説明"
            />
            <TextField
              label="エラーの例"
              defaultValue="abc"
              error="error：メールの形式が正しくありません"
            />
            <Stack direction="row" gap={3} wrap>
              <TextField label="日付" type="date" />
              <TextField label="時刻" type="time" />
              <TextField label="数値" type="number" defaultValue={10} />
            </Stack>
            <TextAreaField label="本文" rows={3} placeholder="複数行の入力" />
          </Stack>
        </DemoSection>

        <DemoSection name="SelectField" usage="選択肢から1つ（選択肢が多いとき）">
          <Stack direction="row" gap={3} wrap>
            <SelectField label="ジャンル" options={genreOptions} />
            <SelectField label="未選択なし" options={genreOptions} placeholder={false} />
          </Stack>
        </DemoSection>

        <DemoSection name="RadioGroup" usage="選択肢から1つ（全部見せたいとき）">
          <RadioGroup
            label="プラン"
            direction="row"
            options={planOptions}
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />
          <p>選択中：{plan}</p>
        </DemoSection>

        <DemoSection name="Checkbox / CheckboxGroup" usage="1つのオン・オフ / いくつでも選ぶ">
          <Stack gap={3}>
            <Checkbox
              label="利用規約に同意する"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <CheckboxGroup
              label="好きなジャンル"
              direction="row"
              options={genreOptions}
              value={genres}
              // チェックしたら足す・外したら抜く
              onChange={(e) =>
                setGenres((prev) =>
                  e.target.checked
                    ? [...prev, e.target.value]
                    : prev.filter((v) => v !== e.target.value),
                )
              }
            />
            <p>選択中：{genres.join(", ") || "なし"}</p>
          </Stack>
        </DemoSection>

        <DemoSection name="Switch" usage="押した瞬間に反映される設定">
          <Switch
            label="通知を受け取る"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </DemoSection>

        <DemoSection name="QuantityStepper" usage="数量の ±（min・max の端で押せなくなる）">
          <QuantityStepper label="数量" value={quantity} min={1} max={5} onChange={setQuantity} />
        </DemoSection>

        <DemoSection
          name="RatingField"
          usage="★ で評価を入力（中身はラジオボタン。← → キーでも選べる）"
        >
          <RatingField
            label="評価"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
          <p>選択中：{rating}点</p>
        </DemoSection>

        <DemoSection name="ImageField" usage="画像を選んでプレビュー。縮小した data URL で受け取る">
          <ImageField
            label="写真"
            value={image}
            onChange={setImage}
            hint="長い辺 800px の JPEG に縮小する"
          />
          {image && <p>data URL の長さ：{image.length.toLocaleString()} 文字</p>}
        </DemoSection>
      </Stack>
    </Container>
  );
};
