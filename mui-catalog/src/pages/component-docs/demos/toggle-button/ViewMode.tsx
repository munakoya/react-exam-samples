import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type ViewMode = "list" | "grid";

// アイコンだけのときは、ToggleButton ごとに aria-label を付ける
export default function ToggleButtonViewMode() {
  const [view, setView] = useState<ViewMode>("list");

  return (
    <>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_event, next: ViewMode | null) => {
          if (next !== null) setView(next);
        }}
        aria-label="表示の形式"
      >
        <ToggleButton value="list" aria-label="リスト表示">
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="grid" aria-label="グリッド表示">
          <GridViewIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" sx={{ mt: 1 }}>
        今の表示：{view === "list" ? "リスト" : "グリッド"}
      </Typography>
    </>
  );
}
