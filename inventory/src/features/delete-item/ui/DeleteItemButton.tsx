import { useState } from "react";
import { useItemStore, type Item } from "@/entities/item";
import { useStockMovementStore } from "@/entities/stock-movement";
import { Button, ConfirmDialog, useToast } from "@/shared/ui";

/**
 * 「削除」ボタン ＋ 確認ダイアログ ── features/delete-item/ui
 *
 * features には「ユーザーの操作（〜する）」を1つずつ置く。
 * 削除ボタンを押す → 確認ダイアログ → store から削除 → 通知、までをこの部品が持つので、
 * 一覧でも詳細でも <DeleteItemButton item={item} /> と書くだけで同じ動きになる。
 *
 * 使い方:
 *   <DeleteItemButton item={item} />
 *   <DeleteItemButton item={item} onDeleted={() => navigate("/items")} />   // 削除後にページを移動
 */

type DeleteItemButtonProps = {
  item: Item;
  size?: "sm" | "md";
  /** 削除した後に呼ばれる（詳細ページから一覧へ戻るときなど） */
  onDeleted?: () => void;
};

export const DeleteItemButton = ({ item, size = "md", onDeleted }: DeleteItemButtonProps) => {
  // ダイアログの開閉は、このボタンの中だけで使うので useState で持つ（store に入れない）
  const [open, setOpen] = useState(false);
  const removeItem = useItemStore((state) => state.removeItem);
  const removeMovementsByItem = useStockMovementStore((state) => state.removeMovementsByItem);
  const toast = useToast();

  const handleConfirm = () => {
    setOpen(false);
    // 先にページを移動してから消す（詳細ページで「見つかりません」が一瞬出ないように）
    onDeleted?.();
    removeItem(item.id);
    removeMovementsByItem(item.id); // 商品と一緒に、その商品の入出庫の履歴も消す
    toast.show(`「${item.name}」を削除しました`, "success");
  };

  return (
    <>
      <Button
        variant="danger"
        size={size}
        onClick={() => setOpen(true)}
        aria-label={`「${item.name}」を削除`} // 一覧に同じ「削除」が並ぶので、どれの削除かを読み上げで伝える
      >
        削除
      </Button>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${item.name}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
