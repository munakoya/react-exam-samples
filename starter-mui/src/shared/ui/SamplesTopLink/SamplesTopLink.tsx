import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

/**
 * 「← サンプル集」へ戻るリンク（GitHub Pages の公開ページ用） ── shared/ui
 *
 * 公開ページではアプリが /react-exam-samples/library/ のような場所に置かれる（import.meta.env.BASE_URL）。
 * その 1 つ上（/react-exam-samples/）がサンプル集のトップなので、そこへのリンクを出す。
 * 手元（npm run dev）では BASE_URL が "/" なので、何も出さない。
 *
 * 試験で作るアプリには要らない部品。
 *
 *   <AppShell title="蔵書管理" navItems={navItems} headerRight={<SamplesTopLink />}>
 */

const baseUrl = import.meta.env.BASE_URL;
// "/react-exam-samples/library/" → "/react-exam-samples/"（最後のフォルダを取る）
const samplesTopUrl = baseUrl === "/" ? null : baseUrl.replace(/[^/]+\/$/, "");

export const SamplesTopLink = () => {
  if (!samplesTopUrl) return null;

  return (
    // アプリの外へ出るので、component={RouterLink} ではなく href（普通のリンク）
    <Button color="inherit" size="small" href={samplesTopUrl} startIcon={<ArrowBackIcon />} sx={{ flexShrink: 0 }}>
      {/* スマホでは矢印だけにする（文字は読み上げ用に残す） */}
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        サンプル集
      </Box>
      <Box component="span" sx={{ display: { xs: "inline", sm: "none" }, position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        サンプル集へ戻る
      </Box>
    </Button>
  );
};
