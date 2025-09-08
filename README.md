# かき氷注文システムクライアント (Kakigori Order System Client)

かき氷注文システムのサンプルです。

## 目次

- [概要](#概要)
- [セットアップ](#セットアップ)
  - [環境変数](#環境変数)
  - [ローカル起動](#ローカル起動)
  - [Dockerで起動](#dockerで起動)
- [ルーティング](#ルーティング)
  - [画面とURLの対応](#画面とurlの対応)
- [ファイル構成](#ファイル構成)
- [スクリプト](#スクリプト)
- [デプロイ](#デプロイ)
  - [ローカルでビルド](#ローカルでビルド)
  - [Dockerでデプロイ](#dockerでデプロイ-1)
  - [手動デプロイ（Node）](#手動デプロイnode)
- [スタイリング](#スタイリング)
- [関連](#関連)

---

## 概要

React Router + Vite + Tailwind で実装した、**かき氷注文システムのサンプルUI**です。必要であればこちらを参考にオリジナルUIを開発してください。メニューから味を選択して注文し、**注文番号**と**ステータス（準備中/呼出中/受渡完了）**を表示します。注文完了ページは URL に `orderId` を含むため **リロードしても復元** できます。

## セットアップ

### 環境変数

| 変数名 | デフォルト値 | 説明 |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:8080` | APIのベースURL |

#### 設定例

```bash
touch .env.local && echo "VITE_API_BASE=http://localhost:8080" > .env
```

### ローカル起動

- アプリURL | `http://localhost:5173/order/<storeId>`
   - 例：`/order/store-001`

```bash
npm install
npm run dev
```

### Dockerで起動

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

## ルーティング

| パス                               | 役割                                         |
| ---------------------------------- | -------------------------------------------- |
| `/order/:storeId`                  | メニュー一覧、番号スライダー、注文ボタン     |
| `/order/:storeId/receipt/:orderId` | 注文番号/品名/状態バッジの表示（リロード可） |

### 画面とパスの対応

- `<storeId>` は店舗ID（例: `store-001`）  
- `<orderId>` は作成された注文ID（例: `store-001-9`）

| 画面 | パス | スクリーンショット |
|---|---|---|
| 注文ページ（メニュー一覧） | `http://localhost:5173/order/<storeId>` | <img width="320" alt="menu-list" src="https://github.com/user-attachments/assets/ead87b81-a895-4ba2-bbfc-d1673442ea96" /> |
| 注文ページ（番号スライダー表示時） | `http://localhost:5173/order/<storeId>` | <img width="320" alt="menu-slider" src="https://github.com/user-attachments/assets/b97efb2d-c492-4171-b57a-421a54b955db" /> |
| 注文完了ページ | `http://localhost:5173/order/<storeId>/receipt/<orderId>` | <img width="320" alt="receipt" src="https://github.com/user-attachments/assets/716e7047-3e7b-4ded-bead-c3f4ac4e6339" /> |

## ファイル構成

```bash
.
├── app/
│   ├── api/
│   │   └── client.ts # API呼び出し関連
│   ├── components/
│   │   ├── ErrorCard.tsx # エラー表示用のカード
│   │   ├── SuccessCard.tsx # 注文完了カード
│   │   └── Placeholder.tsx # 読込中のエフェクト
│   ├── routes/
│   │   ├── order.$storeId._index.tsx # ストアトップ（メニューの一覧表示）
│   │   └── order.$storeId.receipt.$orderId.tsx # 注文完了画面（番号表示）
│   ├── app.css
│   └── root.tsx
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── README.md
```

## スクリプト

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバ起動（HMR） |
| `npm run build` | 本番ビルド（`build/` に出力） |
| `npm run start` | 本番サーバ起動（`build/server/index.js`） |
| `npm run typecheck` | ルート型生成＋TypeScript型チェック |
| `npm run format` | **Biome** でコード整形（`--write`） |
| `npm run lint` | **Biome** で静的解析（修正はしない） |


## デプロイ

### ローカルでビルド

```bash
npm run build
```

### Dockerでデプロイ

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

## スタイリング

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## 関連

バックエンド仕様: https://github.com/lambda-tech-club/kakigori-api-public

