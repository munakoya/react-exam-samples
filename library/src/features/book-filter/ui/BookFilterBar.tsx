import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { bookGenreOptions, bookGenres } from "@/entities/book";
import { availabilities, availabilityOptions } from "@/entities/loan";
import { isFiltering, type BookFilter } from "../model/bookFilter";

/**
 * 本の一覧の絞り込み（キーワード・ジャンル・状態） ── features/book-filter/ui
 *
 * 条件の値は持たず、外（ページ）から受け取る。変えたい値だけを onChange で伝える。
 *
 *   const { filter, updateFilter, resetFilter } = useBookFilter();
 *   <BookFilterBar filter={filter} onChange={updateFilter} onReset={resetFilter} />
 */

type BookFilterBarProps = {
  filter: BookFilter;
  onChange: (changes: Partial<BookFilter>) => void;
  onReset: () => void;
};

// 「すべて」＋ 各選択肢
const statusOptions = [{ value: "all", label: "すべて" }, ...availabilityOptions] as const;

export const BookFilterBar = ({ filter, onChange, onReset }: BookFilterBarProps) => {
  return (
    // direction：スマホは縦に積み、600px 以上は横に並べる
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      useFlexGap
      sx={{ flexWrap: "wrap", alignItems: { xs: "stretch", sm: "center" } }}
    >
      <TextField
        type="search"
        label="キーワード"
        placeholder="タイトル・著者・タグ"
        size="small"
        value={filter.q}
        onChange={(event) => onChange({ q: event.target.value })}
        sx={{ minWidth: { sm: 260 } }}
        // 入力欄の左に虫めがね。v9 では slotProps.input に書く（古い InputProps は使えない）
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
        label="ジャンル"
        size="small"
        value={filter.genre}
        // event.target.value は string。選択肢のどれかかを確かめてから渡す
        onChange={(event) =>
          onChange({ genre: bookGenres.find((genre) => genre === event.target.value) ?? "all" })
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="all">すべて</MenuItem>
        {bookGenreOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {/* exclusive：1つだけ選べる。選択中をもう一度押すと null が届くので無視する */}
      <ToggleButtonGroup
        exclusive
        size="small"
        value={filter.status}
        onChange={(_event, value: string | null) => {
          if (value === null) return;
          onChange({ status: availabilities.find((status) => status === value) ?? "all" });
        }}
        aria-label="状態で絞り込む"
      >
        {statusOptions.map((option) => (
          <ToggleButton key={option.value} value={option.value} sx={{ px: 1.5 }}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {isFiltering(filter) && (
        <Button onClick={onReset} sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}>
          条件をクリア
        </Button>
      )}
    </Stack>
  );
};
