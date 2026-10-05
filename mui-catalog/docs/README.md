# MUI 画面構築ガイド

> [MUI 部品カタログ](../README.md)・[サンプル集の目次](../../README.md)

Material UI（`@mui/material` v9）で、試験に出るような業務アプリの画面を組み立てるための読みもの。
部品 1 つずつの使い方は [MUI 部品カタログ](https://munakoya.github.io/react-exam-samples/mui-catalog/)（動く見本・コードのコピー）、
ライブラリと組み合わせた完成形は [蔵書管理（library）](../../library/) を見る。

## 章

| 章                                               | 内容                                                                          | こんなときに読む                          |
| ------------------------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------- |
| [1. 土台：導入・テーマ・sx](01-basics.md)        | インストール、テーマ、`sx` の書き方、import、アイコン、レスポンシブ、v9 の注意 | 最初に 1 回。sx の書き方を忘れたとき      |
| [2. レイアウト](02-layout.md)                    | アプリの枠、ページの骨組み、Container・Stack・Grid・Box・Card の使い分け      | 画面の形を作るとき                        |
| [3. フォーム](03-forms.md)                       | React Hook Form ＋ zod ＋ MUI。部品ごとのつなぎ方、ページとダイアログのフォーム | 入力画面を作るとき                        |
| [4. 一覧の見せ方](04-data-display.md)            | 表（並び替え・ページ送り・行の操作）、カード、リスト、状態のラベル、検索バー、0 件 | 一覧画面を作るとき                        |
| [5. ダイアログ・通知・メニュー](05-feedback.md)  | Dialog・確認ダイアログ・通知（Snackbar）・Alert・Tooltip・Menu・Drawer        | 操作の確認・結果の知らせ方を決めるとき    |
| [6. 画面パターン集](06-page-patterns.md)         | 一覧・詳細・登録/編集・ダッシュボード・タブの画面の型と、お題ごとの部品の選び方 | お題を見て「どう組むか」を決めるとき      |

## 試験中にすぐ見る表

### やりたいこと → 部品

| やりたいこと                           | 部品                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| ページの幅を決めて中央に寄せる         | `Container maxWidth="lg"`                                                    |
| 縦・横に並べて間隔をそろえる           | `Stack spacing={2}`・`Stack direction="row"`                                 |
| カードを 1〜4 列に並べる               | `Grid container` ＋ `Grid size={{ xs: 12, sm: 6, md: 3 }}`                    |
| ちょっとした余白・背景・枠線           | `Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}`                    |
| ヘッダー ＋ サイドメニュー             | `AppBar` ＋ `Drawer`（自作の `AppShell`）                                    |
| 見出し・本文                           | `Typography variant="h5" component="h1"`                                     |
| 1 行の入力・複数行・数値・日付・セレクト | `TextField`（`multiline`・`type="date"`・`select`）                          |
| 候補から選ぶ・文字で絞り込む・タグ     | `Autocomplete`（`multiple`・`freeSolo`）                                     |
| 1 つ選ぶ（少ない選択肢）               | `RadioGroup`／表示の切り替えなら `ToggleButtonGroup`                         |
| ON / OFF                               | `Checkbox`（同意など）・`Switch`（設定）                                     |
| 星の評価                               | `Rating`                                                                     |
| 数値の範囲                             | `Slider`                                                                     |
| 表・並び替え・ページ送り               | `Table` ＋ `TableSortLabel` ＋ `TablePagination`                             |
| 状態・カテゴリのラベル                 | `Chip`                                                                       |
| 画面の切り替え（同じページの中）       | `Tabs`                                                                       |
| 重ねて出す入力・確認                   | `Dialog`（確認は自作の `ConfirmDialog`）                                     |
| 操作の結果の通知（数秒で消える）       | `Snackbar` ＋ `Alert`（自作の `notify()`）                                   |
| ずっと出す注意・エラー                 | `Alert`                                                                      |
| 読み込み中                             | `CircularProgress`・`Skeleton`・`Button loading`                             |
| 0 件・見つからない                     | 自作の `EmptyState`                                                          |

### sx の早見表

| 書き方                                     | 意味                                       |
| ------------------------------------------ | ------------------------------------------ |
| `p: 2`・`px: 2`・`py: 2`・`pt: 2`          | padding（2 × 8 = 16px）。x は左右、y は上下 |
| `m: 2`・`mt: 2`・`mx: "auto"`              | margin                                     |
| `gap: 2`                                   | flex・grid の間隔                          |
| `color: "text.secondary"`                  | 文字の色（theme の名前）                   |
| `bgcolor: "primary.main"`                  | 背景の色                                   |
| `border: 1, borderColor: "divider"`        | 1px の枠線                                 |
| `borderRadius: 1`                          | 角丸（theme の 8px × 1）                   |
| `display: { xs: "none", md: "block" }`     | 900px 以上だけ表示                         |
| `width: { xs: "100%", sm: 320 }`           | 数値は px、文字列はそのまま                |
| `"&:hover": { … }`                         | 疑似クラス・子要素                         |
| `fontWeight: 700`・`whiteSpace: "nowrap"`  | CSS のプロパティはキャメルケースで         |

### v9 で変わった書き方

| 古い書き方                               | v9 の書き方                                     |
| ---------------------------------------- | ----------------------------------------------- |
| `InputProps`・`inputProps`・`InputLabelProps` | `slotProps={{ input, htmlInput, inputLabel }}` |
| `<Grid item xs={12} md={6}>`             | `<Grid size={{ xs: 12, md: 6 }}>`               |
| `<Box mt={2}>`・`<Stack alignItems="center">` | `sx={{ mt: 2 }}`・`sx={{ alignItems: "center" }}` |
| `<Typography paragraph>`                 | `gutterBottom` か `sx={{ mb: 2 }}`              |
| `<ListItem button>`                      | `<ListItemButton>`                              |
| `<LoadingButton>`（@mui/lab）            | `<Button loading>`                              |
| `Autocomplete` の `renderTags`           | `renderValue`                                   |
| `PaperProps`・`TransitionProps`          | `slotProps={{ paper, transition }}`             |
| `DeleteOutline` などのアイコン           | `DeleteOutlined`                                |
