import { useState } from "react";
import { CheckboxGroup } from "@/shared/ui";

const genres = [
  { value: "novel", label: "小説" },
  { value: "business", label: "ビジネス" },
  { value: "comic", label: "漫画" },
];

// useState で持つときは、value に選ばれている値の配列を渡し、onChange で足し引きする
export default function CheckboxGroupBasic() {
  const [selected, setSelected] = useState<string[]>(["novel"]);

  return (
    <>
      <CheckboxGroup
        label="好きなジャンル"
        direction="row"
        options={genres}
        value={selected}
        onChange={(event) =>
          setSelected(
            (prev) =>
              event.target.checked
                ? [...prev, event.target.value] // チェックしたら足す
                : prev.filter((v) => v !== event.target.value), // 外したら抜く
          )
        }
      />
      <p>選択中：{selected.join(", ") || "なし"}</p>
    </>
  );
}
