import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import Grid from "@mui/material/Grid";
import { StatCard } from "@/shared/ui";

// Grid で並べる：スマホ 1列・600px〜 3列。数字は store の値から計算して渡す
export default function StatCardBasic() {
  const overdueCount = 2;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard label="蔵書" value={14} unit="冊" icon={<LibraryBooksOutlinedIcon />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard label="貸出中" value={5} unit="冊" icon={<OutboxOutlinedIcon />} color="primary" caption="うち3日以内に期限 1冊" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        {/* 0件のときは color を渡さず、目立たせない */}
        <StatCard
          label="期限切れ"
          value={overdueCount}
          unit="冊"
          icon={<ErrorOutlinedIcon />}
          color={overdueCount > 0 ? "error" : undefined}
          to="/stat-card" // to を渡すとカード全体がリンクになる
        />
      </Grid>
    </Grid>
  );
}
