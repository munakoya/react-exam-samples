import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/**
 * 0件・見つからないときの案内 ── shared/ui
 *
 *   {books.length === 0 ? (
 *     <EmptyState
 *       title="まだ本がありません"
 *       description="「本を登録」から追加してください。"
 *       action={<Button component={RouterLink} to="/books/new">本を登録</Button>}
 *     />
 *   ) : (
 *     <BookTable … />
 *   )}
 */

type EmptyStateProps = {
  title: string;
  description?: string;
  /** 次に取れる操作（追加ボタン・一覧へ戻るリンクなど） */
  action?: ReactNode;
  /** 上に出すアイコン。省略すると空の箱のアイコン */
  icon?: ReactNode;
};

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => {
  return (
    // sx：その場でスタイルを書く MUI の書き方。数値は theme の単位（p: 4 → 32px）
    <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderStyle: "dashed" }}>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        {icon ?? <InboxOutlinedIcon color="disabled" sx={{ fontSize: 48 }} />}
        <Typography variant="subtitle1" component="p" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {action && <Stack sx={{ pt: 1 }}>{action}</Stack>}
      </Stack>
    </Paper>
  );
};
