import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useParams } from "react-router";
import { EmptyState } from "@/shared/ui";
import { getMuiImportCode, muiDocs } from "../model/muiDocs";
import { patternDocs } from "../model/patterns";
import { docUsages } from "../model/usages";
import { getSharedUiFiles } from "../model/sources";
import { AppCodeExplorer } from "./AppCodeExplorer";
import { CodeBlock } from "./CodeBlock";
import { Demo } from "./Demo";
import { PropsTable } from "./PropsTable";
import { RichText } from "./RichText";
import { Section } from "./Section";
import { SourceTabs } from "./SourceTabs";

/**
 * 部品1つ分のページ（/:slug）
 *
 *   見出し → インポート → 押さえどころ → 見本（プレビュー＋コード）→ サンプルアプリでの使用例 → props →（自作部品なら）ソース
 */

const propsNoteForMui = "よく使う props だけを載せている。すべての props は公式ドキュメントの API ページを見る。";

export const ComponentDocPage = () => {
  const { slug } = useParams();
  const doc = muiDocs.find((item) => item.slug === slug);

  if (!doc) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="部品が見つかりません"
          description="URL を確認してください。"
          action={
            <Button component={RouterLink} to="/" variant="contained">
              部品の一覧へ
            </Button>
          }
        />
      </Container>
    );
  }

  // MUI の部品なら「全部の props は公式を見る」の一文を足す
  const propsNote = [doc.propsNote, doc.sharedUi ? undefined : propsNoteForMui].filter(Boolean).join(" ");
  // この部品を使っている画面パターン
  const patterns = patternDocs.filter((pattern) => pattern.related.includes(doc.slug));
  const usages = docUsages[doc.slug];

  return (
    // key に slug を渡し、別の部品へ移ったら中の state（開いているコードなど）をリセットする
    <Container key={doc.slug} maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={5}>
        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <Chip label={doc.category} size="small" />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {doc.name}
          </Typography>
          <Typography color="text.secondary">{doc.description}</Typography>
          {doc.docsUrl && (
            <Link href={doc.docsUrl} target="_blank" rel="noopener" variant="body2" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
              公式ドキュメント（英語）を開く
              <OpenInNewIcon sx={{ fontSize: 16 }} />
            </Link>
          )}
        </Stack>

        <Section title="インポート">
          <CodeBlock code={getMuiImportCode(doc)} />
        </Section>

        <Section title="押さえどころ">
          <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1, lineHeight: 1.8 }}>
            {doc.points.map((point) => (
              <li key={point}>
                <RichText text={point} />
              </li>
            ))}
          </Box>
        </Section>

        <Section title="見本">
          {doc.demos.length === 0 ? (
            <Alert severity="info">このカタログの枠（ヘッダー・左のメニュー）が、この部品の見本になっている。</Alert>
          ) : (
            <Stack spacing={4}>
              {doc.demos.map((demo) => (
                <Demo key={demo.file} title={demo.title} file={demo.file} />
              ))}
            </Stack>
          )}
        </Section>

        {(usages || patterns.length > 0) && (
          <Section title="サンプルアプリでの使用例">
            {patterns.length > 0 && (
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  この部品を使う画面パターン：
                </Typography>
                {patterns.map((pattern) => (
                  <Chip
                    key={pattern.slug}
                    label={pattern.shortName}
                    component={RouterLink}
                    to={`/patterns/${pattern.slug}`}
                    clickable
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            )}
            {usages && (
              <>
                <Typography color="text.secondary">
                  サンプルアプリの中で実際に使っているところ。左のファイルを選ぶとコードが出る（FSD のどの層に置いたかも分かる）。
                </Typography>
                <AppCodeExplorer files={usages} />
              </>
            )}
          </Section>
        )}

        <Section title="Props">
          <PropsTable props={doc.props} note={propsNote} />
        </Section>

        {doc.sharedUi && (
          <Section title="ソースコード">
            <Typography color="text.secondary">
              MUI の部品を組み合わせて作った自作部品。フォルダごと <RichText text="`src/shared/ui/`" /> にコピーし、
              <RichText text="`index.ts`" /> から export すれば、別のプロジェクトでも使える。
            </Typography>
            <SourceTabs files={getSharedUiFiles(doc.name)} />
          </Section>
        )}
      </Stack>
    </Container>
  );
};
