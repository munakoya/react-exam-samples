import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { notify } from "@/shared/ui";

// <Notifier /> はアプリに1つ置いてある（app/providers/AppProviders.tsx）。
// あとは notify(文言, 色) を呼ぶだけ。Provider も useXxx() も要らない
export default function NotifierBasic() {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
      <Button variant="contained" onClick={() => notify("保存しました")}>
        成功
      </Button>
      <Button variant="outlined" onClick={() => notify("新しいお知らせがあります", "info")}>
        お知らせ
      </Button>
      <Button variant="outlined" color="warning" onClick={() => notify("在庫が残りわずかです", "warning")}>
        注意
      </Button>
      <Button variant="outlined" color="error" onClick={() => notify("保存に失敗しました", "error")}>
        エラー
      </Button>
    </Stack>
  );
}
