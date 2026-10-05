import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { categoryLabels, useTransactionStore, type Transaction } from "@/entities/transaction";
import { formatDate, formatYen } from "@/shared/lib";
import { ConfirmDialog, notify } from "@/shared/ui";

/**
 * 削除ボタン（ゴミ箱のアイコン） ＋ 確認ダイアログ ── features/delete-transaction/ui
 *
 *   <DeleteTransactionButton transaction={transaction} />
 */
export const DeleteTransactionButton = ({ transaction }: { transaction: Transaction }) => {
  const [open, setOpen] = useState(false);
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);
  // 確認の文に使う「10/05 食費 ￥1,200」
  const summary = `${formatDate(transaction.date)} ${categoryLabels[transaction.category]} ${formatYen(transaction.amount)}`;

  const handleConfirm = () => {
    setOpen(false);
    removeTransaction(transaction.id);
    notify("記録を削除しました");
  };

  return (
    <>
      <Tooltip title="削除">
        <IconButton color="error" aria-label={`${summary} を削除`} onClick={() => setOpen(true)}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`${summary} の記録を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
