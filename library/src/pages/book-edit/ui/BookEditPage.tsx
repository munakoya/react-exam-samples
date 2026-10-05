import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { useBook, useBookStore } from "@/entities/book";
import { BookForm, toFormInput, type BookFormValues } from "@/features/book-form";
import { EmptyState, notify, PageHeader } from "@/shared/ui";

/**
 * 本の編集ページ（/books/:bookId/edit） ── pages/book-edit/ui
 *
 * 登録ページとの違いは2つだけ:
 *   - フォームの初期値に今の値を入れる（toFormInput(book)）
 *   - 送信したら addBook ではなく updateBook を呼ぶ
 */
export const BookEditPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const book = useBook(bookId);
  const updateBook = useBookStore((state) => state.updateBook);

  if (!book) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="本が見つかりません"
          description="削除されたか、URL が間違っている可能性があります。"
          action={
            <Button component={RouterLink} to="/books">
              本の一覧へ戻る
            </Button>
          }
        />
      </Container>
    );
  }

  const handleSubmit = (values: BookFormValues) => {
    updateBook(book.id, values);
    notify(`「${values.title}」を更新しました`);
    navigate(`/books/${book.id}`); // 詳細ページへ戻る
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title="本を編集"
          description={book.title}
          breadcrumbs={[
            { label: "本の一覧", to: "/books" },
            { label: book.title, to: `/books/${book.id}` },
            { label: "編集" },
          ]}
        />
        <Card>
          <CardContent>
            {/*
              defaultValues はフォームを作った最初の1回だけ使われる。
              key に id を渡すと、別の本の編集ページへ移ったときにフォームが作り直され、初期値が入れ替わる
            */}
            <BookForm
              key={book.id}
              defaultValues={toFormInput(book)}
              submitLabel="更新"
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/books/${book.id}`)}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};
