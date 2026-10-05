import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router";
import { useBookStore } from "@/entities/book";
import { BookForm, toFormInput, type BookFormValues } from "@/features/book-form";
import { notify, PageHeader } from "@/shared/ui";

/**
 * 本の登録ページ（/books/new） ── pages/book-new/ui
 *
 * フォーム（features/book-form）は入力とチェックだけを担当する。
 * チェックを通った値を受け取り、store に保存して、通知を出し、ページを移動するのはページの役目。
 */
export const BookNewPage = () => {
  const navigate = useNavigate();
  const addBook = useBookStore((state) => state.addBook);

  const handleSubmit = (values: BookFormValues) => {
    const created = addBook(values); // persist によって localStorage にも自動で保存される
    notify(`「${created.title}」を登録しました`);
    navigate(`/books/${created.id}`); // 登録した本の詳細ページへ
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader
          title="本を登録"
          breadcrumbs={[{ label: "本の一覧", to: "/books" }, { label: "本を登録" }]}
        />
        <Card>
          <CardContent>
            <BookForm
              defaultValues={toFormInput()} // 空欄から始める
              submitLabel="登録"
              onSubmit={handleSubmit}
              onCancel={() => navigate("/books")}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};
