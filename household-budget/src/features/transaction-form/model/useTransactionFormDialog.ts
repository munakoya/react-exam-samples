import { useState } from "react";
import type { Transaction } from "@/entities/transaction";

/**
 * 記録のダイアログの開閉と「どの記録を編集中か」を持つフック ── features/transaction-form/model
 *
 *   const dialog = useTransactionFormDialog();
 *   <Button onClick={dialog.openNew}>記録する</Button>
 *   <TransactionTable onEdit={dialog.openEdit} />
 *   <TransactionFormDialog open={dialog.open} transaction={dialog.transaction} onClose={dialog.close} />
 */
export const useTransactionFormDialog = () => {
  const [open, setOpen] = useState(false);
  // undefined なら「追加」、Transaction が入っていれば「編集」
  const [transaction, setTransaction] = useState<Transaction>();

  return {
    open,
    transaction,
    openNew: () => {
      setTransaction(undefined);
      setOpen(true);
    },
    openEdit: (target: Transaction) => {
      setTransaction(target);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
};
