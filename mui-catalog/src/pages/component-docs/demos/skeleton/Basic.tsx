import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState } from "react";

// 読み込み中に、中身と同じ形の灰色の枠を出す。読み込み後にレイアウトがずれにくい
export default function SkeletonBasic() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <FormControlLabel
        control={<Switch checked={loading} onChange={(event) => setLoading(event.target.checked)} />}
        label="読み込み中"
      />
      <Card sx={{ maxWidth: 360, mt: 1 }}>
        <CardHeader
          avatar={loading ? <Skeleton variant="circular" width={40} height={40} /> : <Avatar>佐</Avatar>}
          title={loading ? <Skeleton variant="text" width="60%" /> : "佐藤 花子"}
          subheader={loading ? <Skeleton variant="text" width="40%" /> : "5分前"}
        />
        {loading ? (
          // variant="rectangular"：四角（画像の場所など）
          <Skeleton variant="rectangular" height={120} />
        ) : (
          <CardContent sx={{ height: 120 }}>
            <Typography variant="body2">読み込みが終わると、本物の中身に入れ替わる。</Typography>
          </CardContent>
        )}
      </Card>
    </>
  );
}
