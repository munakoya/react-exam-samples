import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/**
 * 「− 3 ＋」の形で数量を増減する部品 ── shared/ui
 *
 * 値は持たず、親から value を受け取り、変更後の値を onChange で伝える（制御コンポーネント）。
 *
 *   <QuantityStepper label="りんごの数量" value={quantity} min={1} max={stock} onChange={setQuantity} />
 */

type QuantityStepperProps = {
  /** 読み上げ用の名前（何の数量か） */
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export const QuantityStepper = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  disabled = false,
}: QuantityStepperProps) => {
  return (
    // role="group" と aria-label で、3つの要素が「〇〇の数量」のまとまりだと伝える
    <Stack direction="row" role="group" aria-label={label} sx={{ alignItems: "center" }}>
      <IconButton
        size="small"
        aria-label="1つ減らす"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      {/* minWidth で、桁数が変わってもボタンの位置がずれないようにする */}
      <Typography sx={{ minWidth: 32, textAlign: "center" }} aria-live="polite">
        {value}
      </Typography>
      <IconButton
        size="small"
        aria-label="1つ増やす"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};
