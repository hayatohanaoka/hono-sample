# Hono アプリケーションのテンプレート

Hono と TypeScript による API のひな形です。単体テスト・E2E、GitHub Actions による CI、Docker と Kubernetes（Helm / Skaffold）向けのファイルを含みます。

## 特徴

- クリーンアーキテクチャを意識したディレクトリ構成
- 単体テストと E2E テストで変更を検証しやすい
- CI は GitHub Actions で実装
- コンテナ（Docker）と Kubernetes へのデプロイを想定した構成

## 技術スタック

| 領域 | 採用技術 |
|------|----------|
| ランタイム | Node.js（Docker イメージは Node 24 Alpine ベース） |
| 言語 | TypeScript（`module` / `moduleResolution`: NodeNext） |
| Web フレームワーク | [Hono](https://hono.dev/) |
| Node サーバー | [@hono/node-server](https://github.com/honojs/node-server) |
| 開発時実行 | [tsx](https://github.com/privatenumber/tsx)（`pnpm dev` でウォッチ起動） |
| パッケージマネージャ | [pnpm](https://pnpm.io/)（`e2e/package.json` の `packageManager` でバージョン指定） |
| 単体テスト | [Jest](https://jestjs.io/)（`app`） |
| E2E 等 | [Vitest](https://vitest.dev/)（`e2e`） |
| API モック | [MSW](https://mswjs.io/)（E2E 補助） |
| コンテナ | Docker（マルチステージビルド） |
| Kubernetes | [Helm](https://helm.sh/)（`environment/app/helm`） |
| ビルド・デプロイ連携 | [Skaffold](https://skaffold.dev/)（`environment/skaffold.yaml`） |
| CI | [GitHub Actions](https://github.com/features/actions)（`.github/workflows/api_ci.yaml`） |

## ディレクトリ構成

| パス | 内容 |
|------|------|
| `app/` | Hono API のソース、単体テスト、`pnpm-lock.yaml` |
| `e2e/` | Vitest ベースの E2E プロジェクト |
| `environment/` | Dockerfile、Skaffold、Helm などデプロイ用 |

## 前提条件

- Node.js（CI では LTS）
- pnpm（Corepack を有効にすると `packageManager` に追従しやすい）

## ローカル開発

### API の起動（開発モード）

```bash
cd app
pnpm install
pnpm dev
```

デフォルトは **ポート 13000**（`http://localhost:13000`）。

### 本番相当の起動

```bash
cd app
pnpm install   # 未実行の場合
pnpm build
pnpm start
```

## テスト

### 単体テスト（`app`）

```bash
cd app
pnpm install
pnpm jest
```

### E2E（`e2e`）

サンプルは MSW によるモックが中心です。実 API に向けたテストを足す場合は、別ターミナルで API を起動してから実行してください。

```bash
cd e2e
pnpm install
pnpm vitest run
```

## CI（GitHub Actions）

`main` への push または pull request で、`app/**` に変更があるときに走ります。

1. `app` で依存関係を入れ、Jest で単体テスト
2. API をバックグラウンド起動したうえで `e2e` で `pnpm vitest run`
3. `environment` ディレクトリで Skaffold により Docker イメージをビルド

## Docker / Kubernetes

| 項目 | 場所・内容 |
|------|------------|
| Dockerfile | `environment/app/Dockerfile`（Skaffold 上のビルドコンテキストは `app/`） |
| Skaffold | `environment/skaffold.yaml` — ビルド後、Helm で `hono-api` をデプロイ可能 |
| 本番向け調整 | Skaffold の `prd` プロファイルでレプリカ数などを上書き |

クラスタ固有の設定やシークレットは、利用環境に合わせて Helm チャートを拡張してください。
