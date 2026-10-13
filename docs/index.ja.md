# Analytics モジュール

Analytics モジュールは、外部の分析サービスへテレメトリを送信することなく、アカウント状態、利用状況、登録、およびモジュール所有イベントに関するプライバシー重視の情報を Cognis 管理者へ提供します。アカウントデータは公開された `auth:accountStore` Capability 経由で読み取り、モジュール自身のアクティビティログ API に送信されたイベントだけを保存します。

## 使用例

Cognis 管理画面の **Analytics** セクションを開くと、アカウント総数、有効アカウント、過去 7 日間のアクティビティ、30 日間の休眠、ロール分布、登録傾向、イベント合計、最近のイベントを確認できます。7、30、または 90 日の期間を選択し、表示を更新してください。

同じ契約を CLI から利用できます。

```sh
cognisctl modules:analytics:metrics
cognisctl modules:analytics:series 30
cognisctl modules:analytics:eventSummary 30
cognisctl modules:analytics:activityLog 20
```

任意の JSON メタデータを付けてモジュール所有イベントを記録します。

```sh
cognisctl modules:analytics:activityLog:record report_exported '{"format":"csv"}'
```

認可されたクライアントは HTTP API を直接利用できます。

```http
GET /api/v1/modules/analytics/metrics?days=30
GET /api/v1/modules/analytics/series?days=30
GET /api/v1/modules/analytics/type-summary?days=30
GET /api/v1/modules/analytics/activity-log?limit=20
POST /api/v1/modules/analytics/activity-log
Content-Type: application/json

{"eventType":"report_exported","meta":{"format":"csv"}}
```

書き込みが成功すると、生成されたイベント ID と HTTP `201` が返ります。イベントメタデータに秘密情報、認証情報、メッセージ本文、または機微な個人データを含めないでください。

## 技術仕様

### インストールとライフサイクル

Cognis Module Marketplace からインストールするか、完全なリポジトリを設定済みの外部モジュールディレクトリへ配置します。マニフェストは、有効なモジュールの唯一のエントリーポイントとして `bootstrap.js` を宣言します。Cognis はすべてのランタイムソースを検証してから読み込み、`bootstrapModule(ctx)` がスコープ付きホストコンテキストを通じて管理セクションと API ルートを登録します。ランタイムの API URL はすべて `/api/v1/modules/analytics` 内に収まり、画面のフォントサイズにはユーザー設定に追従する相対単位を使用するため、有効化時と更新時のホスト境界契約を満たします。Analyticsには有効化前の設定がないため、無効なモジュールは実行時APIや画面を公開せず、有効化用のbootstrapも実行しません。モジュールにはホストの `db:executor` と `auth:accountStore` Capability が必要です。モジュール所有のイベントスキーマは起動時に確保され、初期化失敗は安全なコンポーネントおよび操作メタデータとともに記録されます。

配布時は `manifest.json`、`package.json`、`package-lock.json`、`routes.json`、`bootstrap.js`、API、CLI、UI、データベースマイグレーション、言語リソース、文書、アセット、マニフェストハッシュを一緒に保持してください。モジュール UUID は恒久的です。

Marketplace のアートワークには、`manifest.json` の `assets.icon` と `assets.banner` で宣言されたファイルを使用します。どちらのファイルも検証済みパッケージ一覧に含まれます。

### 管理インターフェース

管理セクションは `admin` ロールに制限され、次を表示します。

- アカウント総数、有効、最近のアクティブ、新規登録、休眠の各件数
- アクティベーション率とアカウントロール別件数
- 選択期間の日次登録系列
- モジュールイベント総数、null でない一意のアクター、イベントタイプ別件数
- 新しい順に並べた最近のモジュールイベント

UI 文字列はモジュール所有のドイツ語、英語、インドネシア語、日本語 XML リソースから取得します。タイムスタンプは、提供されている場合はホストのフォーマッターへ委譲し、それ以外はブラウザーの `Intl.DateTimeFormat` を使用します。

### HTTP API

すべてのルートには `admin` ロールが必要です。

- `GET /api/v1/modules/analytics/metrics?days=<n>`: 日数の既定値は30で、1〜365の整数のみ指定できます。不正な値は自動補正せず400を返します。
- `GET /api/v1/modules/analytics/series?days=<n>` は期間内の UTC 日付ごとに `{ date, count }` を返し、同じ `days` 規則を使用します。
- `GET /api/v1/modules/analytics/type-summary?days=<n>` は `{ total, uniqueActors, byType }` を返します。`event-summary` は同等の互換ルートです。ブラウザー UI は、`event` を含む URL を遮断するプライバシーフィルターを避けるため `type-summary` を使用します。
- `GET /api/v1/modules/analytics/activity-log?limit=<n>`: limitを省略すると一致するすべてのイベントを返します。指定する場合は正の安全な整数とし、その値を正確に適用します。不正な値は400を返します。
- `POST /api/v1/modules/analytics/activity-log` は `{ eventType, meta }` を受け取ります。UTF-8 JSON 本文は 16 KiB まで、`eventType` はトリム後 64 文字までで、`meta` は配列ではないオブジェクトの場合だけ保存されます。

### 応答と障害

読み取り成功時は `data` プロパティを含む HTTP `200` を返します。イベントストレージが利用できない場合、イベント概要とアクティビティログは安全な空結果を返し、メトリクスと系列は `503` を返します。不正な JSON またはイベントタイプの欠落は `400`、過大な本文は `413`、ストレージなしの書き込みは `503` です。クエリまたは書き込み障害では内部詳細を含まない安全な一般エラーを返します。クエリおよびスキーマ障害はホストロガーへ記録します。

### 永続化とプライバシー

アカウントメトリクスは公開された `auth:accountStore` Capability を利用し、アカウントレコードを複製しません。カスタムイベントは、ID、イベントタイプ、任意のアカウント ID、シリアライズ済みメタデータ、作成時刻とともにモジュール所有の `sample_analytics_events` テーブルへ保存されます。現在 API から作成するイベントのアカウント ID は null です。最近のイベント応答はメタデータを除外し、概要はイベントタイプと null でないアクターを集計します。

モジュールは外部の分析プロバイダーへ接続しません。適切なイベント名の定義、メタデータの最小化、モジュールテーブルへの保持要件の適用、および管理アクセスの制限は運用者の責任です。

### CLI 契約

`modules:analytics:metrics`、`modules:analytics:series [days]`、`modules:analytics:eventSummary [days]`、`modules:analytics:activityLog [limit]` は対応する認証済みモジュールルートを呼び出します。`modules:analytics:activityLog:record <event-type> [meta-json]` は POST 前に任意のメタデータを JSON として解析します。不正な JSON と必須引数の欠落は CLI が報告します。

### 運用検証

パッケージ対象ファイルを変更した後は、次を実行します。

```sh
npm install
npm test
npm run lint
npm run manifest:hashes
npm run check:manifest
git diff --check
```

`npm run manifest:hashes` は SHA-256 ダイジェストで `manifest.files` を再構築し、リポジトリの Prettier 設定でマニフェストを整形します。`npm run check:manifest` はバージョン、エントリポイント、ルート、パッケージパス、ファイルダイジェストを検証します。

Cognis がモジュールをアンインストールする際、コンテンツの削除を選択すると、モジュール所有の分析イベントがすべて削除されます。コンテンツの削除を選択しない場合、それらのイベントは保持されます。クリーンアップ操作は、イベントのペイロードを含めずにホストのロガーへ記録されます。

### 所有するアクションフロー

アカウントメトリクスと登録系列は`auth:accountStore.list()`と`getInfo()`を利用し、他のコンポーネントのテーブルを直接参照しません。`db:executor`を使用するのはモジュール所有のイベントのみです。

HTTP操作は、検証・実行・表示のステージを持つモジュール所有のctxフローを通じて実行します。テストはこれらのステージを実行し、検証やスキーマ初期化が失敗した場合に保存が行われないことを確認します。

### 開発者向け構成とホストの責任範囲

新しいモジュールは[cognis-module-template](https://github.com/Cognis-Labs-HQ/cognis-module-template)から作成し、このリポジトリでは`AGENTS.md`に記載されたテンプレート版の指針に従います。`bootstrap.js`はライフサイクルの調整、`api/index.js`はctx依存関係の接続、`api/routes/<domain>/index.js`はHTTP処理、`api/reuse/`は再利用するサーバーコードを担当します。ブラウザー機能は`ui/`、スタイルは`ui/styles/`、再利用するマークアップは`ui/templates/`、翻訳された文書は`docs/index.<locale>.md`に配置します。過去のリリース記録は`docs/changelog/`に置き、パッケージのハッシュ対象から除外します。対応しない任意の領域は作成しません。

公開ctx機能と宣言されたフローを利用し、Cognis内部や他のモジュールをインポートしないでください。ダッシュボードの機能・ナビゲーション提供スクリプトは`mountProvider(scopedUiCtx)`を公開し、所有するリソースの終了処理を返します。インポート時にモジュールの動作を登録してはいけません。ホストは無効化時に機能、フローフック、リスナー、提供状態を解除し、再有効化時にキャッシュ済みスクリプトを再マウントします。設定・管理画面のファクトリーと認証フッターの記述子は、それぞれの公開ホスト契約に従います。独立したテスト用実装で契約を検証し、構成チェックを実行し、最後のパッケージ変更後にハッシュを更新して、公開前にlint、テスト、マニフェスト検証を実行してください。
