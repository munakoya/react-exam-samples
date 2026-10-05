import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Link as RouterLink, useLocation, useParams } from "react-router";
import { docUrl, findBook, findDoc, getToc, MarkdownView } from "@/entities/doc";
import { REPO_URL } from "@/shared/config";
import { EmptyState } from "@/shared/ui";

/**
 * 読みもの1つ分のページ（/:bookId/:slug） ── pages/doc/ui
 *
 *   左：本文（Markdown）／ 右：このページの目次（900px 以上だけ）
 *   下：前の章・次の章
 */
export const DocPage = () => {
  const { bookId, slug } = useParams<{ bookId: string; slug?: string }>();
  const { hash } = useLocation();
  const book = findBook(bookId);
  const doc = findDoc(bookId, slug);

  // ページや # が変わったら、その見出しへ（なければページの上へ）スクロールする。
  // 画面（DOM）の外の状態と合わせる処理なので useEffect に書く
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [doc, hash]);

  if (!book || !doc) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="ページが見つかりません"
          action={
            <Button component={RouterLink} to="/" variant="contained">
              トップへ
            </Button>
          }
        />
      </Container>
    );
  }

  const index = book.docs.indexOf(doc);
  const prev = book.docs[index - 1];
  const next = book.docs[index + 1];
  const toc = getToc(doc);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={4}>
        {/* ----- 本文 ----- */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
            <Breadcrumbs aria-label="パンくずリスト">
              <Link component={RouterLink} to="/" underline="hover" color="inherit">
                トップ
              </Link>
              {doc.slug === "" ? (
                <Typography sx={{ color: "text.primary" }} aria-current="page">
                  {book.title}
                </Typography>
              ) : (
                <Link component={RouterLink} to={`/${book.id}`} underline="hover" color="inherit">
                  {book.title}
                </Link>
              )}
            </Breadcrumbs>
            <Button
              size="small"
              href={`${REPO_URL}/blob/main/${doc.path}`}
              target="_blank"
              rel="noopener"
              startIcon={<GitHubIcon />}
            >
              GitHub で見る
            </Button>
          </Stack>

          <MarkdownView markdown={doc.markdown} path={doc.path} />

          {/* ----- 前の章・次の章 ----- */}
          <Divider sx={{ my: 4 }} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
            {prev ? (
              <Button component={RouterLink} to={docUrl(prev)} startIcon={<ArrowBackIcon />} sx={{ justifyContent: "flex-start" }}>
                {prev.title}
              </Button>
            ) : (
              <span />
            )}
            {next && (
              <Button component={RouterLink} to={docUrl(next)} endIcon={<ArrowForwardIcon />} sx={{ justifyContent: "flex-end" }}>
                {next.title}
              </Button>
            )}
          </Stack>
        </Grid>

        {/* ----- このページの目次（PC だけ。スクロールしても画面に残す） ----- */}
        <Grid size={{ md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
          {toc.length > 0 && (
            <Box
              component="nav"
              aria-label="このページの目次"
              sx={{ position: "sticky", top: 88, maxHeight: "calc(100dvh - 104px)", overflowY: "auto" }}
            >
              <Typography variant="overline" color="text.secondary">
                このページの目次
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                {toc.map((section) => (
                  <Box component="li" key={section.id} sx={{ pl: section.depth === 3 ? 1.5 : 0, py: 0.25 }}>
                    <Link href={`#${section.id}`} variant="body2" underline="hover" color={section.depth === 3 ? "text.secondary" : "inherit"}>
                      {section.heading}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
