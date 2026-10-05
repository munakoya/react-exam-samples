import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// color は theme の palette の名前。削除などの危険な操作は "error" にする
export default function ButtonColorsAndSizes() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Button variant="contained" color="primary">
          primary
        </Button>
        <Button variant="contained" color="secondary">
          secondary
        </Button>
        <Button variant="contained" color="success">
          success
        </Button>
        <Button variant="contained" color="error">
          error
        </Button>
        <Button variant="outlined" color="inherit">
          inherit
        </Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Button variant="outlined" size="small">
          small
        </Button>
        <Button variant="outlined" size="medium">
          medium
        </Button>
        <Button variant="outlined" size="large">
          large
        </Button>
      </Stack>
      {/* fullWidth：親の幅いっぱいに広げる（スマホのフォームなど） */}
      <Button variant="contained" fullWidth>
        fullWidth
      </Button>
    </Stack>
  );
}
