import { useState } from "react";
import type { Item } from "@/entities/item";
import { Button, Modal } from "@/shared/ui";
import { AdjustStockForm } from "./AdjustStockForm";

/**
 * 「入出庫」ボタン ＋ フォームのモーダル ── features/adjust-stock/ui
 *
 *   <AdjustStockButton item={item} size="sm" />
 *
 * モーダルを開いている間だけフォームを描画する（{open && <AdjustStockForm />}）。
 * 閉じるとフォームごと消えるので、次に開いたときは初期値・エラーなしの状態から始まる。
 * （task-manager では、フォームを残したまま開くたびに reset() する方法を使っている。どちらでもよい）
 */

type AdjustStockButtonProps = {
  item: Item;
  size?: "sm" | "md";
};

export const AdjustStockButton = ({ item, size = "md" }: AdjustStockButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size={size}
        onClick={() => setOpen(true)}
        aria-label={`「${item.name}」を入出庫`}
      >
        入出庫
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`入出庫：${item.name}`}>
        {open && <AdjustStockForm item={item} onDone={() => setOpen(false)} />}
      </Modal>
    </>
  );
};
