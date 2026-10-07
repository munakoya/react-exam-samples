import { useSearchParams } from "react-router";
import { userRoles, type UserRole } from "@/entities/user";

/**
 * 一覧の絞り込み条件を URL（?q=佐藤&role=admin）で持つフック ── features/user-filter/model
 *
 * URL に入れると、再読み込み・戻る・URL の共有でも条件が残る。
 * 値は文字列なので、決まった値（権限）は includes で確かめてから使う。
 */

export type RoleFilter = UserRole | "all";

const isUserRole = (value: string | null): value is UserRole =>
  userRoles.some((role) => role === value);

export const useUserFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("q") ?? "";
  const roleParam = searchParams.get("role");
  const role: RoleFilter = isUserRole(roleParam) ? roleParam : "all";

  // ほかの値（表示の切り替え view など）を消さないように、今の URL をコピーしてから1つだけ変える
  const update = (name: string, value: string) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "" || value === "all") next.delete(name);
        else next.set(name, value);
        return next;
      },
      { replace: true }, // 1文字ごとに履歴を増やさない
    );

  return {
    keyword,
    role,
    setKeyword: (value: string) => update("q", value),
    setRole: (value: RoleFilter) => update("role", value),
  };
};
