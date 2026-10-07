import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { userSchema, type User, type UserInput } from "./user";

/**
 * ユーザー一覧の store（Zustand ＋ persist で localStorage に保存） ── entities/user/model
 *
 * 一覧（表・カード）・詳細・追加／編集のダイアログなど、離れた場所から同じ一覧を読み書きするので store にする。
 *
 *   const users = useUserStore((state) => state.users);
 *   const removeUsers = useUserStore((state) => state.removeUsers);
 *
 * ⚠ セレクターの中で filter・sort しない（毎回新しい配列になり、無限に再描画される）。
 *   users を選んでから、画面側で絞り込む。
 */

type UserState = {
  users: User[];
};

type UserActions = {
  addUser: (input: UserInput) => void;
  updateUser: (id: string, input: UserInput) => void;
  /** 有効・無効だけを切り替える（表のスイッチ・一括操作から）。ids は1件でも配列で渡す */
  setActive: (ids: string[], active: boolean) => void;
  /** まとめて削除（1件だけでも配列で渡す） */
  removeUsers: (ids: string[]) => void;
};

// 動かしてすぐ表やカードを試せるように、最初から何件か入れておく（試験では [] から始めてよい）
const now = new Date().toISOString();
const seedUsers: User[] = [
  { id: "u1", name: "佐藤 花子", email: "hanako.sato@example.com", role: "admin", department: "general", active: true, joinedAt: "2019-04-01", createdAt: now, updatedAt: now },
  { id: "u2", name: "鈴木 一郎", email: "ichiro.suzuki@example.com", role: "editor", department: "development", active: true, joinedAt: "2021-10-01", createdAt: now, updatedAt: now },
  { id: "u3", name: "高橋 美咲", email: "misaki.takahashi@example.com", role: "viewer", department: "sales", active: false, joinedAt: "2023-04-01", createdAt: now, updatedAt: now },
  { id: "u4", name: "田中 健太", email: "kenta.tanaka@example.com", role: "editor", department: "sales", active: true, joinedAt: "2022-07-15", createdAt: now, updatedAt: now },
  { id: "u5", name: "伊藤 さくら", email: "sakura.ito@example.com", role: "viewer", department: "hr", active: true, joinedAt: "2024-04-01", createdAt: now, updatedAt: now },
  { id: "u6", name: "渡辺 大輔", email: "daisuke.watanabe@example.com", role: "viewer", department: "development", active: true, joinedAt: "2025-01-06", createdAt: now, updatedAt: now },
];

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      users: seedUsers,

      addUser: (input) => {
        const now = new Date().toISOString();
        const user: User = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
        set((state) => ({ users: [user, ...state.users] }));
      },

      // id が一致するものだけ差し替える（map で新しい配列を作る）
      updateUser: (id, input) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...input, updatedAt: new Date().toISOString() } : user,
          ),
        })),

      setActive: (ids, active) =>
        set((state) => ({
          users: state.users.map((user) =>
            ids.includes(user.id) ? { ...user, active, updatedAt: new Date().toISOString() } : user,
          ),
        })),

      removeUsers: (ids) => set((state) => ({ users: state.users.filter((user) => !ids.includes(user.id)) })),
    }),
    {
      name: storageKey("users"), // localStorage のキー → "user-management:users"
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users }), // action（関数）は保存しない
      version: 1,
      // 読み込んだデータを zod でチェックし、形が崩れていれば使わない
      merge: mergeWithSchema(z.object({ users: z.array(userSchema) })),
    },
  ),
);
