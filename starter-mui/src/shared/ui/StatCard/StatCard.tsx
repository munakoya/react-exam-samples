import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";

/**
 * 集計の数字を大きく見せるカード（ダッシュボード） ── shared/ui
 *
 *   <Grid container spacing={2}>
 *     <Grid size={{ xs: 12, sm: 4 }}>
 *       <StatCard label="貸出中" value={3} unit="冊" icon={<OutboxIcon />} to="/loans" />
 *     </Grid>
 *   </Grid>
 *
 * to を渡すと、カード全体がリンクになる。
 */

type StatCardProps = {
  label: string;
  value: number | string;
  /** 数字の後ろに小さく出す単位（"冊"・"件" など） */
  unit?: string;
  icon?: ReactNode;
  /** 数字の色（"error" で赤など）。theme の palette の名前 */
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  /** 補足（"3日以内に期限" など） */
  caption?: string;
  /** 渡すとカード全体がリンクになる */
  to?: string;
};

export const StatCard = ({ label, value, unit, icon, color, caption, to }: StatCardProps) => {
  const content = (
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {/* アイコンの色も数字にそろえる。color がなければ灰色 */}
        <Box sx={{ color: color ? `${color}.main` : "action.active", display: "flex" }}>{icon}</Box>
      </Box>
      <Typography
        component="p"
        variant="h4"
        sx={{ fontWeight: 700, color: color ? `${color}.main` : "text.primary", mt: 1 }}
      >
        {value}
        {unit && (
          <Typography component="span" variant="body1" sx={{ ml: 0.5, color: "text.secondary" }}>
            {unit}
          </Typography>
        )}
      </Typography>
      {caption && (
        <Typography variant="caption" color="text.secondary">
          {caption}
        </Typography>
      )}
    </CardContent>
  );

  return (
    <Card sx={{ height: "100%" }}>
      {to ? (
        // CardActionArea を RouterLink にすると、カード全体が押せるリンクになる
        <CardActionArea component={RouterLink} to={to} sx={{ height: "100%" }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};
