import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router";

// パンくずリスト。リンクは component={RouterLink} で React Router のリンクにする（ページを再読み込みしない）。
// 今いるページはリンクにせず、Typography で表示する
export default function BreadcrumbsBasic() {
  return (
    <Breadcrumbs aria-label="パンくずリスト" separator={<NavigateNextIcon fontSize="small" />}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        MUI 部品
      </Link>
      <Link component={RouterLink} to="/link" underline="hover" color="inherit">
        Link
      </Link>
      <Typography sx={{ color: "text.primary" }} aria-current="page">
        Breadcrumbs
      </Typography>
    </Breadcrumbs>
  );
}
