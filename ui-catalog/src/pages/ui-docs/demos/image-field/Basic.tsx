import { useState } from "react";
import { ImageField } from "@/shared/ui";

// 選んだ画像は縮小して「data URL」（文字列）で受け取る。そのまま store に入れて localStorage に保存できる
export default function ImageFieldBasic() {
  const [image, setImage] = useState("");

  return (
    <>
      <ImageField
        label="写真"
        value={image}
        onChange={setImage}
        hint="長い辺 800px の JPEG に縮小して保存します"
      />
      {image && <p>data URL の長さ：{image.length.toLocaleString()} 文字</p>}
    </>
  );
}
