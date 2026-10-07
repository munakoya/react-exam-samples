# 1. 全体の地図

> [目次](README.md) ｜ 次：[2. app と shared](02-app-shared.md)

コードを読む前に、**フォルダごとの役割**と**どの向きに import してよいか**を頭に入れる。
これさえ分かれば、「このコードはどこにあるか」「新しいコードをどこに書くか」がほぼ自動で決まる。

## 1-1. ファイルの一覧（全体）

```text
user-management/
├── index.html                  ブラウザが最初に開く HTML。<div id="root"> と main.tsx の読み込みだけ
├── package.json                使うライブラリとコマンド（dev・build・lint）
├── vite.config.ts              Vite の設定。"@" → src の別名
├── tsconfig.app.json           TypeScript の設定。"@/*" → "./src/*"（vite.config と必ずそろえる）
├── .oxlintrc.json              lint のルール（フックの使い方の間違いなど）
├── README.md                   お題・要件・実装の順番
├── docs/                       この解説書
└── src/
    ├── main.tsx                起点：React を #root に描画する
    ├── app/                    【app】アプリ全体の設定（1つしかないもの）
    │   ├── App.tsx               URL とページの対応（ルーティング）
    │   ├── layouts/RootLayout.tsx  全ページ共通の枠（ヘッダー＋メニュー）
    │   ├── providers/AppProviders.tsx  テーマ・Router・通知をまとめて包む
    │   └── styles/theme.ts       色・角丸・文字・部品の初期設定
    ├── pages/                  【pages】URL 1つ = 1フォルダ。部品を並べて画面にする
    │   ├── user-list/            /users
    │   ├── user-detail/          /users/:id
    │   └── not-found/            404
    ├── widgets/                【widgets】entities と features を組み合わせた「画面の大きなかたまり」
    │   ├── user-table/           表（選択・一括操作・行の操作）
    │   └── user-card-grid/       カードの一覧
    ├── features/               【features】ユーザーが行う「操作」1つ = 1フォルダ
    │   ├── user-form/            追加・編集のダイアログ
    │   ├── delete-user/          削除ボタン＋確認
    │   ├── change-user-status/   有効／無効の切り替え
    │   └── user-filter/          検索・絞り込み
    ├── entities/               【entities】業務のデータ（ユーザー）の型・store・見せ方
    │   └── user/
    └── shared/                 【shared】業務に関係しない使い回しの道具
        ├── config/               localStorage のキー
        ├── lib/                  日付の整形・persist のチェック
        └── ui/                   表・ダイアログ・通知などの部品
```

## 1-2. 層（レイヤー）と import の向き

フォルダは 6 つの**層**に分かれていて、**上の層は下の層だけを import してよい**。

```text
  app        ← いちばん上（全部を知っている）
   ↓
  pages
   ↓
  widgets
   ↓
  features
   ↓
  entities
   ↓
  shared     ← いちばん下（何も知らない）
```

| 層       | 何を置くか                                  | 知っていてよいもの               | このアプリの例                                 |
| -------- | ------------------------------------------- | -------------------------------- | ---------------------------------------------- |
| app      | アプリに 1 つしかない設定                   | 全部                             | ルーティング、テーマ、Provider                 |
| pages    | 1 つの URL の画面。部品を並べ、ダイアログを開閉する | widgets・features・entities・shared | 一覧ページ、詳細ページ                         |
| widgets  | 何度も出てくる「画面のかたまり」            | features・entities・shared       | ユーザーの表、カード一覧                       |
| features | 1 つの操作（ボタン・フォーム・入力欄）      | entities・shared                 | 追加／編集、削除、有効／無効、絞り込み         |
| entities | 業務のデータの型・保存場所・見せ方          | shared                           | `User` 型、`useUserStore`、`UserCard`          |
| shared   | どのアプリでも使える道具                    | なし（ライブラリだけ）           | `DataTable`、`ConfirmDialog`、`notify`         |

### なぜ向きを決めるのか

- **下の層は上の層を知らない**ので、`shared/ui/DataTable` は「ユーザー」を一切知らない。だから別のアプリ（本・商品）にもそのまま使える
- **同じ層どうしも import しない**（features から別の features は import しない）。操作どうしが絡み合うと、1 つ直すと別の操作が壊れる。2 つの操作を組み合わせたいときは、1 つ上の層（widgets・pages）で並べる
  - 例：表（widgets/user-table）は、削除（features/delete-user）と有効／無効（features/change-user-status）を**並べている**だけ。2 つの features はお互いを知らない

### 「下の層が上の層に何かを伝えたい」とき

下は上を import できないので、**props で関数を受け取って呼ぶ**。

```tsx
// widgets/user-table：編集ダイアログはページにあるので、「押された」ことだけを伝える
<UserTable users={visibleUsers} onEdit={dialog.openEdit} />   // pages 側
<IconButton onClick={() => onEdit(user)}>                      // widgets 側
```

`onEdit`・`onDeleted`・`onClose` など、`on〇〇` の props はほぼすべてこの目的で使っている。

## 1-3. スライスと Public API（index.ts）

`entities/user`・`features/user-form` のような**層の下の 1 フォルダ**を「スライス」と呼ぶ。
スライスの中は、さらに役割で分ける。

| フォルダ | 置くもの                                             | 例                                         |
| -------- | ---------------------------------------------------- | ------------------------------------------ |
| `model/` | 型・スキーマ・store・計算する関数・フック（画面なし）| `user.ts`・`userStore.ts`・`filterUsers.ts` |
| `ui/`    | コンポーネント（.tsx）                               | `UserCard.tsx`・`UserFormDialog.tsx`       |
| `index.ts` | 外に見せるものだけを export する「窓口」           | `export { UserCard } from "./ui/UserCard"` |

import の書き方は 2 通り。

```ts
// ① ほかのスライスから → 必ず index.ts（窓口）経由。中のファイル名は書かない
import { useUserStore, type User } from "@/entities/user";

// ② 同じスライスの中 → 相対パス
import { userSchema } from "./user";            // entities/user/model/userStore.ts
import { useUserFilter } from "../model/useUserFilter";  // features/user-filter/ui/UserFilterBar.tsx
```

**なぜ窓口を作るのか**：スライスの中のファイルを分けたり名前を変えたりしても、`index.ts` さえ直せば外のコードは直さなくてよい。
また、`index.ts` に書いていないもの（`features/user-form` の `UserForm`・`createUserFormSchema` など）は「中だけで使う」という意味になる。

`@/` は `src/` のこと。`vite.config.ts`（ビルド用）と `tsconfig.app.json`（型チェック用）の両方に設定してある。片方だけだと「型は通るのに動かない」または逆になる。

## 1-4. 「どこに書くか」を決める質問

新しいコードを書くとき、上から順に答えていけば置き場所が決まる。

| 質問                                                                 | はい なら                         |
| -------------------------------------------------------------------- | --------------------------------- |
| アプリに 1 つしかない設定？（ルート・テーマ・Provider）              | `app/`                            |
| 「ユーザー」を知らなくても書ける？（ほかのアプリでも使える）         | `shared/`（部品は ui、関数は lib、定数は config） |
| ユーザーの型・選択肢・保存・見せ方（操作なし）？                     | `entities/user/`                  |
| ユーザーが行う 1 つの操作？（ボタンを押す・フォームを送る・入力する）| `features/〇〇/`                  |
| 複数の操作や見せ方を組み合わせた、画面のかたまり？                   | `widgets/〇〇/`                   |
| 1 つの URL の画面？                                                  | `pages/〇〇/`                     |

このアプリで実際に判断した例：

| コード                         | 置き場所                         | 理由                                                                           |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------ |
| `DataTable`（選択できる表）    | `shared/ui`                      | 列の定義を受け取るだけで、ユーザーを知らない。本・商品の表にも使える          |
| `formatDate`                   | `shared/lib`                     | 日付の文字列を整えるだけ                                                       |
| 権限の選択肢 `userRoleOptions` | `entities/user/model`            | 表示（Chip）・フォーム・絞り込みの 3 か所で使う。ユーザーのデータの一部        |
| `UserCard`                     | `entities/user/ui`               | ユーザーの**見せ方**だけ。ボタンは持たない                                     |
| `UserRoleChip`                 | `entities/user/ui`               | 色の決め方を 1 か所にまとめ、表・カード・詳細で同じ見た目にする                |
| 重複チェックつきのスキーマ     | `features/user-form/model`       | フォームの入力チェックは「追加・編集する」操作のためのもの                     |
| `filterUsers`                  | `features/user-filter/model`     | 絞り込む操作のための計算                                                       |
| `UserTable`                    | `widgets`                        | 表（shared）＋ Chip（entities）＋ 削除・有効／無効（features）を組み合わせる   |
| 編集ダイアログの開閉           | `pages`（`useFormDialog`）       | 表・カードの両方から開く。両方を並べているのはページだけ                       |
| 選択中の行 `selectedIds`       | `widgets/user-table`             | 表の中だけで使う                                                               |

## 1-5. 状態（データ）の置き場所

「どこに状態を置くか」も決まった基準がある。**使う範囲がいちばん狭い場所**に置く。

| 状態                                   | 置き場所                                    | 理由                                                                 |
| -------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| ユーザー一覧                           | Zustand の store（`entities/user`）＋ localStorage | 一覧・詳細・ダイアログ・表のスイッチなど、離れた場所で読み書きする。再読み込みでも残す |
| 検索のことば・権限・表示（表／カード） | URL（`?q=…&role=…&view=card`）              | 再読み込み・戻る・URL の共有で同じ画面を出したい                     |
| ダイアログの開閉・編集中のユーザー     | `useState`（`pages` の `useFormDialog`）    | そのページの中だけで使う                                             |
| 削除の確認ダイアログの開閉             | `useState`（`DeleteUserButton` の中）       | そのボタンの中だけで使う                                             |
| 選択中の行                             | `useState`（`widgets/user-table`）          | 表の中だけで使う                                                     |
| 並び替え・ページの位置                 | `useState`（`shared/ui/DataTable` の中）    | 表の中だけで使う                                                     |
| 通知の中身                             | Zustand の store（`shared/ui/Notifier`）    | どこからでも `notify("…")` で出したい                                |
| 絞り込んだ結果・有効な人数             | **持たない**（描画のたびに計算）            | ユーザー一覧と条件から計算できる。持つと更新を忘れてずれる           |

最後の行が大事。「ほかの値から計算できるものは state にしない」。
`visibleUsers = filterUsers(users, keyword, role)` は、描画のたびに計算し直すので、ユーザーを追加・削除しても条件を変えても、必ず正しい結果になる。

## 1-6. 起動から画面が出るまで

```text
index.html
  └ <script src="/src/main.tsx">
      main.tsx
        └ <StrictMode>
            <AppProviders>                       app/providers
              ThemeProvider（theme）              … MUI の色・角丸
              CssBaseline                         … リセット CSS
              BrowserRouter                       … URL を読む
                <App />                           app/App.tsx
                  <Routes>
                    <Route element={<RootLayout />}>   app/layouts（ヘッダー＋メニュー）
                      /users     → <UserListPage />    pages/user-list
                      /users/:id → <UserDetailPage />  pages/user-detail
                      *          → <NotFoundPage />    pages/not-found
                <Notifier />                      … 通知の表示場所（1つだけ）
```

ページの中はさらに次のように組み立てられる（一覧ページ）。

```text
UserListPage（pages）
├── PageHeader（shared/ui）……………… タイトル・説明・[追加]ボタン
├── UserFilterBar（features/user-filter）… 検索欄・権限のセレクト
├── ToggleButtonGroup（MUI）…………… 表／カードの切り替え
├── UserTable（widgets）  ※表のとき
│   └── DataTable（shared/ui）
│       ├── 列：UserAvatar・UserRoleChip（entities）・UserActiveSwitch（features）
│       ├── 選択中の帯：ChangeUsersStatusButtons・DeleteUsersButton（features）
│       └── 行の右端：編集ボタン・DeleteUserButton（features）
├── UserCardGrid（widgets） ※カードのとき
│   └── UserCard（entities）＋ 詳細・編集・DeleteUserButton
└── UserFormDialog（features/user-form）… 追加・編集のダイアログ（ページに1つ）
```

この 2 つの図を頭に入れてから、次の章で各ファイルを読む。
