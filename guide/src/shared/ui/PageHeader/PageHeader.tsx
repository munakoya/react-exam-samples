import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";

/**
 * ページの見出し（パンくず・タイトル・説明・右側の操作） ── shared/ui
 *
 *   <PageHeader
 *     title="本の一覧"
 *     description="登録した本は localStorage に保存されます"
 *     breadcrumbs={[{ label: "本の一覧", to: "/books" }, { label: "詳細" }]}
 *     action={<Button variant="contained">登録</Button>}
 *   />
 *
 * タイトルは <h1>（見た目は h5）。1ページに1つだけ置く。
 */

export type BreadcrumbItem = {
  label: string;
  /** 省略すると今のページ（リンクにしない） */
  to?: string;
};

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  /** 右側に置く要素（ボタンなど）。狭い画面では下へ折り返す */
  action?: ReactNode;
};

export const PageHeader = ({ title, description, breadcrumbs, action }: PageHeaderProps) => {
  return (
    <Stack spacing={1}>
      {breadcrumbs && (
        <Breadcrumbs aria-label="パンくずリスト" separator={<NavigateNextIcon fontSize="small" />}>
          {breadcrumbs.map((item) =>
            item.to ? (
              // component={RouterLink}：ページを再読み込みせずに移動するリンクにする
              <Link
                key={item.label}
                component={RouterLink}
                to={item.to}
                underline="hover"
                color="inherit"
              >
                {item.label}
              </Link>
            ) : (
              <Typography key={item.label} sx={{ color: "text.primary" }} aria-current="page">
                {item.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // 狭い画面ではボタンを下へ折り返す
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {/* variant は見た目、component は HTML のタグ。h5 の見た目で <h1> を出す */}
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    </Stack>
  );
};
