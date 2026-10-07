import Button from "@mui/material/Button";
import { useUserStore } from "@/entities/user";
import { notify } from "@/shared/ui";

/**
 * 選択したユーザーをまとめて有効・無効にするボタン ── features/change-user-status/ui
 *
 *   <ChangeUsersStatusButtons ids={selectedIds} />
 *
 * 取り消せる操作なので、確認ダイアログは出さない（削除のような取り消せない操作だけ確認する）。
 */
export const ChangeUsersStatusButtons = ({ ids }: { ids: string[] }) => {
  const setActive = useUserStore((state) => state.setActive);

  const handleClick = (active: boolean) => {
    setActive(ids, active);
    notify(`${ids.length}人を${active ? "有効" : "無効"}にしました`, "info");
  };

  return (
    <>
      <Button size="small" variant="outlined" onClick={() => handleClick(true)}>
        有効にする
      </Button>
      <Button size="small" variant="outlined" color="inherit" onClick={() => handleClick(false)}>
        無効にする
      </Button>
    </>
  );
};
