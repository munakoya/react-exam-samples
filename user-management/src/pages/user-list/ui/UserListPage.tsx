import AddIcon from "@mui/icons-material/Add";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useSearchParams } from "react-router";
import { useUserStore, type User } from "@/entities/user";
import { UserFormDialog } from "@/features/user-form";
import { filterUsers, UserFilterBar, useUserFilter } from "@/features/user-filter";
import { EmptyState, PageHeader, useFormDialog } from "@/shared/ui";
import { UserCardGrid } from "@/widgets/user-card-grid";
import { UserTable } from "@/widgets/user-table";

/**
 * ユーザー一覧ページ（/users） ── pages/user-list/ui
 *
 *   ┌ ユーザー一覧                         [＋ 追加] ┐ ← 追加ボタン → 追加ダイアログ
 *   │ [検索______________] [権限▼]   [表|カード] │ ← 絞り込み（features/user-filter）・表示の切り替え
 *   │ ┌ 2件選択中     [有効][無効][削除] ┐        │ ← 選択したときだけ出る帯
 *   │ │☐ 名前        権限  部署 … 操作  │        │
 *   │ │☑ 佐藤 花子    管理者 …   ✎ 🗑  │        │ ← ✎ → 編集ダイアログ、🗑 → 確認ダイアログ
 *   │ └──────────────────────┘        │
 *   └──────────────────────────┘
 *
 * ページの役目は「組み立て」と「ダイアログの開閉」。中身の処理は features・widgets にある。
 * 追加・編集のダイアログは1つだけ置き、useFormDialog で「追加」か「どれの編集」かを切り替える。
 */

type ViewMode = "table" | "card";

export const UserListPage = () => {
  const users = useUserStore((state) => state.users);
  const { keyword, role } = useUserFilter();
  const dialog = useFormDialog<User>();

  // 表とカードの切り替えも URL（?view=card）に入れる。再読み込みしても同じ表示になる
  const [searchParams, setSearchParams] = useSearchParams();
  const view: ViewMode = searchParams.get("view") === "card" ? "card" : "table";
  const changeView = (next: ViewMode) =>
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === "table") params.delete("view");
        else params.set("view", next);
        return params;
      },
      { replace: true },
    );

  // ----- users から計算できる値（state にしない） -----
  const visibleUsers = filterUsers(users, keyword, role);
  const activeCount = users.filter((user) => user.active).length;

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={dialog.openNew}>
      追加
    </Button>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title="ユーザー一覧"
          description={`全 ${users.length}人（有効 ${activeCount}人）。追加・編集はダイアログで行います`}
          action={addButton}
        />

        {users.length === 0 ? (
          <EmptyState title="ユーザーがいません" description="「追加」から最初のユーザーを登録しましょう。" action={addButton} />
        ) : (
          <>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
              <UserFilterBar />
              {/* exclusive：どれか1つだけ選ぶ。選択中をもう一度押すと null が来るので無視する */}
              <ToggleButtonGroup
                size="small"
                exclusive
                value={view}
                onChange={(_event, next: ViewMode | null) => next && changeView(next)}
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

            {visibleUsers.length === 0 ? (
              <EmptyState title="条件に合うユーザーはいません" description="検索のことばや権限を変えてください。" />
            ) : view === "table" ? (
              <UserTable users={visibleUsers} onEdit={dialog.openEdit} />
            ) : (
              <UserCardGrid users={visibleUsers} onEdit={dialog.openEdit} />
            )}
          </>
        )}
      </Stack>

      {/* 追加・編集で同じダイアログを使う。target が undefined なら追加 */}
      <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
    </Container>
  );
};
