import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { ConfirmDialog, EmptyState, notify } from "@/shared/ui";

type Member = { id: string; name: string };

const initialMembers: Member[] = [
  { id: "1", name: "佐藤 花子" },
  { id: "2", name: "鈴木 一郎" },
  { id: "3", name: "高橋 美咲" },
  { id: "4", name: "田中 健太" },
];

// 「どれを消すか」を state に持って確認ダイアログを開く。
// 1件の削除も、まとめて削除も「消すものの配列」にすると、ダイアログ1つで両方に使える
export default function DeleteConfirmBasic() {
  const [members, setMembers] = useState(initialMembers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  // 閉じても中身を残す（閉じるアニメーションの間にメッセージが変わって見えないように）
  const [targets, setTargets] = useState<Member[]>([]);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const openConfirm = (list: Member[]) => {
    setTargets(list);
    setOpen(true);
  };

  const handleConfirm = () => {
    const ids = targets.map((m) => m.id);
    setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    notify(`${targets.length}人を削除しました`);
    setOpen(false);
  };

  // 確認メッセージ：1件なら名前、複数なら件数
  const message =
    targets.length === 1
      ? `「${targets[0].name}」を削除します。この操作は取り消せません。`
      : `選択した ${targets.length}人 をまとめて削除します。この操作は取り消せません。`;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Button onClick={() => setMembers(initialMembers)} disabled={members.length === initialMembers.length}>
          元に戻す（見本用）
        </Button>
        <Button
          color="error"
          variant="contained"
          startIcon={<DeleteOutlinedIcon />}
          disabled={selectedIds.length === 0}
          onClick={() => openConfirm(members.filter((m) => selectedIds.includes(m.id)))}
        >
          選択した {selectedIds.length}人を削除
        </Button>
      </Stack>

      {members.length === 0 ? (
        <EmptyState title="メンバーがいません" />
      ) : (
        <Paper variant="outlined">
          <List dense>
            {members.map((member) => (
              <ListItem
                key={member.id}
                divider
                secondaryAction={
                  <Tooltip title="削除">
                    {/* アイコンだけのボタンは aria-label で「何の削除か」を伝える */}
                    <IconButton edge="end" color="error" aria-label={`「${member.name}」を削除`} onClick={() => openConfirm([member])}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedIds.includes(member.id)}
                    onChange={() => toggle(member.id)}
                    slotProps={{ input: { "aria-label": `${member.name} を選択` } }}
                  />
                </ListItemIcon>
                <ListItemText primary={member.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={message}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </Stack>
  );
}
