import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { userRoleOptions } from "@/entities/user";
import { useUserFilter, type RoleFilter } from "../model/useUserFilter";

/**
 * 検索欄 ＋ 権限の絞り込み ── features/user-filter/ui
 *
 * 値は URL に入っている（useUserFilter）。ここでは入力欄と URL をつなぐだけ。
 * React Hook Form は使わない（送信ボタンがなく、入力のたびにすぐ反映するため）。
 */
export const UserFilterBar = () => {
  const { keyword, role, setKeyword, setRole } = useUserFilter();

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ flexGrow: 1 }}>
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
        onChange={(event) => setRole(event.target.value as RoleFilter)}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="all">すべて</MenuItem>
        {userRoleOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};
