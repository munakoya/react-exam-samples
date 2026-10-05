import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

// open で開閉する。onClose は Esc キー・背景のクリックで呼ばれる。
// 中は DialogTitle・DialogContent・DialogActions の3つに分ける
export default function DialogBasic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        利用規約を表示
      </Button>
      {/* maxWidth で最大幅、fullWidth でその幅まで広げる */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>利用規約</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このサービスを使う前に、以下の内容を確認してください。中身が長いときは、DialogContent の中だけがスクロールする。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>閉じる</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            同意する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
