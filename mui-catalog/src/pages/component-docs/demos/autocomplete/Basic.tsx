import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type Prefecture = { code: string; name: string };

const prefectures: Prefecture[] = [
  { code: "01", name: "北海道" },
  { code: "04", name: "宮城県" },
  { code: "13", name: "東京都" },
  { code: "14", name: "神奈川県" },
  { code: "23", name: "愛知県" },
  { code: "26", name: "京都府" },
  { code: "27", name: "大阪府" },
  { code: "40", name: "福岡県" },
  { code: "47", name: "沖縄県" },
];

// 入力した文字で候補を絞り込めるセレクト。選択肢が多いときに使う。
// 入力欄そのものは renderInput で TextField を返して作る
export default function AutocompleteBasic() {
  const [value, setValue] = useState<Prefecture | null>(null);

  return (
    <>
      <Autocomplete
        options={prefectures}
        value={value}
        onChange={(_event, newValue) => setValue(newValue)} // 選んだ「オブジェクト」が入る（未選択は null）
        getOptionLabel={(option) => option.name} // 候補・入力欄に出す文字
        isOptionEqualToValue={(option, selected) => option.code === selected.code} // 同じものかの判定
        noOptionsText="見つかりません"
        renderInput={(params) => <TextField {...params} label="都道府県" />}
        sx={{ maxWidth: 360 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        選択中：{value ? `${value.name}（コード ${value.code}）` : "なし"}
      </Typography>
    </>
  );
}
