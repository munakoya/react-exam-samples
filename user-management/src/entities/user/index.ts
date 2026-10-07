// entities/user の窓口（Public API）。外からはここ経由で読み込む
export {
  departmentLabels,
  departmentOptions,
  departments,
  userRoleLabels,
  userRoleOptions,
  userRoles,
  userSchema,
  type Department,
  type User,
  type UserInput,
  type UserRole,
} from "./model/user";
export { useUserStore } from "./model/userStore";
export { UserAvatar } from "./ui/UserAvatar";
export { UserCard } from "./ui/UserCard";
export { UserRoleChip, UserStatusChip } from "./ui/UserChips";
