import { z } from "zod";
import { departments, userRoles, type User } from "@/entities/user";

/**
 * ユーザーの追加・編集フォームの入力チェック ── features/user-form/model
 *
 * メールアドレスの重複チェックには「ほかのユーザーのメールアドレス」が要るので、
 * スキーマを関数で作り、引数で受け取る（編集のときは自分自身を除いて渡す）。
 */
export const createUserFormSchema = (otherEmails: string[]) =>
  z.object({
    name: z.string().trim().min(1, "名前を入力してください").max(30, "30文字以内で入力してください"),
    // pipe：前のチェック（空欄でないか）を通ったら、次のチェック（メールの形か）へ渡す
    email: z
      .string()
      .trim()
      .min(1, "メールアドレスを入力してください")
      .pipe(z.email("メールアドレスの形式が正しくありません"))
      // refine：zod の決まったチェックにない条件を、true / false を返す関数で書く
      .refine((email) => !otherEmails.includes(email), "このメールアドレスは登録済みです"),
    role: z.enum(userRoles),
    department: z.enum(departments),
    active: z.boolean(),
    joinedAt: z.iso.date("入社日を入力してください"),
  });

type UserFormSchema = ReturnType<typeof createUserFormSchema>;
export type UserFormInput = z.input<UserFormSchema>;
export type UserFormValues = z.output<UserFormSchema>;

/** フォームの初期値。user を渡せば編集用（今の値）、なければ追加用 */
export const toFormInput = (user?: User): UserFormInput => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  role: user?.role ?? "viewer",
  department: user?.department ?? "sales",
  active: user?.active ?? true,
  joinedAt: user?.joinedAt ?? "",
});
