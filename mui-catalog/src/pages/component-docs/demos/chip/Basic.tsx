import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// 状態・カテゴリなどを示す小さなラベル。color と variant で見た目を変える
export default function ChipBasic() {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Chip label="未着手" />
        <Chip label="進行中" color="primary" />
        <Chip label="完了" color="success" icon={<CheckCircleIcon />} />
        <Chip label="期限切れ" color="error" />
        <Chip label="保留" color="warning" />
      </Stack>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Chip label="outlined" variant="outlined" />
        <Chip label="outlined" variant="outlined" color="primary" />
        <Chip label="small" size="small" />
        <Chip label="small" size="small" color="success" variant="outlined" />
      </Stack>
    </Stack>
  );
}
