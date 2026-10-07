import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PageHeader } from "@/shared/ui";

/**
 * トップ（/） ── pages/home/ui
 *
 * 雛形が動いているかを確かめるための仮のページ。
 * 一覧ページを作ったら、App.tsx で "/" を一覧へ飛ばす（<Navigate to="/items" replace />）か、
 * ダッシュボードに作り変えて、このファイル（pages/home）は消してよい。
 */

// やることの順番（docs/03-build.md の流れと同じ）
const steps = [
  "entities：型（zod）・選択肢・store を作る（src/entities/README.md）",
  "pages：一覧ページを作り、App.tsx と RootLayout.tsx のメニューに足す（src/pages/README.md）",
  "features：追加・編集のダイアログ、削除ボタン（src/features/README.md）",
  "widgets：一覧の表・カードに、操作のボタンを差し込む（src/widgets/README.md）",
  "詳細ページ・絞り込み・発展機能 → 0件・見つからない の表示、スマホ幅",
];

export const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="雛形が動いています" description="MUI・テーマ・ルーティング・共通の枠・shared/ui の部品まで用意済み。" />

        <Alert severity="info">
          まず 4 か所を変える：<code>package.json</code> の name・<code>index.html</code> の title・
          <code>shared/config/storage.ts</code> の STORAGE_PREFIX・<code>RootLayout.tsx</code> の title とメニュー。
        </Alert>

        <Box>
          <Typography variant="h6" component="h2" gutterBottom>
            次にやること
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: 3, lineHeight: 2 }}>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};
