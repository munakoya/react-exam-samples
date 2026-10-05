# React 試験対策サンプル集

> 試験に出そうなお題を、同じ技術・同じ設計で作った**参考プロジェクト**。
> まず自分で作ってみて、あとでサンプルと見比べる（答え合わせ）ための教材。
>
> 公開ページ：https://munakoya.github.io/react-exam-samples/ （全サンプルと UI 部品カタログをブラウザで試せる）

| 項目           | 使っているもの                                                               |
| -------------- | ---------------------------------------------------------------------------- |
| 構成           | FSD（`app / pages / widgets / features / entities / shared`）                |
| 状態管理・保存 | Zustand ＋ `persist` ミドルウェア（localStorage に自動で保存・読み込み）     |
| フォーム       | React Hook Form ＋ zod（`@hookform/resolvers`）                              |
| ルーティング   | React Router（`BrowserRouter` ＋ `<Routes>`）                                |
| 見た目         | `global.css`・`tokens.css`・CSS Modules、部品は各サンプルの `src/shared/ui/` |
| 見た目（MUI 版） | Material UI v9（テーマ・`sx`）、自作部品は `src/shared/ui/`（元は `_shared/mui-ui`） |

見た目の作り方で 2 種類ある。**UI ライブラリが使える試験なら MUI 版**、使えないなら CSS Modules 版を見る。

| 種類            | サンプル                                                                  | 資料                                                                                                                       |
| --------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| MUI 版          | [蔵書管理（library）](library/)                                           | [MUI 部品カタログ](mui-catalog/)（動く見本）・[MUI 画面構築ガイド](mui-catalog/docs/README.md)・[蔵書管理の解説書](library/docs/README.md) |
| CSS Modules 版  | タスク管理・在庫管理・EC・予約                                            | [UI 部品カタログ](ui-catalog/)・[タスク管理の解説書](task-manager/docs/README.md)                                           |

## お題一覧

| お題                   | フォルダ                      | 状態   | このサンプルで学べること                                                                                  |
| ---------------------- | ----------------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| 蔵書管理（**MUI 版**） | [library](library/)           | 作成済 | MUI で一覧・詳細・登録・ダイアログ、RHF の Controller、貸出・期限切れの計算、URL で絞り込み・並び替え・ページ送り、ダッシュボード、通知の store |
| タスク管理             | [task-manager](task-manager/) | 作成済 | モーダルで追加・編集（`reset`）、並び替え、日付の比較、表示設定の store、かんばんボード                   |
| 在庫管理               | [inventory](inventory/)       | 作成済 | ページで登録・編集・詳細、URL で絞り込み、入出庫（在庫数に応じたチェック）、2つの store を動かす features |
| EC                     | [ec-shop](ec-shop/)           | 作成済 | 商品マスタ、カート（合計の計算）、購入フォーム（メール・電話・郵便番号）、注文の確定、ページのガード      |
| 予約・スケジュール管理 | [reservation](reservation/)   | 作成済 | 時間の重なりチェック、定員チェック（`superRefine`）、CSS Grid のスケジュール表、URL から初期値            |
| ユーザ管理             |                               | 未作成 |                                                                                                           |
| アルバム               |                               | 未作成 |                                                                                                           |
| 注文管理               |                               | 未作成 |                                                                                                           |
| 受講管理               |                               | 未作成 |                                                                                                           |
| 掲示板                 |                               | 未作成 |                                                                                                           |
| 家計簿                 |                               | 未作成 |                                                                                                           |

各サンプルの README は **お題 → 要件 → 実装の順番 → 解答の構成 → 学習ポイント** の順に書いてある。

**はじめての人は、まず [タスク管理の解説書](task-manager/docs/README.md) を読む**。プロジェクトの作成から、設計の考え方・モダン JS・ライブラリの使い方・実装手順・つまずきまでを、タスク管理アプリを例に説明している（ほかのサンプルも同じ作り）。
MUI で作るなら、同じ構成の [蔵書管理の解説書（MUI 版）](library/docs/README.md) を読む。

## 学び方（答え合わせの流れ）

1. サンプルの README の **お題と要件だけ** を読む（コードはまだ見ない）
2. 自分で新しいプロジェクトを作って実装する（時間を計る。目安は 2〜3 時間）
3. サンプルを動かして、足りない機能・動きの違いを探す
4. コードを見比べる。特に次の点
   - そのコードを置いた**層**（entities / features / widgets / pages）は同じか
   - store に入れたもの・入れなかったものは同じか（計算できる値を保存していないか）
   - zod のチェックの書き方（`refine`・`superRefine`・`pipe`）
   - 空・エラー・見つからないときの表示があるか
5. 違うところを直して、もう一度作る

## 動かし方

このフォルダ（TechHub では `frontend/exam/samples/`、公開リポジトリではルート）で1回 `npm install` すると、全サンプルの依存がまとめて入る（npm workspaces）。

```bash
npm install

npm run dev -w task-manager   # http://localhost:5173
npm run dev -w inventory
npm run dev -w ec-shop
npm run dev -w reservation
npm run dev -w ui-catalog     # UI 部品のカタログ
npm run dev -w library        # 蔵書管理（MUI 版）
npm run dev -w mui-catalog    # MUI 部品のカタログ

npm run build                 # 全サンプルの型チェック ＋ ビルド
npm run lint                  # 全サンプルの lint
```

どのサンプルも `package.json` を持っているので、フォルダごと取り出して `npm install` すれば単独でも動く。

localStorage のキーはサンプルごとに `task-manager:tasks` のように分けてあるので、同じ `localhost:5173` で動かしてもデータは混ざらない。
データを消したいときは DevTools の **Application → Local Storage** から削除する。

## 共通の作り

どのサンプルも同じ土台の上に作っているので、1つ読めばほかも読みやすい。

```text
src/
├── main.tsx                       # 起点。global.css を読み込む
├── app/
│   ├── App.tsx                    # URL とページの対応（<Routes>）
│   ├── layouts/RootLayout.tsx     # 全ページ共通の枠（AppShell ＋ Header ＋ Sidebar ＋ <Outlet />）
│   ├── providers/AppProviders.tsx # BrowserRouter（useTransitions={false}）・ToastProvider
│   └── styles/                    # global.css・tokens.css
├── pages/                         # URL 1つ分の画面
├── widgets/                       # entities と features を組み合わせた大きめの UI
├── features/                      # ユーザーの操作（フォーム・削除ボタンなど）
├── entities/                      # 扱う「もの」の型（zod）・store（Zustand）・表示
└── shared/
    ├── ui/                        # UI 部品（Button・TextField・Table・Modal など）
    ├── lib/                       # 日付・金額の整形、persist の読み込みチェック（mergeWithSchema）
    └── config/                    # localStorage のキー
```

MUI 版（library）は、CSS の代わりにテーマを持つところだけが違う。

```text
src/
├── main.tsx                       # 起点（CSS の import はない）
├── app/
│   ├── layouts/RootLayout.tsx     # AppShell（AppBar ＋ Drawer）＋ <Outlet />
│   ├── providers/AppProviders.tsx # ThemeProvider・CssBaseline・BrowserRouter・Notifier（通知）
│   └── styles/theme.ts            # 色・角丸・文字・部品の初期値・日本語化（tokens.css の代わり）
└── shared/ui/                     # MUI にない組み合わせだけ（FormTextField・ConfirmDialog・Notifier など）
```

### 守っているルール

- import は**下の層だけ**：`app → pages → widgets → features → entities → shared`
- 同じ層の別のフォルダは import しない（`entities/cart` から `entities/product` は NG）。両方を使う処理は上の層（features・widgets）に書く
- 外からは各フォルダの `index.ts` 経由で読み込む
- store には「保存する値」だけを入れる。合計・件数・絞り込み結果などの**計算できる値は入れない**
- Zustand のセレクターの中で `filter`・`map` した配列を返さない（毎回新しい配列になり、無限に再描画される）

### Zustand の store の型

```ts
export const useXxxStore = create<XxxStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (input) =>
        set((state) => ({ items: [...state.items, { ...input, id: crypto.randomUUID() }] })),
    }),
    {
      name: storageKey("items"), // localStorage のキー
      partialize: (state) => ({ items: state.items }), // 保存する値だけ
      merge: mergeWithSchema(z.object({ items: z.array(itemSchema) })), // 読み込んだ値を zod でチェック
    },
  ),
);
```

## GitHub で提出するときのコミットの流れ

実装の順番（コミット履歴）も見られる前提で、**動く状態を保ったまま、1機能ずつコミット**する。各サンプルの README の「実装の順番」がそのままコミットの単位になる。

```text
1. 環境構築（Vite・パッケージ・パスエイリアス・tokens.css / global.css・shared/ui）
2. ルーティングと共通レイアウト（空のページ）
3. 型と store（entities）
4. 一覧の表示
5. 登録フォーム
6. 詳細・編集
7. 削除（確認ダイアログ）
8. 絞り込み・並び替え
9. 空・エラー・見つからないときの表示、レスポンシブの調整
10. README（動かし方・工夫した点）
```

コミットメッセージは「何をしたか」が分かる日本語でよい（例：`タスクの追加フォームを実装`）。

## UI 部品

全サンプル共通の部品。**UI 部品カタログ**（[ui-catalog](ui-catalog/)、`npm run dev -w ui-catalog`、公開ページにもある）で、部品ごとに 見本（動く・コードをコピーできる）・props・ソースコード・使いそうなお題 を見られる。部品名・やりたいこと・お題（「アルバム」「評価」など）で検索できる。

| 分類           | 部品                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| アプリの枠     | `AppShell`・`Header`・`Sidebar`                                                                                                                                          |
| レイアウト     | `Container`・`Stack`・`Grid`・`PageHeader`                                                                                                                               |
| ナビゲーション | `ButtonLink`・`Breadcrumb`・`Tabs`・`SegmentedControl`・`Pagination`                                                                                                     |
| 入力           | `Button`・`IconButton`・`TextField`・`TextAreaField`・`SelectField`・`RadioGroup`・`Checkbox`・`CheckboxGroup`・`Switch`・`QuantityStepper`・`RatingField`・`ImageField` |
| 表示           | `Card`・`Table`・`DescriptionList`・`Badge`・`Avatar`・`Rating`・`Stat`・`ProgressBar`・`Accordion`                                                                      |
| フィードバック | `Alert`・`Toast`（`useToast`）・`EmptyState`・`Spinner`                                                                                                                  |
| ダイアログ     | `Modal`・`ConfirmDialog`                                                                                                                                                 |

React Hook Form とのつなぎ方は、カタログの「フォームの組み立て例」（`/form`）で全種類を確かめられる。

- ほとんどの入力部品：`{...register("名前")}` をそのまま渡す
- `CheckboxGroup`：選んだ値の配列で届く（`defaultValues` は `[]`）
- `RatingField`：ラジオボタンなので文字列で届く → zod の `z.coerce.number()`
- `ImageField`：値を親が持つ部品なので `Controller` でつなぐ

### MUI 版の部品

MUI 版では、ボタン・入力欄・表などは MUI の部品をそのまま使い、MUI にない組み合わせだけを `src/shared/ui/` に置く。
**MUI 部品カタログ**（[mui-catalog](mui-catalog/)、`npm run dev -w mui-catalog`）で、MUI の部品 38 種と自作部品 9 種の 押さえどころ・見本・props を見られる。

| 自作部品                          | 何をするもの                                                |
| --------------------------------- | ----------------------------------------------------------- |
| `AppShell`                        | ヘッダー ＋ サイドメニュー（スマホは ☰ で開閉）             |
| `PageHeader`                      | パンくず・タイトル・右のボタン                              |
| `FormTextField`                   | React Hook Form と TextField をつなぐ（`useController`）    |
| `ConfirmDialog`                   | 「削除しますか？」の確認                                    |
| `Notifier`・`notify()`            | どこからでも出せる通知（Zustand の store ＋ Snackbar）       |
| `EmptyState`・`DescriptionList`・`StatCard`・`QuantityStepper` | 0 件の案内・詳細の項目一覧・集計のカード・数量の ± |

MUI の入力欄は `register` ではなく `Controller`（`FormTextField`）でつなぐ。部品ごとのつなぎ方は [MUI 画面構築ガイドの 3 章](mui-catalog/docs/03-forms.md)。

## UI 部品を直すとき

部品の元は [_shared/ui](_shared/ui/)（CSS 版）と [_shared/mui-ui](_shared/mui-ui/)（MUI 版）にあり、各サンプル（とカタログ）の `src/shared/ui` はそのコピー。
アプリの `package.json` に `@mui/material` があれば MUI 版、なければ CSS 版がコピーされる。
部品を直すときは `_shared/ui` か `_shared/mui-ui` を直してから、次で全サンプルへ反映する。

```bash
npm run sync-ui
```

## GitHub Pages での公開

TechHub は非公開なので、このフォルダだけを公開リポジトリ [munakoya/react-exam-samples](https://github.com/munakoya/react-exam-samples) に送り、GitHub Pages で公開している。

```text
TechHub（非公開）                         react-exam-samples（公開）
frontend/exam/samples/ ── git subtree push ──→ main ── GitHub Actions ──→ GitHub Pages
```

### 公開の仕組み

- [.github/workflows/pages.yml](.github/workflows/pages.yml)：main に push されると、lint・型チェックのあと全アプリをビルドして公開する
- [scripts/build-pages.mjs](scripts/build-pages.mjs)：各アプリを `/react-exam-samples/<アプリ名>/` の下で動くようにビルドし（`vite build --base`）、トップページと `404.html` を作る
- 各アプリの `AppProviders` は、`import.meta.env.BASE_URL` を `BrowserRouter` の `basename` に渡している（手元では `/`）
- GitHub Pages は `/react-exam-samples/inventory/items/abc` のような URL を再読み込みすると 404 になる。`404.html` がアプリのトップへ送り、アプリ側で元の URL に戻す

手元で公開用のビルドを試すとき：

```bash
npm run build:pages   # _site/ にできる
```

### 更新するとき（TechHub のルートで）

TechHub でコミットしてから、`samples` フォルダの履歴だけを公開リポジトリへ送る。

```bash
# 初回だけ：公開リポジトリを「samples」という名前で登録する
git remote add samples https://github.com/munakoya/react-exam-samples.git

# samples フォルダの変更を送る（push すると GitHub Actions が動いて公開される）
git subtree push --prefix=frontend/exam/samples samples main
```

## サンプルを増やすとき

1. 既存のサンプル（CSS 版なら `inventory`、MUI 版なら `library`）をフォルダごとコピーし、`package.json` の `name`・`index.html` の `<title>`・`shared/config/storage.ts` のキーを変える
2. `entities`・`features`・`widgets`・`pages` をお題に合わせて作り直す
3. [package.json](package.json) の `workspaces` にフォルダ名を足す
4. [scripts/build-pages.mjs](scripts/build-pages.mjs) の `appInfo` に、公開ページのトップに出す名前と説明を足す
5. この README のお題一覧を更新する

## 公式ドキュメント

- [Zustand](https://zustand.docs.pmnd.rs/)（persist：Integrations → Persisting store data）
- [React Hook Form](https://react-hook-form.com/)・[zod](https://zod.dev/)
- [React Router](https://reactrouter.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Vite](https://vite.dev/)（`base`・`import.meta.env.BASE_URL`）
- [Material UI](https://mui.com/material-ui/)（各部品のページ・Customization → Theming・v9 への移行：Migration → Upgrade to v9）
