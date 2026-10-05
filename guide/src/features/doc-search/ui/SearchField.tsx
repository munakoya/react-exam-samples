import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

/**
 * 検索の入力欄 ── features/doc-search/ui
 *
 *   <SearchField value={query} onChange={setQuery} autoFocus />
 */

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

export const SearchField = ({ value, onChange, autoFocus }: SearchFieldProps) => {
  return (
    <TextField
      type="search"
      label="読みものを検索"
      placeholder="例：useWatch・期限切れ・slotProps・persist（スペースで区切ると AND）"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoFocus={autoFocus}
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
