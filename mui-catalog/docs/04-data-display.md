# 4. 一覧の見せ方

> [目次](README.md) ｜ 前：[3. フォーム](03-forms.md) ｜ 次：[5. ダイアログ・通知・メニュー](05-feedback.md)

## 4-1. 表・カード・リストの選び方

| 見せ方         | 部品                         | 向いているもの                                         |
| -------------- | ---------------------------- | ------------------------------------------------------ |
| 表             | `Table`                      | 項目が多い・比べたい・並び替えたい（在庫・会員・注文） |
| カードの格子   | `Grid` ＋ `Card`             | 画像がある・1 件の情報が少ない（商品・アルバム）       |
| リスト         | `List`                       | 1 行で足りる・チェックや削除がある（Todo・メニュー）   |

迷ったら**表**。並び替え・ページ送りまで MUI の部品だけで作れる。

## 4-2. 表の基本

```tsx
<TableContainer component={Paper} variant="outlined"> {/* 枠付きの面。狭い画面では表だけ横スクロール */}
  <Table size="small" aria-label="本の一覧">
    <TableHead>
      <TableRow>
        <TableCell>タイトル</TableCell>
        <TableCell align="right">在庫数</TableCell> {/* 数値は右寄せ */}
        <TableCell align="right">操作</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id} hover> {/* hover：マウスを乗せた行の色を変える */}
          <TableCell component="th" scope="row"> {/* 行の見出しになる列 */}
            <Link component={RouterLink} to={`/items/${item.id}`}>{item.name}</Link>
          </TableCell>
          <TableCell align="right">{item.quantity}</TableCell>
          <TableCell align="right" sx={{ whiteSpace: "nowrap" }}> {/* ボタンを折り返さない */}
            <IconButton component={RouterLink} to={`/items/${item.id}/edit`} aria-label={`「${item.name}」を編集`}>
              <EditOutlinedIcon />
            </IconButton>
            <DeleteItemButton item={item} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

- **行の操作ボタンは features の部品**（`DeleteItemButton` など）。表は widgets に置き、features を並べる
- アイコンだけのボタンには、**どの行の**操作かが分かる `aria-label`（「『坊っちゃん』を削除」）
- 0 件のときは表の代わりに `EmptyState`。表の中に出すなら `colSpan` で全列をまとめた 1 行にする

```tsx
<TableRow>
  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>該当するデータはありません</TableCell>
</TableRow>
```

## 4-3. 並び替え（TableSortLabel）

`TableSortLabel` は矢印を出すだけ。**並び替えは自分で書く**。

```tsx
const [sortKey, setSortKey] = useState<SortKey>("createdAt");
const [order, setOrder] = useState<"asc" | "desc">("desc");

const handleSort = (key: SortKey) => {
  setOrder(sortKey === key && order === "asc" ? "desc" : "asc"); // 同じ列なら向きを入れ替える
  setSortKey(key);
};

// 比較関数を「小さい順」で書き、desc なら逆にする。toSorted は元の配列を変えない
const compare: Record<SortKey, (a: Item, b: Item) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, "ja"),
  quantity: (a, b) => a.quantity - b.quantity,
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
};
const sorted = items.toSorted((a, b) => (order === "asc" ? 1 : -1) * compare[sortKey](a, b));

<TableCell sortDirection={sortKey === "name" ? order : false}> {/* aria-sort が付く */}
  <TableSortLabel active={sortKey === "name"} direction={sortKey === "name" ? order : "asc"} onClick={() => handleSort("name")}>
    商品名
  </TableSortLabel>
</TableCell>
```

## 4-4. ページ送り

### 表の下（TablePagination）

```tsx
const [page, setPage] = useState(0); // ⚠ 0 から数える
const [rowsPerPage, setRowsPerPage] = useState(10);
const visible = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

<TablePagination
  component="div"
  count={sorted.length} // 全件数
  page={page}
  onPageChange={(_event, newPage) => setPage(newPage)}
  rowsPerPage={rowsPerPage}
  rowsPerPageOptions={[10, 25, 50]}
  onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }}
/>
```

文言は theme に `jaJP` を渡すと日本語になる。渡さないなら `labelRowsPerPage="表示件数"`・`labelDisplayedRows={({ from, to, count }) => \`${from}〜${to}件 / 全${count}件\`}`。

### カード・リストの下（Pagination）

```tsx
const [page, setPage] = useState(1); // 1 から数える
const pageCount = Math.ceil(items.length / PER_PAGE);
<Pagination count={pageCount} page={page} onChange={(_event, value) => setPage(value)} sx={{ alignSelf: "center" }} />
```

**絞り込みの条件を変えたら 1 ページ目に戻す**（3 ページ目のまま件数が減ると、空のページになる）。

## 4-5. 検索・絞り込みのバー

```tsx
<Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap sx={{ flexWrap: "wrap", alignItems: { sm: "center" } }}>
  <TextField
    type="search"
    label="キーワード"
    size="small"
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
  />
  <TextField select label="カテゴリ" size="small" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ minWidth: 160 }}>
    <MenuItem value="all">すべて</MenuItem>
    {categoryOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
  </TextField>
  <ToggleButtonGroup exclusive size="small" value={status} onChange={(_e, v) => v !== null && setStatus(v)} aria-label="状態で絞り込む">
    <ToggleButton value="all">すべて</ToggleButton>
    <ToggleButton value="low">在庫少</ToggleButton>
  </ToggleButtonGroup>
</Stack>
<Typography variant="body2" color="text.secondary">{filtered.length}件 / 全{items.length}件</Typography>
```

表示する一覧は**計算**で求める（state にしない）：

```ts
const keywordLower = keyword.trim().toLowerCase();
const filtered = items.filter(
  (item) =>
    (category === "all" || item.category === category) &&
    item.name.toLowerCase().includes(keywordLower),
);
```

### 条件を URL に残す

詳細から「戻る」・再読み込み・URL の共有でも同じ表示にしたいなら、`useState` の代わりに URL に持つ。

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const category = categories.find((c) => c === searchParams.get("category")) ?? "all"; // 選択肢のどれかか確かめる

// 1 つだけ変える（ほかの値は残す）。replace：履歴を増やさない
const updateParam = (key: string, value: string | null) =>
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev);
      if (value === null) next.delete(key);
      else next.set(key, value);
      next.delete("page"); // 条件を変えたら 1 ページ目へ
      return next;
    },
    { replace: true },
  );
```

条件が多いときは「URL → 条件のオブジェクト」「条件 → URL」の関数を作ってフックにまとめる（[library の book-filter](../../library/src/features/book-filter/model/)）。

## 4-6. 状態のラベル（Chip）

```tsx
// 状態ごとの色を 1 か所に。satisfies で「全部の状態がそろっているか」を型で確かめる
const statusColors = {
  ok: "success",
  low: "warning",
  out: "error",
} as const satisfies Record<StockStatus, ChipProps["color"]>;

<Chip label={stockStatusLabels[status]} color={statusColors[status]} size="small" variant={status === "ok" ? "outlined" : "filled"} />
```

**状態は保存せず、データから計算する**関数を entities に置く（`getStockStatus(item)`・`getAvailability(loan, today)`）。

## 4-7. カードの一覧

```tsx
<Grid container spacing={2}>
  {products.map((product) => (
    <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia sx={{ height: 160 }} image={product.imageUrl} title={product.name} /> {/* 高さを必ず決める */}
        <CardContent sx={{ flexGrow: 1 }}> {/* ボタンを下にそろえる */}
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>{product.name}</Typography>
          <Typography color="text.secondary">{formatPrice(product.price)}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" component={RouterLink} to={`/products/${product.id}`}>詳細</Button>
          <AddToCartButton product={product} />
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>
```

## 4-8. リスト

```tsx
<List>
  {todos.map((todo) => (
    <ListItem
      key={todo.id}
      disablePadding
      divider
      secondaryAction={ // 右端のボタン
        <IconButton edge="end" aria-label={`「${todo.title}」を削除`} onClick={() => remove(todo.id)}><DeleteOutlinedIcon /></IconButton>
      }
    >
      <ListItemButton onClick={() => toggle(todo.id)}> {/* 行全体を押せる */}
        <ListItemIcon><Checkbox edge="start" checked={todo.done} tabIndex={-1} disableRipple /></ListItemIcon>
        <ListItemText primary={todo.title} secondary={todo.dueDate} />
      </ListItemButton>
    </ListItem>
  ))}
</List>
```

## 4-9. 0 件・読み込み中・見つからない

| 場面                             | 出すもの                                                         |
| -------------------------------- | ---------------------------------------------------------------- |
| まだ 1 件もない                  | `EmptyState` ＋ 追加ボタン                                       |
| 絞り込みで 0 件                  | `EmptyState`「条件に合うものがありません」＋「条件をクリア」     |
| 詳細の id が見つからない         | `EmptyState`「見つかりません」＋「一覧へ戻る」                   |
| 読み込み中（API があるとき）     | `CircularProgress`（中央）か、形をまねた `Skeleton`              |
| 読み込みに失敗                   | `Alert severity="error"` ＋「再読み込み」ボタン（`action`）      |
| 送信中                           | `Button loading`                                                 |

```tsx
{items.length === 0 ? (
  <EmptyState title="まだ商品がありません" action={<Button component={RouterLink} to="/items/new" variant="contained">登録</Button>} />
) : filtered.length === 0 ? (
  <EmptyState title="条件に合う商品がありません" action={<Button onClick={resetFilter}>条件をクリア</Button>} />
) : (
  <ItemTable items={visible} />
)}
```

---

> 次：[5. ダイアログ・通知・メニュー](05-feedback.md)
