# 5. ダイアログ・通知・メニュー

> [目次](README.md) ｜ 前：[4. 一覧の見せ方](04-data-display.md) ｜ 次：[6. 画面パターン集](06-page-patterns.md)

## 5-1. どれを使うか

| 伝えたいこと・やりたいこと                     | 部品                                   | 消え方                       |
| ---------------------------------------------- | -------------------------------------- | ---------------------------- |
| 取り消せない操作の前の確認（削除）             | `ConfirmDialog`（Dialog）              | ボタンを押すまで残る         |
| 少ない項目の入力（貸出・入出庫・コメント）     | `Dialog` ＋ フォーム                   | 送信・キャンセルで閉じる     |
| 操作の結果（登録しました）                     | 通知（`Snackbar` ＋ `Alert`）          | 数秒で自動で消える           |
| ずっと見せておく注意（期限切れ・在庫切れ）     | `Alert`                                | 消えない（`onClose` で × も）|
| ボタン・アイコンの説明、押せない理由           | `Tooltip`                              | マウスを外すと消える         |
| 行ごとの操作がたくさんある                     | `Menu`（︙ のボタン）                  | 選ぶ・外側を押すと閉じる     |
| 画面の端から出す絞り込み・メニュー             | `Drawer`                               | 背景を押すと閉じる           |

## 5-2. Dialog の基本

```tsx
const [open, setOpen] = useState(false);

<Button variant="outlined" onClick={() => setOpen(true)}>利用規約</Button>
<Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth> {/* onClose：Esc・背景のクリック */}
  <DialogTitle>利用規約</DialogTitle>                                     {/* 見出し（aria-labelledby は自動） */}
  <DialogContent>
    <DialogContentText>…</DialogContentText>                             {/* 長いと、ここだけスクロール */}
  </DialogContent>
  <DialogActions>                                                         {/* 右下のボタン */}
    <Button onClick={() => setOpen(false)}>閉じる</Button>
    <Button variant="contained" onClick={handleAgree}>同意する</Button>
  </DialogActions>
</Dialog>
```

| やりたいこと                     | 書き方                                                                 |
| -------------------------------- | ---------------------------------------------------------------------- |
| 幅を決める                       | `maxWidth="xs"`（444px）〜`"lg"` ＋ `fullWidth`                        |
| スマホでは全画面                 | `fullScreen={!useMediaQuery(theme.breakpoints.up("sm"))}`              |
| Esc・背景のクリックで閉じさせない | `onClose={(_e, reason) => { if (reason !== "backdropClick") close(); }}` |
| 閉じた後に何かする（リセット）   | `slotProps={{ transition: { onExited: () => reset() } }}`              |

フォームを載せる形は [3-7](03-forms.md#3-7-ダイアログの中のフォーム)。

## 5-3. 確認ダイアログ（削除）

ボタン ＋ 確認 ＋ 実行 ＋ 通知 を 1 つの部品（features）にすると、一覧でも詳細でも同じ動きになる。

```tsx
export const DeleteItemButton = ({ item, onDeleted }: { item: Item; onDeleted?: () => void }) => {
  const [open, setOpen] = useState(false); // ダイアログの開閉はこのボタンの中だけ
  const removeItem = useItemStore((state) => state.removeItem);

  const handleConfirm = () => {
    setOpen(false);
    onDeleted?.(); // 詳細ページなら先に一覧へ移動（「見つかりません」が一瞬出ないように）
    removeItem(item.id);
    notify(`「${item.name}」を削除しました`);
  };

  return (
    <>
      <IconButton color="error" aria-label={`「${item.name}」を削除`} onClick={() => setOpen(true)}>
        <DeleteOutlinedIcon />
      </IconButton>
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${item.name}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
```

一覧の 1 か所にダイアログを置き、「どれを消すか」を state に持つ書き方もある：

```tsx
const [target, setTarget] = useState<Item | null>(null);
// 各行：<IconButton onClick={() => setTarget(item)}>
<ConfirmDialog open={target !== null} message={target ? `「${target.name}」を削除します` : ""} onConfirm={…} onCancel={() => setTarget(null)} />
```

## 5-4. 通知（Snackbar）

### その場で出す

```tsx
const [message, setMessage] = useState<{ text: string; severity: AlertColor } | null>(null);

<Snackbar
  open={message !== null}
  autoHideDuration={3000} // 3 秒で onClose が呼ばれる
  onClose={(_e, reason) => { if (reason !== "clickaway") setMessage(null); }} // ほかを押しただけでは閉じない
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert severity={message?.severity} variant="filled" onClose={() => setMessage(null)} sx={{ width: "100%" }}>
    {message?.text}
  </Alert>
</Snackbar>
```

### どこからでも出す（Zustand の store）

画面ごとに Snackbar を置くのは手間なので、**通知の中身を store に置き、表示する部品をアプリに 1 つだけ置く**。

```ts
// shared/ui/Notifier/notifierStore.ts
export const useNotifierStore = create<NotifierStore>()((set) => ({
  notification: null,
  open: false,
  show: (message, severity = "success") => set({ notification: { id: Date.now(), message, severity }, open: true }),
  close: () => set({ open: false }), // 文言は残す（閉じるアニメーションの間に消えて見えないように）
}));

export const notify = (message: string, severity: AlertColor = "success") =>
  useNotifierStore.getState().show(message, severity); // React の外からも呼べる
```

```tsx
// AppProviders に 1 つだけ
<Notifier />

// 使う側
notify("「坊っちゃん」を登録しました");
notify("保存に失敗しました", "error");
```

Context（`useToast()`）で作ってもよいが、Zustand なら Provider が要らず、ふつうの関数からも呼べる。
中身は [Notifier](../../_shared/mui-ui/Notifier/)・[カタログ](https://munakoya.github.io/react-exam-samples/mui-catalog/notifier)。

## 5-5. Alert

```tsx
<Alert severity="error">返却期限を 6 日過ぎています。</Alert>         {/* success / info / warning / error */}
<Alert severity="warning" variant="outlined">在庫が残りわずかです</Alert>
<Alert severity="error" action={<Button color="inherit" size="small" onClick={retry}>再読み込み</Button>}>
  <AlertTitle>読み込みに失敗しました</AlertTitle>
  通信を確認してください。
</Alert>
```

## 5-6. Tooltip

```tsx
<Tooltip title="編集">
  <IconButton aria-label="編集"><EditOutlinedIcon /></IconButton> {/* Tooltip は読み上げの代わりにならない。aria-label も付ける */}
</Tooltip>

{/* 押せない理由を出す：disabled のボタンはマウスの動きを受け取らないので <span> で包む */}
<Tooltip title={onLoan ? "貸出中の本は削除できません" : ""}> {/* title が "" なら出ない */}
  <span>
    <Button disabled={onLoan}>削除</Button>
  </span>
</Tooltip>
```

## 5-7. Menu（︙ の操作メニュー）

```tsx
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // どの要素の下に出すか。null なら閉じている

<IconButton aria-label="操作メニュー" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
  <MoreVertIcon />
</IconButton>
<Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={() => setAnchorEl(null)}>
  <MenuItem onClick={() => { setAnchorEl(null); navigate(`/items/${item.id}/edit`); }}>編集</MenuItem>
  <MenuItem onClick={() => { setAnchorEl(null); setDeleteOpen(true); }} sx={{ color: "error.main" }}>削除</MenuItem>
</Menu>
```

## 5-8. Drawer（端から出すパネル）

```tsx
<Button startIcon={<FilterListIcon />} onClick={() => setOpen(true)}>絞り込み</Button>
<Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
  <Box sx={{ width: 300, p: 2 }}>
    {/* 絞り込みの入力欄 */}
  </Box>
</Drawer>
```

スマホで絞り込みの項目が多いときに使う。PC では一覧の上に並べる方が見やすい。

---

> 次：[6. 画面パターン集](06-page-patterns.md)
