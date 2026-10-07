# MUI 版の雛形（starter-mui）

> [サンプル集の目次](../README.md) ｜ **使い方と、試験の実装手順**：[試験の実装手順（雛形から提出まで）](docs/README.md)

[1. プロジェクトの作成](../library/docs/01-setup.md) の 1-2〜1-10 を**済ませた状態**のアプリ。
お題の中身（entities・features・widgets）は空で、各フォルダの `README.md` に**書き方とコピー用のコード**がある。
試験の最初の 15 分を、コピーと名前の変更の 3 分に縮めるためのもの。

## 入っているもの

| 場所                       | 中身                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| 設定                       | Vite・TypeScript・oxlint、`@/` で import（パスエイリアス）、`lang="ja"`                               |
| パッケージ                 | MUI（＋アイコン・Emotion）・React Router・Zustand・zod・React Hook Form（＋ resolvers）               |
| `src/app/`                 | テーマ（日本語化込み）・Provider（テーマ・Router・通知）・ルーティング・共通の枠（AppShell）          |
| `src/pages/`               | 仮のトップ（`home`）・404（`not-found`）・**書き方**（`README.md`：一覧ページ・詳細ページ）            |
| `src/widgets/`             | **書き方**（`README.md`：DataTable で作る表）                                                          |
| `src/features/`            | **書き方**（`README.md`：追加・編集のダイアログ、削除ボタン ＋ 確認）                                 |
| `src/entities/`            | **書き方**（`README.md`：型・選択肢・store・カード）                                                   |
| `src/shared/ui/`           | DataTable・DialogForm（useFormDialog）・ConfirmDialog・FormTextField・Notifier・EmptyState・PageHeader など |
| `src/shared/lib/`・`config/` | 日付の関数・persist の読み込みチェック（mergeWithSchema）・localStorage のキー                      |

部品の使い方は [MUI 部品カタログ](https://munakoya.github.io/react-exam-samples/mui-catalog/)、
よく出る画面（追加モーダル・編集モーダル・削除の確認・選べる表）は
[画面パターン（CRUD）](https://munakoya.github.io/react-exam-samples/mui-catalog/patterns/crud-overview) で見られる。

## 使い方

### 1. コピーする

```bash
# このフォルダだけを my-app という名前で取ってくる（git の履歴は付かない）
npx degit munakoya/react-exam-samples/starter-mui my-app
cd my-app
npm install
npm run dev        # http://localhost:5173 で「雛形が動いています」が出れば OK
```

`npx degit` が使えないときは、GitHub の [react-exam-samples](https://github.com/munakoya/react-exam-samples) を
「Code → Download ZIP」で落とし、`starter-mui` フォルダだけを取り出す。

### 2. 4 か所を変える

| ファイル                           | 変えるところ                                    |
| ---------------------------------- | ----------------------------------------------- |
| `package.json`                     | `"name": "starter-mui"` → アプリ名（英小文字・`-`） |
| `index.html`                       | `<title>アプリ名</title>`                        |
| `src/shared/config/storage.ts`     | `STORAGE_PREFIX = "my-app"` → アプリ名            |
| `src/app/layouts/RootLayout.tsx`   | `title="アプリ名"` とメニュー（`navItems`）       |

### 3. 最初のコミット

```bash
git init
git add -A
git commit -m "環境構築（MUI・テーマ・ルーティング・共通の枠）"
```

ここから先は [試験の実装手順](docs/README.md) の順に進める。

## 持ち込めない試験のとき

雛形をコピーできないなら、[1. プロジェクトの作成](../library/docs/01-setup.md) を見ながら手で作る（中身はこの雛形と同じ）。
`shared/ui` の部品は必要なものだけ、[MUI 部品カタログ](https://munakoya.github.io/react-exam-samples/mui-catalog/) の「ソースコード」から写す。

## 提出前に消すもの

- `src/pages/home/`（一覧やダッシュボードを作ったら）と、App.tsx の `HomePage`
- 各フォルダの `README.md`（書き方の説明。残しても動きには関係ない）
- `src/shared/ui/SamplesTopLink/` と index.ts のその行（サンプル集の公開ページ用）
- 使わなかった `shared/ui` の部品（残しても動きには関係ない。気になるなら消す）
