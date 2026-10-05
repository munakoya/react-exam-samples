import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

// Paper は白い面（背景は theme の background.paper）。
// elevation で影の強さ（0〜24）、variant="outlined" で影の代わりに枠線にする
export default function PaperBasic() {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
      <Paper elevation={0} sx={{ p: 2 }}>
        elevation=0
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        elevation=1
      </Paper>
      <Paper elevation={4} sx={{ p: 2 }}>
        elevation=4
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        variant="outlined"
      </Paper>
    </Stack>
  );
}
