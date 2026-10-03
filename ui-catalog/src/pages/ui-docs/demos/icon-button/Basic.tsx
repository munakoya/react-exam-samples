import { IconButton, Stack } from "@/shared/ui";

// label は必須（読み上げ用の名前。マウスを乗せたときの説明にもなる）。
// 中身は記号・絵文字のほか、SVG のアイコンも渡せる
export default function IconButtonBasic() {
  return (
    <Stack direction="row" gap={2} align="center">
      <IconButton label="閉じる">×</IconButton>
      <IconButton label="編集" variant="secondary">
        ✎
      </IconButton>
      <IconButton label="削除" variant="danger">
        🗑
      </IconButton>
      <IconButton label="小さいボタン" size="sm">
        ＋
      </IconButton>
      <IconButton label="検索">
        {/* SVG のアイコン。currentColor でボタンの文字色に合わせる */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </IconButton>
    </Stack>
  );
}
