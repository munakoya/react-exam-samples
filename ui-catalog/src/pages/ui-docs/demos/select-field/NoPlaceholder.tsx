import { useState } from "react";
import { SelectField } from "@/shared/ui";

type SortKey = "new" | "price-asc" | "price-desc";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "new", label: "新しい順" },
  { value: "price-asc", label: "価格の安い順" },
  { value: "price-desc", label: "価格の高い順" },
];

// 並び替えのように「必ずどれかを選んでいる」ときは、placeholder={false} で「選択してください」を消す
export default function SelectFieldNoPlaceholder() {
  const [sort, setSort] = useState<SortKey>("new");

  return (
    <SelectField
      label="並び順"
      options={sortOptions}
      placeholder={false}
      value={sort}
      // e.target.value は string なので、選択肢の型に合わせる
      onChange={(event) => setSort(event.target.value as SortKey)}
    />
  );
}
