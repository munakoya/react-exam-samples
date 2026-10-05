import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import type { ReactNode } from "react";

const Item = ({ children }: { children: ReactNode }) => (
  <Paper variant="outlined" sx={{ p: 1.5, textAlign: "center" }}>
    {children}
  </Paper>
);

// 親に container、子に size を付ける。横幅を 12 等分し、size で「何マス使うか」を決める
export default function GridBasic() {
  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <Item>size=8</Item>
      </Grid>
      <Grid size={4}>
        <Item>size=4</Item>
      </Grid>
      <Grid size={4}>
        <Item>size=4</Item>
      </Grid>
      {/* "grow" は残りの幅をすべて使う */}
      <Grid size="grow">
        <Item>size="grow"（残り全部）</Item>
      </Grid>
    </Grid>
  );
}
