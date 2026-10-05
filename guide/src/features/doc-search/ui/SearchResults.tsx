import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router";
import { MAX_RESULTS, type SearchResult } from "../model/searchDocs";

/**
 * 検索結果の一覧。押すとその見出しへ飛ぶ ── features/doc-search/ui
 */
export const SearchResults = ({ results }: { results: SearchResult[] }) => {
  if (results.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        見つかりませんでした。別のことばで探してください。
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" aria-live="polite">
        {results.length >= MAX_RESULTS ? `${MAX_RESULTS}件以上` : `${results.length}件`}
      </Typography>
      <Paper variant="outlined">
        <List disablePadding>
          {results.map((result) => (
            <ListItem key={result.to} disablePadding divider>
              <ListItemButton component={RouterLink} to={result.to}>
                <ListItemText
                  primary={result.heading}
                  secondary={
                    <>
                      <Typography component="span" variant="caption" sx={{ display: "block", color: "primary.main" }}>
                        {result.bookTitle} › {result.docTitle}
                      </Typography>
                      {result.snippet}
                    </>
                  }
                  slotProps={{ primary: { sx: { fontWeight: 700 } } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
};
