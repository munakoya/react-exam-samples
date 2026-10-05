import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState } from "react";

const items = Array.from({ length: 23 }, (_, index) => `お知らせ ${index + 1}`);
const PER_PAGE = 5;

// count（全ページ数）・page（今のページ。1 から数える）・onChange を渡す。
// 表示する分は slice で切り出す
export default function PaginationBasic() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(items.length / PER_PAGE);
  const visibleItems = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Stack spacing={2} sx={{ alignItems: "center" }}>
      <List dense sx={{ width: "100%" }}>
        {visibleItems.map((item) => (
          <ListItem key={item} divider>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
      {/* onChange の第2引数に、押されたページ番号が入る */}
      <Pagination count={pageCount} page={page} onChange={(_event, value) => setPage(value)} color="primary" />
    </Stack>
  );
}
