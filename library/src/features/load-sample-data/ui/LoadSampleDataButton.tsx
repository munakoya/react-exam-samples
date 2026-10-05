import Button from "@mui/material/Button";
import { useBookStore } from "@/entities/book";
import { useLoanStore } from "@/entities/loan";
import { todayString } from "@/shared/lib";
import { notify } from "@/shared/ui";
import { createSampleData } from "../model/sampleData";

/**
 * 「サンプルデータを入れる」ボタン ── features/load-sample-data/ui
 *
 * 本が1冊もないときだけ、ダッシュボードの案内に出す。
 * お題の要件ではない（動作確認用）。試験で作るときは不要。
 */
export const LoadSampleDataButton = () => {
  const addBooks = useBookStore((state) => state.addBooks);
  const addLoans = useLoanStore((state) => state.addLoans);

  const handleClick = () => {
    const { books, loans } = createSampleData(todayString());
    addBooks(books);
    addLoans(loans);
    notify(`サンプルデータ（本 ${books.length}冊・貸出 ${loans.length}件）を入れました`, "info");
  };

  return <Button onClick={handleClick}>サンプルデータを入れる</Button>;
};
