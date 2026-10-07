import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { DataTable, EmptyState, type DataTableColumn } from "@/shared/ui";

const roleLabels = { admin: "管理者", editor: "編集者", viewer: "閲覧者" } as const;
type Role = keyof typeof roleLabels;
type Member = { id: string; name: string; email: string; role: Role };

const members: Member[] = [
  { id: "1", name: "佐藤 花子", email: "hanako@example.com", role: "admin" },
  { id: "2", name: "鈴木 一郎", email: "ichiro@example.com", role: "editor" },
  { id: "3", name: "高橋 美咲", email: "misaki@example.com", role: "viewer" },
  { id: "4", name: "田中 健太", email: "kenta@example.com", role: "editor" },
];

const columns: DataTableColumn<Member>[] = [
  { key: "name", label: "名前", render: (m) => m.name, sortValue: (m) => m.name },
  { key: "email", label: "メール", render: (m) => m.email },
  { key: "role", label: "権限", render: (m) => roleLabels[m.role] },
];

// 見本では useState で持つ。アプリでは URL（useSearchParams）に持つと、再読み込みしても条件が残る
export default function SearchFilterBasic() {
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<Role | "all">("all");
  const [view, setView] = useState<"table" | "card">("table");

  // 絞り込んだ結果は state にせず、表示のたびに計算する
  const normalized = keyword.trim().toLowerCase();
  const visibleMembers = members.filter(
    (m) =>
      (role === "all" || m.role === role) &&
      (m.name.toLowerCase().includes(normalized) || m.email.toLowerCase().includes(normalized)),
  );

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          type="search"
          size="small"
          label="名前・メールで検索"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          sx={{ flexGrow: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          size="small"
          label="権限"
          value={role}
          onChange={(event) => setRole(event.target.value as Role | "all")}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">すべて</MenuItem>
          {Object.entries(roleLabels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        {/* exclusive：1つだけ選ぶ。選択中をもう一度押すと null が来るので、そのときは変えない */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_event, next: "table" | "card" | null) => next && setView(next)}
          aria-label="表示の切り替え"
        >
          <ToggleButton value="table" aria-label="表で表示">
            <TableRowsOutlinedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="card" aria-label="カードで表示">
            <GridViewIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {visibleMembers.length === 0 ? (
        <EmptyState title="条件に合うメンバーはいません" description="検索のことばや権限を変えてください。" />
      ) : view === "table" ? (
        <DataTable ariaLabel="メンバー一覧" rows={visibleMembers} columns={columns} />
      ) : (
        <Grid container spacing={2}>
          {visibleMembers.map((m) => (
            <Grid key={m.id} size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontWeight: 700 }}>{m.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {m.email}・{roleLabels[m.role]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
