import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

// underline で下線の出し方を選ぶ。別タブで開くリンクには rel="noopener" を付ける
export default function LinkBasic() {
  return (
    <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: "wrap" }}>
      <Link href="#" underline="always">
        always（初期値）
      </Link>
      <Link href="#" underline="hover">
        hover
      </Link>
      <Link href="#" underline="none">
        none
      </Link>
      <Link href="https://mui.com/material-ui/" target="_blank" rel="noopener">
        MUI 公式サイト（別タブ）
      </Link>
    </Stack>
  );
}
