import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useParams } from "react-router";
import { EmptyState } from "@/shared/ui";
import { appNames, fsdLayerColors, fsdLayerDescriptions, fsdLayers, getAppUrl } from "../model/appLinks";
import { muiDocs } from "../model/muiDocs";
import { patternDocs } from "../model/patterns";
import { AppCodeExplorer } from "./AppCodeExplorer";
import { Demo } from "./Demo";
import { RichText } from "./RichText";
import { Section } from "./Section";

/**
 * 画面パターン1つ分のページ（/patterns/:slug）
 *
 *   見出し → 押さえどころ → 見本（1ファイル版）→ サンプルアプリでの作り（FSD の層ごとのファイル）→ 使っている部品
 */
export const PatternPage = () => {
  const { slug } = useParams();
  const pattern = patternDocs.find((item) => item.slug === slug);

  if (!pattern) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="画面パターンが見つかりません"
          description="URL を確認してください。"
          action={
            <Button component={RouterLink} to="/" variant="contained">
              はじめにへ
            </Button>
          }
        />
      </Container>
    );
  }

  const relatedDocs = muiDocs.filter((doc) => pattern.related.includes(doc.slug));

  return (
    // key に slug を渡し、別のパターンへ移ったら中の state（開いているファイルなど）をリセットする
    <Container key={pattern.slug} maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={5}>
        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <Chip label="画面パターン（CRUD）" size="small" color="primary" variant="outlined" />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {pattern.name}
          </Typography>
          <Typography color="text.secondary">{pattern.description}</Typography>
          <Button
            href={getAppUrl(pattern.app, pattern.appPath)}
            target="_blank"
            rel="noopener"
            variant="outlined"
            size="small"
            endIcon={<OpenInNewIcon />}
          >
            サンプルアプリ（{appNames[pattern.app]}）で動かす
          </Button>
        </Stack>

        <Section title="押さえどころ">
          <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1, lineHeight: 1.8 }}>
            {pattern.points.map((point) => (
              <li key={point}>
                <RichText text={point} />
              </li>
            ))}
          </Box>
        </Section>

        <Section title="見本（1ファイル版）">
          <Typography color="text.secondary">
            このカタログの中で動く見本。データは useState に持ち、1ファイルにまとめている。コードをコピーしてそのまま使える。
          </Typography>
          <Stack spacing={4}>
            {pattern.demos.map((demo) => (
              <Demo key={demo.file} title={demo.title} file={demo.file} />
            ))}
          </Stack>
        </Section>

        <Section title="サンプルアプリでの作り（FSD）">
          <Typography color="text.secondary">
            同じ UI を、サンプルアプリでは層に分けて作っている。左のファイルを選ぶとコードが出る。
          </Typography>
          {/* 層の凡例 */}
          <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 1.5, rowGap: 0.75, alignItems: "center" }}>
            {fsdLayers.map((layer) => (
              <Box key={layer} sx={{ display: "contents" }}>
                <Box component="dt">
                  <Chip size="small" variant="outlined" label={layer} color={fsdLayerColors[layer]} sx={{ fontFamily: "monospace" }} />
                </Box>
                <Typography component="dd" variant="body2" color="text.secondary" sx={{ m: 0 }}>
                  {fsdLayerDescriptions[layer]}
                </Typography>
              </Box>
            ))}
          </Box>
          <AppCodeExplorer files={pattern.files} />
        </Section>

        {relatedDocs.length > 0 && (
          <Section title="使っている部品">
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {relatedDocs.map((doc) => (
                <Chip key={doc.slug} label={doc.name} component={RouterLink} to={`/${doc.slug}`} clickable />
              ))}
            </Stack>
          </Section>
        )}
      </Stack>
    </Container>
  );
};
