import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import { useUserStore, type User } from "@/entities/user";
import { notify } from "@/shared/ui";

/**
 * 有効・無効をその場で切り替えるスイッチ（表の1行に置く） ── features/change-user-status/ui
 *
 * フォームを開かずに1項目だけ変える操作。ダイアログは出さず、すぐに保存して通知だけ出す。
 */
export const UserActiveSwitch = ({ user }: { user: User }) => {
  const setActive = useUserStore((state) => state.setActive);

  return (
    <Tooltip title={user.active ? "無効にする" : "有効にする"}>
      <Switch
        size="small"
        checked={user.active}
        onChange={(event) => {
          setActive([user.id], event.target.checked);
          notify(`「${user.name}」を${event.target.checked ? "有効" : "無効"}にしました`, "info");
        }}
        slotProps={{ input: { "aria-label": `「${user.name}」の有効・無効` } }}
      />
    </Tooltip>
  );
};
