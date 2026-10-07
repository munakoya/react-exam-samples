import { z } from "zod";

/**
 * ユーザーの型と選択肢 ── entities/user/model
 *
 * 選択肢（権限・部署）は「値の配列」「表示名」「選択肢の配列」の3点セットで用意すると、
 * 型・表示（Chip）・フォーム（セレクト）・絞り込みのすべてで同じものを使い回せる。
 */

// ---------- 権限 ----------

export const userRoles = ["admin", "editor", "viewer"] as const;
export type UserRole = (typeof userRoles)[number]; // "admin" | "editor" | "viewer"

export const userRoleLabels: Record<UserRole, string> = {
  admin: "管理者",
  editor: "編集者",
  viewer: "閲覧者",
};

export const userRoleOptions = userRoles.map((value) => ({ value, label: userRoleLabels[value] }));

// ---------- 部署 ----------

export const departments = ["sales", "development", "hr", "general"] as const;
export type Department = (typeof departments)[number];

export const departmentLabels: Record<Department, string> = {
  sales: "営業部",
  development: "開発部",
  hr: "人事部",
  general: "総務部",
};

export const departmentOptions = departments.map((value) => ({ value, label: departmentLabels[value] }));

// ---------- ユーザー本体 ----------

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(userRoles),
  department: z.enum(departments),
  /** 有効（ログインできる）かどうか */
  active: z.boolean(),
  /** 入社日 "YYYY-MM-DD" */
  joinedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

/** 登録・更新でフォームから受け取る値（id・日時は store で付ける） */
export type UserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
