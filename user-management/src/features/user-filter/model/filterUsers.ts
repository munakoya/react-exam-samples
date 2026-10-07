import type { User } from "@/entities/user";
import type { RoleFilter } from "./useUserFilter";

/**
 * 条件に合うユーザーだけを返す ── features/user-filter/model
 *
 * 絞り込んだ結果は store に入れず、表示するたびにこの関数で計算する。
 * キーワードは名前・メールアドレスのどちらかに含まれていれば一致（大文字・小文字は区別しない）。
 */
export const filterUsers = (users: User[], keyword: string, role: RoleFilter) => {
  const normalized = keyword.trim().toLowerCase();
  return users.filter(
    (user) =>
      (role === "all" || user.role === role) &&
      (normalized === "" ||
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized)),
  );
};
