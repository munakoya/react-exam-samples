import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// Card の中を CardHeader（見出し）・CardContent（本文）・CardActions（ボタン）に分けて組み立てる
export default function CardBasic() {
  return (
    <Card sx={{ maxWidth: 360 }}>
      <CardHeader
        title="週次ミーティング"
        subheader="2026年10月7日 10:00"
        action={
          <IconButton aria-label="操作メニュー">
            <MoreVertIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          今週の進み具合と、来週の予定を共有する。資料は前日までに共有フォルダへ置く。
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">詳細</Button>
        <Button size="small" color="error">
          削除
        </Button>
      </CardActions>
    </Card>
  );
}
