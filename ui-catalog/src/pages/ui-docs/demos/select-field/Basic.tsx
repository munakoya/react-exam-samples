import { useState } from "react";
import { SelectField } from "@/shared/ui";

// 選択肢は { value, label } の配列で渡す。先頭に「選択してください」（value=""）が入る
const options = [
  { value: "food", label: "食品" },
  { value: "daily", label: "日用品" },
  { value: "stationery", label: "文房具" },
];

export default function SelectFieldBasic() {
  const [category, setCategory] = useState("");

  return (
    <SelectField
      label="カテゴリ"
      options={options}
      value={category}
      onChange={(event) => setCategory(event.target.value)}
      error={category === "" ? "カテゴリを選択してください" : undefined}
    />
  );
}
