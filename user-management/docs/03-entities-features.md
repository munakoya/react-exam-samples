# 3. entities と features

> [目次](README.md) ｜ 前：[2. app と shared](02-app-shared.md) ｜ 次：[4. widgets と pages](04-widgets-pages.md)

ここからが「ユーザー管理」らしいコード。

- **entities/user**：ユーザーという**データ**（型・選択肢・保存場所・見せ方）
- **features/〇〇**：ユーザーに対する**操作**（追加・編集、削除、有効／無効、絞り込み）

entities は「名詞」、features は「動詞」と覚えるとよい。

---

## 3-1. entities/user ── ユーザーのデータ

```text
entities/user/
├── index.ts               窓口
├── model/
│   ├── user.ts            選択肢・zod スキーマ・型
│   └── userStore.ts       store（Zustand ＋ persist）
└── ui/
    ├── UserAvatar.tsx     名前の1文字目のアイコン
    ├── UserChips.tsx      権限・状態のラベル
    └── UserCard.tsx       1人分のカード（ボタンなし）
```

### [model/user.ts](../src/entities/user/model/user.ts) ── 選択肢と型

#### 選択肢は「3 点セット」で作る

```ts
export const userRoles = ["admin", "editor", "viewer"] as const;                   // ① 値の配列
export type UserRole = (typeof userRoles)[number];                                 //    → 型 "admin" | "editor" | "viewer"
export const userRoleLabels: Record<UserRole, string> = {                          // ② 表示名
  admin: "管理者", editor: "編集者", viewer: "閲覧者",
};
export const userRoleOptions = userRoles.map((value) => ({ value, label: userRoleLabels[value] }));  // ③ 選択肢
```

| 使うもの          | 使う場所                                                                       |
| ----------------- | ------------------------------------------------------------------------------ |
| ① `userRoles`     | zod の `z.enum(userRoles)`、URL の値のチェック（`useUserFilter`）               |
| `UserRole`（型）  | `User` の型、`Record<UserRole, …>`                                             |
| ② `userRoleLabels`| 表示（`UserRoleChip`）                                                         |
| ③ `userRoleOptions` | フォームのセレクト・絞り込みのセレクト（`.map` で `<MenuItem>` を並べる）     |

- **`as const`**：これがないと `userRoles` の型はただの `string[]` になり、`UserRole` が `string` になってしまう。付けると「この 3 つの文字列だけ」の型になる
- **`(typeof userRoles)[number]`**：配列の「どれか 1 つの要素」の型。値の配列から型を作るので、**選択肢を足すときは配列に 1 つ足すだけ**でよい
- **`Record<UserRole, string>`**：キーに `UserRole` の全部を要求する型。選択肢を足したのに表示名を書き忘れると、型エラーで気付ける
- **保存する値は英語、表示は日本語**：表示名を「閲覧者」→「閲覧のみ」に変えても、保存済みのデータは壊れない

部署（`departments`・`departmentLabels`・`departmentOptions`）もまったく同じ形。

#### ユーザー本体のスキーマと型

```ts
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(userRoles),
  department: z.enum(departments),
  active: z.boolean(),
  joinedAt: z.string(),     // 入社日 "YYYY-MM-DD"
  createdAt: z.string(),    // ISO 文字列
  updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;
export type UserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
```

- **スキーマから型を作る**（`z.infer`）：型とスキーマを別々に書くと、片方だけ直してずれる。1 つから作れば必ず一致する
- **このスキーマは「保存データの形」のチェック用**（store の persist で使う）。ここには「30 文字以内」のような**入力のルールは書かない**。入力のルールはフォームの都合なので features/user-form に書く（後述）
- **`UserInput`**：フォームから受け取る値。`id`・日時はユーザーが入力しないので除いた型。store の `addUser`・`updateUser` の引数になる

### [model/userStore.ts](../src/entities/user/model/userStore.ts) ── store

**なぜ store にするか**：ユーザー一覧は、一覧ページ（表・カード）、詳細ページ、追加／編集ダイアログ、表のスイッチ、一括ボタン…と、**離れた場所から読み書き**する。props で渡し続けるのは大変なので、どこからでも読める Zustand の store に置く。

**なぜ entities か**：ユーザーのデータそのものの置き場所だから。features（操作）はここの action を呼ぶだけ。

#### 形：state と action

```ts
type UserState = { users: User[] };
type UserActions = {
  addUser: (input: UserInput) => void;
  updateUser: (id: string, input: UserInput) => void;
  setActive: (ids: string[], active: boolean) => void;   // 1件でも配列で
  removeUsers: (ids: string[]) => void;                  // 1件でも配列で
};
```

- **`ids: string[]` で受け取る**：1 件の削除も一括削除も同じ action で書ける（`removeUsers([user.id])`・`removeUsers(ids)`）。action を 1 つ減らせる

#### action の中身（どれも「新しい配列を作って set」）

```ts
addUser: (input) => {
  const now = new Date().toISOString();
  const user: User = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  set((state) => ({ users: [user, ...state.users] }));               // 先頭に足す
},
updateUser: (id, input) =>
  set((state) => ({
    users: state.users.map((user) =>
      user.id === id ? { ...user, ...input, updatedAt: new Date().toISOString() } : user),
  })),
setActive: (ids, active) =>
  set((state) => ({
    users: state.users.map((user) =>
      ids.includes(user.id) ? { ...user, active, updatedAt: new Date().toISOString() } : user),
  })),
removeUsers: (ids) => set((state) => ({ users: state.users.filter((user) => !ids.includes(user.id)) })),
```

| 操作 | 配列のメソッド                     | 覚え方                                  |
| ---- | ---------------------------------- | --------------------------------------- |
| 追加 | `[新しいもの, ...今の配列]`        | スプレッドで新しい配列                  |
| 更新 | `map`（一致したものだけ差し替え）  | 件数は変わらない                        |
| 削除 | `filter`（一致しないものだけ残す） | 件数が減る                              |

- **`push`・`splice`・`user.name = …` を使わない**：元の配列・オブジェクトを書き換えると、React も Zustand も「変わった」と気付かず、画面が更新されない
- **`{ ...user, ...input }`**：今の値に入力の値を上書き。`id`・`createdAt` は `input` にないので残る
- **id・日時は store で付ける**：フォームは「ユーザーが入力したもの」だけを渡せばよい
- `crypto.randomUUID()`：ブラウザ標準のランダムな id。`localhost` か `https` でだけ使える

#### persist の設定

```ts
export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({ users: seedUsers, addUser: …, … }),
    {
      name: storageKey("users"),                        // localStorage のキー "user-management:users"
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users }),  // 保存するのはデータだけ（関数は保存しない）
      version: 1,
      merge: mergeWithSchema(z.object({ users: z.array(userSchema) })),  // 読み込んだ値をチェック
    },
  ),
);
```

- **`create<…>()(…)`**：`()` が 2 回続くのは、persist のようなミドルウェアを使うときに型を正しく付けるための Zustand の決まりごと
- **`partialize`**：保存する部分を選ぶ。action（関数）は JSON にできないので除く
- **`merge`**：2 章の `mergeWithSchema`。`partialize` で保存した形（`{ users: User[] }`）のスキーマを渡す
- **`version`**：`User` の形を変えたら数字を上げる。保存されている version と違うと、persist は古いデータを使わない（`migrate` を書けば変換もできる）
- **`seedUsers`**：最初に 6 人入れておく（すぐ表を試せるように）。**試験では `[]` から始めてよい**。localStorage に保存があればそちらが使われる

#### 使い方と、やってはいけないこと

```ts
const users = useUserStore((state) => state.users);                 // ○ 配列をそのまま
const removeUsers = useUserStore((state) => state.removeUsers);     // ○ action を1つ
const user = useUserStore((state) => state.users.find((u) => u.id === id));  // ○ find は store の中の同じオブジェクトを返す

const active = useUserStore((state) => state.users.filter((u) => u.active)); // ✕ 無限に再描画
```

セレクター（`(state) => …`）が**毎回新しい配列・オブジェクト**を返すと、Zustand は「値が変わった」と判断して再描画し、その再描画でまた新しい配列が作られ…と止まらなくなる（`Maximum update depth exceeded`）。
`filter`・`map`・`sort`・`{ … }` はセレクターの外、コンポーネントの中で行う。

### [ui/UserAvatar.tsx](../src/entities/user/ui/UserAvatar.tsx)・[ui/UserChips.tsx](../src/entities/user/ui/UserChips.tsx)

```tsx
const roleColors: Record<UserRole, "secondary" | "primary" | "default"> = { admin: "secondary", editor: "primary", viewer: "default" };
export const UserRoleChip = ({ role }: { role: UserRole }) => (
  <Chip size="small" variant="outlined" color={roleColors[role]} label={userRoleLabels[role]} />
);
export const UserStatusChip = ({ active }: { active: boolean }) => (
  <Chip size="small" color={active ? "success" : "default"} label={active ? "有効" : "無効"} />
);
```

- **なぜ部品にするか**：表・カード・詳細の 3 か所で権限を出す。色の決め方を 1 か所にまとめれば、3 か所の見た目が必ずそろう
- **なぜ entities か**：「権限を何色で見せるか」はユーザーのデータの見せ方。操作はない
- `UserAvatar`：画像がないので名前の 1 文字目を出す。無効なユーザーは灰色（`grey.400`）

### [ui/UserCard.tsx](../src/entities/user/ui/UserCard.tsx) ── ボタンを持たないカード

```tsx
type UserCardProps = { user: User; actions?: ReactNode };

<Card sx={{ height: "100%", display: "flex", flexDirection: "column", opacity: user.active ? 1 : 0.7 }}>
  <CardContent sx={{ flexGrow: 1 }}> アバター・名前・メール・Chip・部署と入社日 </CardContent>
  {actions && <CardActions …>{actions}</CardActions>}
</Card>
```

- **いちばん大事な設計**：カードは**見せ方だけ**を持ち、編集・削除のボタンは持たない。ボタンは外から `actions` に**差し込む**
  - entities は features（削除ボタン）を import できない（層のルール）。だから「入れ物」だけ用意して、上の層（widgets）が中身を入れる
  - 別の画面で「詳細だけ」「ボタンなし」のカードにしたくても、同じ `UserCard` が使える
- `height: "100%"` ＋ flex の縦並び ＋ `CardContent` の `flexGrow: 1`：Grid の同じ行のカードの高さをそろえ、ボタンを下にそろえる
- `minWidth: 0` ＋ `noWrap` ＋ `title`：長いメールアドレスを「…」で切り、マウスを乗せると全部見える。flex の子は中身より縮まないので `minWidth: 0` が要る

---

## 3-2. features/user-form ── 追加・編集のダイアログ

```text
features/user-form/
├── index.ts                 窓口（UserFormDialog だけを見せる）
├── model/schema.ts          入力チェック（重複チェックつき）・初期値
└── ui/UserFormDialog.tsx    ダイアログ ＋ 中身のフォーム
```

### [model/schema.ts](../src/features/user-form/model/schema.ts) ── 入力のルール

```ts
export const createUserFormSchema = (otherEmails: string[]) =>
  z.object({
    name: z.string().trim().min(1, "名前を入力してください").max(30, "30文字以内で入力してください"),
    email: z
      .string()
      .trim()
      .min(1, "メールアドレスを入力してください")
      .pipe(z.email("メールアドレスの形式が正しくありません"))
      .refine((email) => !otherEmails.includes(email), "このメールアドレスは登録済みです"),
    role: z.enum(userRoles),
    department: z.enum(departments),
    active: z.boolean(),
    joinedAt: z.iso.date("入社日を入力してください"),
  });
```

- **スキーマを関数で作る理由**：「重複していないか」を調べるには、**ほかのユーザーのメールアドレス**が要る。スキーマの外の値を使うので、引数で受け取る
- **`otherEmails`（自分以外）を渡す理由**：編集のとき、自分のメールアドレスまで「登録済み」と判定されると、何も変えずに保存できなくなる。だから呼ぶ側で**自分を除いた**一覧を作って渡す
- **`.trim()`**：前後の空白を取ってからチェックする。空白だけの名前を防ぐ。送信される値も trim 済みになる
- **`.pipe(z.email(…))`**：前のチェック（空でない）を通ったら、次のチェック（メールの形）へ渡す。空欄のときに「入力してください」と「形式が正しくありません」が両方出るのを防ぐ
- **`.refine(関数, メッセージ)`**：zod に用意されていない条件を、`true`（OK）/ `false`（エラー）を返す関数で書く
- **`z.iso.date(…)`**：`"YYYY-MM-DD"` の形の日付か。空欄（`""`）もここでエラーになる
- **なぜ entities の `userSchema` と別か**：`userSchema` は「保存データの形」、こちらは「人が入力したときのルール」（文字数・メッセージ・重複）。目的が違う。入力のルールは追加／編集という**操作**のためのものなので features に置く

#### 型と初期値

```ts
type UserFormSchema = ReturnType<typeof createUserFormSchema>;  // 関数が返すスキーマの型
export type UserFormInput = z.input<UserFormSchema>;            // フォームが持つ値（入力途中）
export type UserFormValues = z.output<UserFormSchema>;          // チェックを通った値（送信時）

export const toFormInput = (user?: User): UserFormInput => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  role: user?.role ?? "viewer",
  department: user?.department ?? "sales",
  active: user?.active ?? true,
  joinedAt: user?.joinedAt ?? "",
});
```

- **`ReturnType<typeof …>`**：スキーマが関数の中にあるので、「関数が返すものの型」としてスキーマの型を取り出す
- **`z.input` と `z.output`**：zod は変換（trim・数値への変換など）ができるので、「チェック前」と「チェック後」で型が変わることがある。このフォームではたまたま同じ形だが、いつも 2 つ用意して `useForm<Input, unknown, Values>` に渡す習慣にしておくと、数値の入力欄などが出てきても迷わない
- **`toFormInput(user?)`**：初期値を 1 か所で作る。`user` があれば今の値（編集）、なければ空・初期の値（追加）。`?.` と `??` で 1 つの関数にまとめている

### [ui/UserFormDialog.tsx](../src/features/user-form/ui/UserFormDialog.tsx) ── ダイアログと中身

このファイルには**コンポーネントが 2 つ**ある。これがこのアプリでいちばん大事な工夫。

```tsx
// ① 外側：ダイアログ（export する）
export const UserFormDialog = ({ open, user, onClose }: UserFormDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <UserForm user={user} onDone={onClose} />
  </Dialog>
);

// ② 内側：フォーム（export しない）。useForm はこっちに書く
const UserForm = ({ user, onDone }: { user?: User; onDone: () => void }) => {
  …
  const { control, handleSubmit } = useForm<UserFormInput, unknown, UserFormValues>({
    resolver: zodResolver(createUserFormSchema(otherEmails)),
    defaultValues: toFormInput(user),
  });
  …
};
```

#### なぜ 2 つに分けるのか

MUI の `<Dialog>` は、**閉じると中身（children）を画面から消し、開くと作り直す**。
`useForm` を内側の `UserForm` に書いておくと、ダイアログを開くたびに `UserForm` が新しく作られ、`useForm` も `defaultValues` から始まる。

もし `useForm` を外側の `UserFormDialog` に書くと…

1. 佐藤さんの編集を開く → フォームに佐藤さんの値
2. 閉じる（`UserFormDialog` 自体は消えないので、`useForm` の値は残る）
3. 鈴木さんの編集を開く → **佐藤さんの値のまま**（`defaultValues` は最初の 1 回しか使われない）

これを直すには `useEffect` で `reset(toFormInput(user))` を呼ぶ必要があり、書き忘れやすい。分けておけば `reset()` は要らない。

#### 中身の流れ

```tsx
const users = useUserStore((state) => state.users);
const addUser = useUserStore((state) => state.addUser);
const updateUser = useUserStore((state) => state.updateUser);

// 重複チェック用：自分以外のメールアドレス
const otherEmails = users.filter((other) => other.id !== user?.id).map((other) => other.email);

const onSubmit = (values: UserFormValues) => {
  if (user) { updateUser(user.id, values); notify(`「${values.name}」を更新しました`); }
  else      { addUser(values);             notify(`「${values.name}」を追加しました`); }
  onDone();                                   // ダイアログを閉じる
};
```

- **`user` があるかどうかで、追加と編集を分ける**。見出し（「ユーザーを追加」/「ユーザーを編集」）、ボタンの文言（「追加」/「更新」）も同じ条件で切り替える
- `user?.id`：追加のときは `user` が `undefined` なので、`?.` で `undefined` になり、全員が「ほかのユーザー」になる
- `handleSubmit(onSubmit)`：送信時に zod でチェックし、**通ったときだけ** `onSubmit` を呼ぶ。エラーがあれば各入力欄に赤字が出て、`onSubmit` は呼ばれない
- `values` はチェック済み（trim 済み）の値。`UserInput` と同じ形なので、そのまま store に渡せる

#### 入力欄の書き方

```tsx
<FormTextField control={control} name="name" label="名前" required autoFocus />
<FormTextField control={control} name="email" label="メールアドレス" type="email" required />

<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>     {/* PC は横並び、スマホは縦 */}
  <FormTextField control={control} name="role" label="権限" select>
    {userRoleOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
  </FormTextField>
  <FormTextField control={control} name="department" label="部署" select>…</FormTextField>
</Stack>

<FormTextField control={control} name="joinedAt" label="入社日" type="date" required
  slotProps={{ inputLabel: { shrink: true } }} />                 {/* ラベルを常に上に */}

<Controller control={control} name="active" render={({ field }) => (
  <FormControlLabel label="有効（ログインできる）" control={
    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur} name={field.name} />
  } />
)} />
```

- `required`：ラベルに「*」を付けるだけ（チェックは zod がする。`noValidate` なのでブラウザはチェックしない）
- `autoFocus`：開いたらすぐ名前を入力できる
- **日付の `shrink: true`**：`type="date"` は空でも「年/月/日」が表示されるので、ラベルが重なる。ラベルを常に上に置く
- **Switch は `FormTextField` ではなく `Controller`**：Switch の値は `value` ではなく `checked`（true / false）。`onChange` で渡すのも `event.target.value` ではなく `event.target.checked`。TextField 用の部品は使えないので、`Controller` で直接つなぐ

---

## 3-3. features/delete-user ── 削除ボタン＋確認

```text
features/delete-user/
├── index.ts
└── ui/
    ├── DeleteUserButton.tsx    1人分（表の行・カード・詳細ページ）
    └── DeleteUsersButton.tsx   まとめて（表の選択中の帯）
```

### [ui/DeleteUserButton.tsx](../src/features/delete-user/ui/DeleteUserButton.tsx)

```tsx
export const DeleteUserButton = ({ user, variant = "icon", onDeleted }: DeleteUserButtonProps) => {
  const [open, setOpen] = useState(false);
  const removeUsers = useUserStore((state) => state.removeUsers);

  const handleConfirm = () => {
    setOpen(false);
    removeUsers([user.id]);
    notify(`「${user.name}」を削除しました`);
    onDeleted?.();
  };

  return (
    <>
      {variant === "icon" ? <IconButton …>🗑</IconButton> : <Button …>削除</Button>}
      <ConfirmDialog open={open} title="削除しますか？" message={`「${user.name}」を削除します。…`}
        onConfirm={handleConfirm} onCancel={() => setOpen(false)} />
    </>
  );
};
```

- **ボタンと確認ダイアログを 1 つの部品にまとめている**：使う側は `<DeleteUserButton user={user} />` と書くだけで、「押す → 確認 → 削除 → 通知」が全部動く。表・カード・詳細の 3 か所で同じことを書かなくてよい
- **確認ダイアログの開閉は `useState`**：このボタンの中だけで使う状態なので、store にもページにも置かない
- **`variant`**：表・カードではゴミ箱のアイコン、詳細ページでは文字のボタン。見た目だけを切り替える
- **`onDeleted?.()`**：削除したあとにしてほしいことを、呼ぶ側が決める。詳細ページは「一覧へ戻る」、表・カードは何もしない（渡さない）。`?.()` は「渡されていれば呼ぶ」
- アイコンだけのボタンには `aria-label={`「${user.name}」を削除`}`。表に削除ボタンが並ぶので、**誰の**削除かまで読み上げで伝える

**なぜ編集ダイアログと違って、ボタンの中にダイアログを持つのか**：
確認ダイアログは「この人を消すか」だけで完結し、中身も軽い。一方、編集のフォームは大きく、表・カード・詳細の**どこから開いても同じもの**を 1 つ出したい。だから編集ダイアログはページに 1 つ置き、確認ダイアログはボタンごとに持つ。

### [ui/DeleteUsersButton.tsx](../src/features/delete-user/ui/DeleteUsersButton.tsx)

1 人分と同じ形で、`user` の代わりに `ids: string[]` を受け取る。

- **選択の state は持たない**：どれを選んでいるかは表（widgets）が持っていて、`ids` として渡してくる
- `onDeleted`：表が「選択を空にする」（`setSelectedIds([])`）を渡す。消した id が選択に残らないように
- `disabled={ids.length === 0}`：0 件で押せないように（念のため）

---

## 3-4. features/change-user-status ── 有効／無効

### [ui/UserActiveSwitch.tsx](../src/features/change-user-status/ui/UserActiveSwitch.tsx)

```tsx
<Switch
  size="small"
  checked={user.active}
  onChange={(event) => {
    setActive([user.id], event.target.checked);
    notify(`「${user.name}」を${event.target.checked ? "有効" : "無効"}にしました`, "info");
  }}
  slotProps={{ input: { "aria-label": `「${user.name}」の有効・無効` } }}
/>
```

- 表の 1 行に置き、**押したらすぐ保存**する。フォームもダイアログも出さない
- `checked={user.active}`：スイッチは自分で状態を持たず、store の値をそのまま表示する。store が変われば表示も変わる
- **確認を出さない理由**：もう一度押せば元に戻せる操作だから。確認は取り消せない操作（削除）だけにする。代わりに通知（`"info"`＝青）で「何が起きたか」を伝える
- `slotProps={{ input: … }}`：MUI v9 で、部品の中の `<input>` に属性を渡す書き方

### [ui/ChangeUsersStatusButtons.tsx](../src/features/change-user-status/ui/ChangeUsersStatusButtons.tsx)

表の選択中の帯に出す「有効にする」「無効にする」の 2 つのボタン。`ids` を受け取り `setActive(ids, true/false)` を呼ぶだけ。
削除と違い、選択は空にしない（続けて別の操作をできるように）。

---

## 3-5. features/user-filter ── 検索・絞り込み

```text
features/user-filter/
├── index.ts
├── model/
│   ├── useUserFilter.ts    条件を URL で持つフック
│   └── filterUsers.ts      条件で絞り込む関数
└── ui/
    └── UserFilterBar.tsx   検索欄 ＋ 権限のセレクト
```

**3 つに分けた理由**：「条件をどこに持つか」（URL）、「どう絞り込むか」（計算）、「どう入力させるか」（見た目）は別々に変わる。分けておくと、たとえば一覧ページは**入力欄なしで**条件と計算だけを使える。

### [model/useUserFilter.ts](../src/features/user-filter/model/useUserFilter.ts) ── 条件を URL に持つ

```ts
export type RoleFilter = UserRole | "all";

const isUserRole = (value: string | null): value is UserRole =>
  userRoles.some((role) => role === value);

export const useUserFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("q") ?? "";                       // ない → ""
  const roleParam = searchParams.get("role");
  const role: RoleFilter = isUserRole(roleParam) ? roleParam : "all"; // 知らない値 → "all"

  const update = (name: string, value: string) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);                      // 今の URL をコピー
        if (value === "" || value === "all") next.delete(name);      // 初期値なら URL から消す
        else next.set(name, value);
        return next;
      },
      { replace: true },
    );

  return { keyword, role, setKeyword: (v: string) => update("q", v), setRole: (v: RoleFilter) => update("role", v) };
};
```

- **なぜ URL に持つか**：`useState` だと、詳細ページへ行って「戻る」と条件が消える。URL（`/users?q=佐藤&role=admin`）なら、再読み込み・戻る・URL の共有でも同じ画面になる
- **`searchParams.get` は `string | null`**：URL は誰でも書き換えられるので、`?role=xxx` のような知らない値が来るかもしれない。`isUserRole` で確かめてから使う
- **`value is UserRole`（型ガード）**：この関数が `true` を返したら、`value` は `UserRole` だと TypeScript に伝える。だから `roleParam` をそのまま `role` に入れられる
- **`userRoles.includes(value)` と書かない理由**：`userRoles` は `"admin" | "editor" | "viewer"` の配列なので、`string | null` を渡すと型エラーになる。`some` で 1 つずつ比べれば型エラーにならない
- **`(prev) => …` で今の URL をコピーしてから 1 つだけ変える**：`setSearchParams({ q: "佐藤" })` と書くと、`role`・`view` が消えてしまう
- **初期値なら `delete`**：URL が `?q=&role=all` のように汚れない
- **`{ replace: true }`**：1 文字打つごとに履歴が増えると、「戻る」を何十回も押すことになる

### [model/filterUsers.ts](../src/features/user-filter/model/filterUsers.ts) ── 絞り込みの計算

```ts
export const filterUsers = (users: User[], keyword: string, role: RoleFilter) => {
  const normalized = keyword.trim().toLowerCase();
  return users.filter(
    (user) =>
      (role === "all" || user.role === role) &&
      (normalized === "" ||
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized)),
  );
};
```

- **ただの関数**（フックでもコンポーネントでもない）。入力が同じなら必ず同じ結果を返す。だから読みやすく、どこでも使える
- **結果を store や state に入れない**：一覧ページが描画のたびに呼ぶ。ユーザーが増えても条件が変わっても、必ず最新の結果になる
- `"all"` と `""` は「条件なし」。`||` で「条件なしなら通す」を先に書くと読みやすい
- `toLowerCase()`：大文字・小文字を区別せずに探す

### [ui/UserFilterBar.tsx](../src/features/user-filter/ui/UserFilterBar.tsx) ── 入力欄

```tsx
const { keyword, role, setKeyword, setRole } = useUserFilter();

<TextField type="search" label="名前・メールで検索" value={keyword} onChange={(e) => setKeyword(e.target.value)} … />
<TextField select label="権限" value={role} onChange={(e) => setRole(e.target.value as RoleFilter)}>
  <MenuItem value="all">すべて</MenuItem>
  {userRoleOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
</TextField>
```

- **値は URL から読み、変わったら URL に書く**だけ。この部品は state を持たない
- **React Hook Form を使わない理由**：送信ボタンがなく、1 文字ごとにすぐ反映したいから。フォームのチェックも要らない
- `type="search"`：入力欄に × ボタンが出て、すぐ消せる
- `as RoleFilter`：`event.target.value` は `string` 型。選べるのは `"all"` と権限の値だけなので、型を伝えている
- 「すべて」を `userRoleOptions` とは別に書く：「すべて」は絞り込みだけの選択肢で、ユーザーの権限ではない。だから entities の選択肢には入れない
