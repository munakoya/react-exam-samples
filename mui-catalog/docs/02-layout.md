# 2. レイアウト

> [目次](README.md) ｜ 前：[1. 土台](01-basics.md) ｜ 次：[3. フォーム](03-forms.md)

## 2-1. アプリの枠：ヘッダー ＋ サイドメニュー

業務アプリの多くは「上にヘッダー、左にメニュー、右に各ページ」の形。React Router のレイアウトルートと組み合わせる。

```tsx
// app/App.tsx：path のない Route の element が枠。子のページは <Outlet /> に入る
<Routes>
  <Route element={<RootLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="/books" element={<BookListPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>

// app/layouts/RootLayout.tsx
<AppShell title="蔵書管理" navItems={[{ to: "/", label: "ダッシュボード", end: true }, { to: "/books", label: "本の一覧" }]}>
  <Outlet />
</AppShell>
```

`AppShell` は自作部品（[カタログ](https://munakoya.github.io/react-exam-samples/mui-catalog/app-shell)・[ソース](../../_shared/mui-ui/AppShell/AppShell.tsx)）。中身の要点：

```tsx
const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
const [mobileOpen, setMobileOpen] = useState(false);

<Box sx={{ display: "flex" }}>
  {/* zIndex を Drawer より上にして、ヘッダーをメニューの上に重ねる */}
  <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
    <Toolbar>
      {!isDesktop && <IconButton color="inherit" aria-label="メニューを開く" onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>}
      <Typography variant="h6" component="p">蔵書管理</Typography>
    </Toolbar>
  </AppBar>

  {/* PC は常に表示（permanent）、スマホは重ねて表示（temporary） */}
  <Drawer
    variant={isDesktop ? "permanent" : "temporary"}
    open={isDesktop || mobileOpen}
    onClose={() => setMobileOpen(false)}
    sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}
  >
    <Toolbar /> {/* 固定ヘッダーの高さ分の余白 */}
    <List>
      <ListItem disablePadding>
        <ListItemButton component={NavLink} to="/books" end sx={{ "&.active": { color: "primary.main" } }}>
          <ListItemText primary="本の一覧" />
        </ListItemButton>
      </ListItem>
    </List>
  </Drawer>

  {/* minWidth: 0：表などが長くても、メインが横にはみ出さない */}
  <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
    <Toolbar /> {/* 固定ヘッダーの下に中身が隠れないように */}
    <Outlet />
  </Box>
</Box>
```

| つまずき                                   | 直し方                                                               |
| ------------------------------------------ | -------------------------------------------------------------------- |
| ページの上の方がヘッダーに隠れる           | `AppBar position="fixed"` のときは、メインの先頭に空の `<Toolbar />` |
| メニューの「一覧」が子のページでも選択中   | NavLink に `end`                                                     |
| 表を置くとページ全体が横にスクロールする   | メインに `minWidth: 0`、表は `TableContainer` で包む                 |
| スマホでリンクを押してもメニューが閉じない | `ListItemButton` の `onClick` で閉じる                               |

時間がなければ、ヘッダーだけ（`AppBar` ＋ `Toolbar` ＋ リンクのボタン）でもよい。

## 2-2. ページの骨組み

**どのページも同じ形にする**と、速く書けて見た目もそろう。

```tsx
<Container maxWidth="lg" sx={{ py: 3 }}>      {/* 最大幅と上下の余白 */}
  <Stack spacing={3}>                           {/* 中のまとまりを 24px 間隔で縦に並べる */}
    <PageHeader title="本の一覧" action={<Button variant="contained">本を登録</Button>} />
    {/* 絞り込み */}
    {/* 一覧（0 件なら EmptyState） */}
  </Stack>
</Container>
```

| ページ             | `maxWidth` の目安 |
| ------------------ | ----------------- |
| 登録・編集フォーム | `"sm"`（600px）   |
| 詳細               | `"md"`（900px）   |
| 一覧・表・ダッシュボード | `"lg"`（1200px） |

見出しは自作の `PageHeader`（パンくず・タイトル・右のボタン）。なければこう書く：

```tsx
<Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
  <Box>
    <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>本の一覧</Typography>
    <Typography variant="body2" color="text.secondary">全 14 冊</Typography>
  </Box>
  <Button variant="contained">本を登録</Button>
</Stack>
```

## 2-3. 並べ方の部品を使い分ける

| 部品        | 使う場面                                                                  |
| ----------- | ------------------------------------------------------------------------- |
| `Container` | ページの一番外。最大幅と左右の余白                                        |
| `Stack`     | **縦・横に並べる（いちばんよく使う）**。間隔は `spacing`                  |
| `Grid`      | **列に並べる**（カードの一覧、フォームの 2 列）。幅は `size`（12 マス）   |
| `Box`       | 並べ方を細かく決めたい・ちょっとした余白や背景（`sx` が書ける `<div>`）   |
| `Paper`     | 白い面・枠線で囲む                                                        |
| `Card`      | 見出し・本文・ボタンのまとまり                                            |
| `Divider`   | 区切り線                                                                  |

### Stack

```tsx
<Stack spacing={2}>…</Stack>                                   // 縦に 16px 間隔
<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>…</Stack> // 横に並べ、上下中央
<Stack direction="row" sx={{ justifyContent: "space-between" }}>…</Stack>  // 両端に寄せる
<Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>…</Stack> // 折り返す（useFlexGap が必要）
<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>…</Stack>        // スマホだけ縦
<Stack divider={<Divider flexItem />}>…</Stack>                // 間に区切り線
```

### Grid（12 マス）

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>…</Grid>   {/* スマホ 1 列・タブレット 2 列・PC 3 列 */}
  <Grid size={8}>…</Grid>                           {/* 12 マスのうち 8 */}
  <Grid size="grow">…</Grid>                        {/* 残り全部 */}
</Grid>
```

フォームを 2 列にするのにも使う：

```tsx
<Grid container spacing={2}>
  <Grid size={12}><FormTextField name="title" … /></Grid>
  <Grid size={{ xs: 12, sm: 8 }}><FormTextField name="author" … /></Grid>
  <Grid size={{ xs: 12, sm: 4 }}><FormTextField name="genre" select … /></Grid>
</Grid>
```

### カードの高さをそろえる

```tsx
<Grid size={{ xs: 12, sm: 6, md: 3 }}>
  <Card sx={{ height: "100%" }}>                                                    {/* 同じ行で高さをそろえる */}
    <CardActionArea component={RouterLink} to={`/books/${id}`} sx={{ height: "100%" }}> {/* カード全体をリンクに */}
      <CardContent>…</CardContent>
    </CardActionArea>
  </Card>
</Grid>
```

## 2-4. 文字

| variant                | 使う場面                      |
| ---------------------- | ----------------------------- |
| `h5`（`component="h1"`） | ページのタイトル            |
| `h6`（`component="h2"`） | ページの中のまとまりの見出し |
| `subtitle1`            | カードのタイトル              |
| `body1`（初期値）      | 本文                          |
| `body2`                | 少し小さい本文・表の中・説明  |
| `caption`              | 注釈・日時                    |

```tsx
<Typography color="text.secondary">補足</Typography>
<Typography sx={{ fontWeight: 700 }}>太字</Typography>
<Typography noWrap>長いタイトルは「…」で省略</Typography>   {/* 親に幅が必要（minWidth: 0 も） */}
<Typography sx={{ whiteSpace: "pre-wrap" }}>{memo}</Typography> {/* 改行をそのまま表示 */}
```

## 2-5. 詳細の「項目名：値」

```tsx
<Card>
  <CardContent>
    <DescriptionList
      items={[
        { term: "著者", description: book.author },
        { term: "評価", description: <Rating value={book.rating} readOnly size="small" /> },
        { term: "メモ", description: book.memo || "—", multiline: true },
      ]}
    />
  </CardContent>
</Card>
```

`DescriptionList` は自作部品（`<dl>` を CSS Grid で 2 列に）。なければ Grid で書く：

```tsx
<Grid container spacing={1}>
  <Grid size={{ xs: 12, sm: 3 }}><Typography variant="body2" color="text.secondary">著者</Typography></Grid>
  <Grid size={{ xs: 12, sm: 9 }}><Typography>{book.author}</Typography></Grid>
</Grid>
```

## 2-6. タブで切り替える画面

```tsx
const [tab, setTab] = useState("active"); // URL に持つなら useSearchParams

<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
  <Tabs value={tab} onChange={(_e, value) => setTab(value)} variant="scrollable">
    <Tab value="active" label="貸出中（3）" />
    <Tab value="returned" label="返却済み" />
  </Tabs>
</Box>
{tab === "active" ? <ActiveList /> : <ReturnedList />}
```

Tabs が切り替えるのは見た目だけ。中身は自分で出し分ける。

---

> 次：[3. フォーム](03-forms.md)
