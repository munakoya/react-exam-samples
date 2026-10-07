import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import { docBooks, docUrl } from "@/entities/doc";
import { SearchField } from "@/features/doc-search";
import { PAGES_URL } from "@/shared/config";
import { PageHeader } from "@/shared/ui";

/**
 * トップ（/）：検索・試験中によく見るところ・読みものの一覧 ── pages/home/ui
 */

type QuickLink = { title: string; description: string } & ({ to: string } | { href: string });

// 試験中によく見るところ。to はこのアプリの中、href は別のアプリ（カタログ・サンプル）
const quickLinks: QuickLink[] = [
  { title: "試験の実装手順（チェックリスト）", description: "雛形から始めて提出まで。ステップごとに作るファイル・やること・終わりの確認", to: "/exam-steps" },
  { title: "3. 機能を作る（ステップ 1〜9）", description: "型と store → 一覧 → 追加 → 編集 → 削除 → 詳細 → 絞り込み → 発展", to: "/exam-steps/03-build" },
  { title: "MUI 版の雛形（starter-mui）", description: "npx degit でコピーして 4 か所変えるだけ。書き方は各フォルダの README", to: "/samples/starter-mui" },
  { title: "MUI 部品カタログ", description: "部品ごとの書き方・動く見本・コードのコピー", href: `${PAGES_URL}/mui-catalog/` },
  { title: "やりたいこと → 部品・sx の早見表", description: "MUI 画面構築ガイドの目次。v9 で変わった書き方も", to: "/mui-guide" },
  { title: "画面パターン集", description: "一覧・詳細・登録・ダッシュボードの型、お題ごとの部品の選び方", to: "/mui-guide/06-page-patterns" },
  { title: "フォーム（RHF ＋ zod ＋ MUI）", description: "入力の種類ごとのつなぎ方（Controller）・ダイアログのフォーム", to: "/mui-guide/03-forms" },
  { title: "ライブラリの使い方", description: "React・React Router・Zustand・zod・React Hook Form・MUI", to: "/library/04-libraries" },
  { title: "モダン JavaScript / TypeScript", description: "スプレッド・?.・??・配列・Map・Set・日付・URL・型", to: "/library/03-modern-js" },
  { title: "設計の考え方", description: "画面・データ・操作の書き出し、状態の置き場所、FSD の層", to: "/library/02-design" },
  { title: "環境構築", description: "Vite・パッケージ・テーマ・Provider・ルーティングをコピーして始める", to: "/library/01-setup" },
  { title: "よくあるバグと直し方", description: "React・RHF ＋ MUI・MUI v9 のエラーと直し方", to: "/library/06-thinking#6-3-よくあるバグと直し方" },
  { title: "提出前のチェックリスト", description: "機能・見た目・コード・提出物の確認、README の書き方", to: "/library/06-thinking#6-5-提出前のチェックリスト" },
  { title: "蔵書管理（MUI 版）を動かす", description: "一覧・詳細・登録・貸出の完成形。「サンプルデータを入れる」で試せる", href: `${PAGES_URL}/library/` },
  { title: "タスク管理（MUI 版）を動かす", description: "ダイアログのフォーム・かんばんボード。CSS 版との違いは README に", href: `${PAGES_URL}/task-manager-mui/` },
  { title: "ユーザー管理（MUI 版）を動かす", description: "追加・編集モーダル、削除の確認、チェックボックスで選べる表、カード表示", href: `${PAGES_URL}/user-management/` },
  { title: "CRUD の画面パターン（MUI 部品カタログ）", description: "よく出る UI の 1 ファイル版の見本と、サンプルアプリのコード（FSD）を並べて見る", href: `${PAGES_URL}/mui-catalog/patterns/crud-overview` },
  { title: "家計簿（MUI 版）を動かす", description: "1 ページの小さな形。月の合計・カテゴリ別の内訳・予算", href: `${PAGES_URL}/household-budget/` },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault(); // ページの再読み込みを止める
    if (query.trim() !== "") navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={5}>
        <PageHeader
          title="解説書・ガイド"
          description="React 試験対策サンプル集の読みもの。ライブラリ・モダン JS・設計と実装の考え方・MUI での画面の組み立て方を、検索して読める。"
        />

        <Box component="form" onSubmit={handleSearch} role="search">
          <SearchField value={query} onChange={setQuery} />
        </Box>

        {/* ----- 試験中によく見るところ ----- */}
        <Stack component="section" spacing={2}>
          <Typography variant="h6" component="h2">
            試験中によく見るところ
          </Typography>
          <Grid container spacing={2}>
            {quickLinks.map((link) => (
              <Grid key={link.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: "100%" }}>
                  {/* to はアプリの中（RouterLink）、href は別のアプリ（別タブ） */}
                  <CardActionArea
                    {...("to" in link
                      ? { component: RouterLink, to: link.to }
                      : { href: link.href, target: "_blank", rel: "noopener" })}
                    sx={{ height: "100%", alignItems: "flex-start" }}
                  >
                    <CardContent>
                      <Typography sx={{ fontWeight: 700, color: "primary.main", display: "flex", alignItems: "center", gap: 0.5 }}>
                        {link.title}
                        {"href" in link && <OpenInNewIcon sx={{ fontSize: 16 }} aria-label="別のタブで開く" />}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* ----- 読みものの一覧 ----- */}
        <Stack component="section" spacing={2}>
          <Typography variant="h6" component="h2">
            読みもの
          </Typography>
          <Grid container spacing={2}>
            {docBooks.map((book) => (
              <Grid key={book.id} size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Link component={RouterLink} to={`/${book.id}`} variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {book.title}
                    </Link>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {book.description}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                      {book.docs
                        .filter((doc) => doc.slug !== "") // 目次は上のタイトルのリンク
                        .map((doc) => (
                          <li key={doc.path}>
                            <Link component={RouterLink} to={docUrl(doc)} variant="body2">
                              {doc.title}
                            </Link>
                          </li>
                        ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
};
