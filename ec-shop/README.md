# ECショップ（サンプル）

> [サンプル集の目次](../README.md)・共通の作りは目次の README を参照。

## お題

食品を扱う小さなネットショップを作ってください。
商品を一覧から探してカートに入れ、お届け先を入力して注文を確定できるようにします。
3,000円以上で送料無料（それ未満は送料500円）です。カートと注文履歴は、ブラウザを閉じても残るようにしてください。
商品のデータは固定でかまいません。

### 要件

**必須**

- [ ] 商品一覧（カード）。売り切れは「売り切れ」と表示し、カートに入れられない
- [ ] 商品詳細ページで、数量を選んでカートに入れる（在庫数まで）
- [ ] ヘッダーにカートの個数を表示する（どのページでも）
- [ ] カートページで数量の変更・削除ができ、小計・送料・合計を表示する
- [ ] 購入手続き：お名前・メール・電話番号・郵便番号・住所・支払い方法・利用規約への同意
- [ ] 入力チェック：メールの形式、電話番号はハイフンなしの10〜11桁、郵便番号は7桁（ハイフンは任意）、同意は必須
- [ ] 注文を確定したら注文完了ページを表示し、カートを空にする

**発展**

- [ ] カテゴリの絞り込み・キーワード検索・価格の並び替え。条件を URL に残す
- [ ] 送料無料まであといくらかを表示する
- [ ] 注文履歴ページ（注文番号・日時・合計・明細）
- [ ] カートが空のときに購入手続きページを開いたら、カートページへ戻す
- [ ] 注文の確定中はボタンを「処理中…」にして、二重に送信できないようにする

## 画面と URL

| URL                         | 画面                                    |
| --------------------------- | --------------------------------------- |
| `/products`                 | 商品一覧（`?q=&category=&sort=`）       |
| `/products/:productId`      | 商品詳細                                |
| `/cart`                     | カート                                  |
| `/checkout`                 | 購入手続き（カートが空なら `/cart` へ） |
| `/orders/:orderId/complete` | 注文完了                                |
| `/orders`                   | 注文履歴                                |

## 実装の順番（コミットの単位）

1. 環境構築、ルーティング
2. `entities/product`：商品の型と固定データ、商品カード
3. 商品一覧・商品詳細ページ
4. `entities/cart`：カートの store（persist）と合計の計算
5. カートに入れる（`features/add-to-cart`）、ヘッダーの個数
6. カートページ（数量の変更・削除・合計）
7. `entities/order`：注文の型と store
8. 購入手続きフォーム（`features/checkout`）、注文完了ページ
9. 注文履歴ページ
10. 絞り込み・検索・並び替え（URL）、空のカートのガード

## 解答の構成

```text
src/
├── app/                        App.tsx・RootLayout（ヘッダーにカート）・AppProviders・styles
├── pages/
│   ├── product-list/           商品一覧（URL で絞り込み）
│   ├── product-detail/         商品詳細
│   ├── cart/                   カート
│   ├── checkout/               購入手続き（空ならガード）
│   ├── order-complete/         注文完了
│   ├── order-history/          注文履歴
│   └── not-found/
├── widgets/
│   ├── cart-lines/             カートの中身（数量・削除）
│   ├── cart-summary/           合計（カート・購入手続きで共通）
│   └── header-cart-link/       ヘッダーのカートの個数
├── features/
│   ├── add-to-cart/            カートに入れるボタン・数量つきフォーム、商品 → カートの変換
│   └── checkout/               購入手続きフォーム（注文の記録 ＋ カートを空に）
├── entities/
│   ├── product/                商品の型・固定データ・カード
│   ├── cart/                   カートの型・store・合計の計算
│   └── order/                  注文の型・store・明細の表
└── shared/
```

## 学習ポイント

| ポイント                                            | 見るところ                                                                                                                                               |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 変わらないデータは store に入れない（マスタデータ） | [entities/product/model/product.ts](src/entities/product/model/product.ts)                                                                               |
| 合計は保存せず毎回計算する（`reduce`）              | [entities/cart/model/cart.ts](src/entities/cart/model/cart.ts)                                                                                           |
| カートに入れた時点の値をコピーして持つ              | [entities/cart/model/cart.ts](src/entities/cart/model/cart.ts)・[features/add-to-cart/model/toCartLine.ts](src/features/add-to-cart/model/toCartLine.ts) |
| 同じ商品は数量を足す・在庫数で上限                  | [entities/cart/model/cartStore.ts](src/entities/cart/model/cartStore.ts)                                                                                 |
| action の中で今の state を読む（`get()`）           | [entities/order/model/orderStore.ts](src/entities/order/model/orderStore.ts)                                                                             |
| メール（`pipe`）・電話・郵便番号（`regex`）・同意   | [features/checkout/model/schema.ts](src/features/checkout/model/schema.ts)                                                                               |
| 非同期の送信と `isSubmitting`・エラーのまとめ表示   | [features/checkout/ui/CheckoutForm.tsx](src/features/checkout/ui/CheckoutForm.tsx)                                                                       |
| `<Navigate>` でページのガード                       | [pages/checkout/ui/CheckoutPage.tsx](src/pages/checkout/ui/CheckoutPage.tsx)                                                                             |
| ページ移動と store 更新の順番（`useTransitions`）   | [app/providers/AppProviders.tsx](src/app/providers/AppProviders.tsx)                                                                                     |
| 検索語は useState ＋ URL に書き写す                 | [pages/product-list/ui/ProductListPage.tsx](src/pages/product-list/ui/ProductListPage.tsx)                                                               |
| `navigate(-1)` で絞り込みを保ったまま戻る           | [pages/product-detail/ui/ProductDetailPage.tsx](src/pages/product-detail/ui/ProductDetailPage.tsx)                                                       |
| カード全体をリンクにする（stretched link）          | [entities/product/ui/ProductCard.module.css](src/entities/product/ui/ProductCard.module.css)                                                             |
| `grid-template-areas` で狭い画面の並びを変える      | [widgets/cart-lines/ui/CartLines.module.css](src/widgets/cart-lines/ui/CartLines.module.css)                                                             |
| 2列のときだけ `sticky`、1列で `order` を入れ替え    | [pages/checkout/ui/CheckoutPage.module.css](src/pages/checkout/ui/CheckoutPage.module.css)                                                               |

## 動かし方

```bash
cd frontend/exam/samples
npm install
npm run dev -w ec-shop
```
