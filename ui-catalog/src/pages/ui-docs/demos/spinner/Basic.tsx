import { Spinner } from "@/shared/ui";

// 読み込み中に表示する。label は画面に出ず、読み上げだけされる
//   if (isPending) return <Spinner />;
export default function SpinnerBasic() {
  return <Spinner label="商品を読み込み中" />;
}
