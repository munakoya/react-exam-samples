import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/** 見出し付きのまとまり（部品のページ・画面パターンのページで使う） */
export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Stack component="section" spacing={2}>
    <Typography variant="h6" component="h2" sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}>
      {title}
    </Typography>
    {children}
  </Stack>
);
