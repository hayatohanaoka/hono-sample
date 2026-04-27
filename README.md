# Hono サンプル API

Hono と TypeScript による API です。

\**安全な開発 と 設計のアウトプット を目的に作成** したため、ローカルで完結する実行・検証を前提に、単体テストと E2E、外部 API のモック（WireMock）、Docker / Kubernetes（Helm / Skaffold）、GitHub Actions による CI を揃えています。

## このリポジトリで意識していること

### 安全な開発

- **TDD をしやすくする**  
  単体テスト（`app`）と E2E（`e2e`）を、先に・繰り返し実行できるようにしています。外部の Qiita / Zenn 相当の応答は **WireMock** で固定し、**Docker**（CI）や **Skaffold + Helm**（ローカル Kubernetes でモックだけ立てる、など）と組み合わせて再現可能にしています。
- **CI でエラーに気づく仕組みを作る**  
  `main` 向けの push / PR で、単体 → E2E（WireMock コンテナ + API 起動）→ コンテナイメージビルド（Skaffold）までを GitHub Actions で実行します。
- **E2E フィクスチャの分離**
  - 外部 API の応答は **テストコードに直書きせず**、WireMock 用のマッピング JSON を `e2e/fixtures/` に置く。
  - テストファイルのパスから fixture ディレクトリを**自動解決**する規約を採用。`e2e/tests/` 配下のパスを `e2e/fixtures/` へ読み替え、サービスごとのサブディレクトリ（`qiita/`・`zenn/`）を走査する（例: `e2e/tests/api/v1/articles/get.test.ts` → `e2e/fixtures/api/v1/articles/get/{qiita,zenn}/*.json`）。
  - テスト側は `beforeEach` で `resetAllStubs()` → `setUpStubs(import.meta.filename)`（`e2e/src/setup-wiremock.ts`）を呼ぶだけで、対応する fixture が WireMock Admin API に流し込まれる。
  - 期待するレスポンスの大きな JSON をテスト本体から切り離し、**ケース追加・差分レビュー**をしやすくする。

### 設計

- **クリーンアーキテクチャ寄り**  
  ドメイン・ユースケース・ポート・ゲートウェイ・ドライバ（外部 HTTP）・REST（Hono）を分け、`dependencies.ts` で組み立てています。

### スコープ

- **ローカル**  
  開発サーバは `localhost`、Skaffold は `local.push: false` など、手元またはローカルクラスタで動かす想定の設定です。

## 技術スタック

| 領域 | 採用技術 |
|------|----------|
| ランタイム | Node.js（Docker イメージは Node 24 Alpine ベース） |
| 言語 | TypeScript（`module` / `moduleResolution`: NodeNext） |
| Web フレームワーク | [Hono](https://hono.dev/) |
| Node サーバー | [@hono/node-server](https://github.com/honojs/node-server) |
| 開発時実行 | [tsx](https://github.com/privatenumber/tsx)（`pnpm dev` でウォッチ起動） |
| パッケージマネージャ | [pnpm](https://pnpm.io/)（`e2e/package.json` の `packageManager` でバージョン指定） |
| 単体テスト | [Vitest](https://vitest.dev/)（`app`、`src/**/*.test.ts`） |
| E2E | [Vitest](https://vitest.dev/)（`e2e`） |
| 外部 API モック | [WireMock](https://wiremock.org/)（Docker 公式イメージ、ローカルは Skaffold の `with-mock` プロファイルなど） |
| コンテナ | Docker（マルチステージビルド） |
| Kubernetes | [Helm](https://helm.sh/)（`environment/app/helm`、`environment/wiremock/helm`） |
| ビルド・デプロイ連携 | [Skaffold](https://skaffold.dev/)（`environment/skaffold.yaml`） |
| CI | [GitHub Actions](https://github.com/features/actions)（`.github/workflows/api_ci.yaml`） |

## ディレクトリ構成

| パス | 内容 |
|------|------|
| `app/` | Hono API のソース、単体テスト、`pnpm-lock.yaml` |
| `e2e/` | E2E（Vitest）、WireMock 連携、`fixtures/` にマッピング JSON |
| `environment/` | Dockerfile、Skaffold、Helm、WireMock 用イメージ定義など |

## 前提条件

- **Node.js**  
  **Active LTS** を推奨します。CI（`.github/workflows/api_ci.yaml`）は `actions/setup-node` の **`lts/*`** を指定しています。コンテナビルドのベースイメージは **Node 24**（`environment/app/Dockerfile`）です。
- pnpm（Corepack を有効にすると `packageManager` に追従しやすい）
- E2E を WireMock コンテナで回す場合は Docker（CI と同様の手元検証用）

## API エンドポイント

記事関連のエンドポイントは **`/api/v1`**、システム系は **`/v1`** をベースパスとしています。ローカルで `pnpm dev` した場合の例では **`http://localhost:13000`** がオリジンになります（`app/src/main/index.ts` の `serve` 設定）。

| メソッド | パス | 説明 |
|----------|------|------|
| `GET` | `/v1/systems/ping` | 疎通確認。レスポンスボディは `pong`（テキスト） |
| `GET` | `/api/v1/articles` | 記事一覧（Qiita / Zenn 相当 API を集約した結果を JSON で返す） |
| `GET` | `/api/v1/articles?q=…` | クエリ `q` ありのときは検索用ユースケースへ |

例:

```bash
curl -sS http://localhost:13000/v1/systems/ping
curl -sS http://localhost:13000/api/v1/articles
curl -sS 'http://localhost:13000/api/v1/articles?q=typescript'
```

## 環境変数

アプリ・E2E で参照する主な変数です。手元での `export` の例は **`app/.envrc.example`**（API 起動時）と **`e2e/.envrc.example`**（E2E 実行時）にあります。

| 変数名 | 用途 | 必須 | 例 |
|--------|------|------|-----|
| `QIITA_URL` | Qiita 相当 API のベース URL | 実運用・E2E でモックに向けるときは必須 | `https://qiita.com` / `http://localhost:3000` |
| `ZENN_URL` | Zenn 相当 API のベース URL | 同上 | `https://zenn.dev` / `http://localhost:3001` |
| `TARGET_URL` | **E2E のみ**。テスト対象 API のオリジン | E2E 実行時は必須 | `http://localhost:13000` |

`QIITA_URL` / `ZENN_URL` は `app/src/main/articleSourceUrls.ts` から `process.env` として読みます。未設定だと外部リクエストの URL が不正になるため、ローカルでは `.envrc.example` を参考に設定してください。Kubernetes では Helm の値や Deployment の環境変数で上書きします。

## ローカル開発

### API の起動（開発モード）

#### ローカルランタイムで起動
```bash
cd app
pnpm install
pnpm dev
```

#### ローカル Kubernetes で起動

`environment` ディレクトリで Skaffold を実行します（コマンドの意味の違いは [Skaffold コマンドの使い分け](#skaffold-commands)）。

```bash
cd environment
skaffold run --port-forward
```

デフォルトは **ポート 13000**（`http://localhost:13000`）。外部 API の向き先は環境変数 `QIITA_URL` / `ZENN_URL` で変えられます（`app/.envrc.example` 参照）。

### 本番相当の起動

#### ローカルランタイムで起動
```bash
cd app
pnpm install
pnpm build
pnpm start
```

#### ローカル Kubernetes で起動

`environment` ディレクトリで Skaffold を実行します（コマンドの意味の違いは [Skaffold コマンドの使い分け](#skaffold-commands)）。

```bash
cd environment
skaffold run --port-forward
```

## テスト

### 単体テスト（`app`）

```bash
cd app
pnpm install
pnpm vitest run
```

### E2E（`e2e`）

API と WireMock（Qiita / Zenn 相当を別ポートで起動）を用意し、環境変数 `TARGET_URL`・`QIITA_URL`・`ZENN_URL` をセットしたうえで実行します。手元の例は `e2e/.envrc.example` を参照してください。

```bash
cd e2e
pnpm install
pnpm vitest run
```

Kubernetes 上に **モック（WireMock）だけ** 載せて、API は手元の `pnpm dev` などで動かす流れは、[Skaffold コマンドの使い分け](#skaffold-commands)（`skaffold dev --port-forward`）を参照してください。

## CI（GitHub Actions）

`main` への push または pull request で、**`app/**` に変更があるとき**にワークフローが走ります。

1. `app` で依存関係を入れ、Vitest で単体テスト
2. Docker で WireMock を 2 つ起動し、API をバックグラウンドで起動したうえで `e2e` で `pnpm vitest run`
3. `environment` で Skaffold により Docker イメージをビルド

手動実行は `workflow_dispatch` からも可能です。

## Docker / Kubernetes

| 項目 | 場所・内容 |
|------|------------|
| Dockerfile | `environment/app/Dockerfile`（Skaffold 上のビルドコンテキストは `app/`） |
| Skaffold | `environment/skaffold.yaml` — ビルド後、Helm で `hono-api` をデプロイ可能 |
| WireMock 連携 | `dev` 実行時など、`with-mock` プロファイルで WireMock 用イメージと Helm リリースを追加 |
| 本番向け調整 | `prd` プロファイルでレプリカ数などを上書き |

クラスタ固有の設定やシークレットは、利用環境に合わせて Helm チャートを拡張してください。

<a id="skaffold-commands"></a>

### Skaffold コマンドの使い分け

いずれも **`environment` ディレクトリ**で実行します。ローカル Kubernetes と [Skaffold](https://skaffold.dev/) が前提です。

| 目的 | コマンド | 補足 |
|------|----------|------|
| **イメージだけビルド** | `skaffold build` | 主に **CI** と同様の用途。コンテナイメージのビルドのみで、アプリケーションは起動しません。 |
| **E2E 用・モックだけ k8s** | `skaffold dev --port-forward` | **E2E** で使う想定。API 本体は Kubernetes では動かさず、モックサーバー（WireMock）をローカルクラスタ上に立てます。API は別途 `app` で `pnpm dev` などとして起動し、ポートフォワードしたモックの URL を `QIITA_URL` / `ZENN_URL` に向けてから E2E を実行します。 |
| **アプリだけ k8s** | `skaffold run --port-forward` | ローカル k8s で **API だけ** デプロイするとき。モック用の依存サービスはクラスタ上では立てず、Helm のデフォルトどおり **本番相当の URL**（例: `https://qiita.com`）へリクエストが飛びます。 |

`skaffold dev` で API を Kubernetes に載せずモックだけにしているのは、ローカル実行のほうが変更の反映が速いことに加え、本番用の Deployment に開発専用の volume 定義を混ぜたくないためです。

設定の詳細は `environment/skaffold.yaml`（プロファイルや `dev` 時のパッチなど）を参照してください。

## ライセンス

[MIT License](LICENSE)（リポジトリ直下の `LICENSE` ファイル）。
