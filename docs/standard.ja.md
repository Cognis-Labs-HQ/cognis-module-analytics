# Analytics Content

モジュール所有のコンテンツはモジュールパス配下に配置され、有効化されたときのみ読み込まれます。

## レポート画面

管理画面では、アカウントの状態、登録傾向、ロール分布、イベント構成、
および最近のイベントの監査ビューを確認できます。すべての API ルートには
管理者ロールが必要です。イベントメタデータはモジュール内に保持され、
イベント本文は 16 KiB に制限されます。また、外部サービスへテレメトリを
送信することはありません。

運用担当者は CLI から `analytics:metrics`、`analytics:series [days]`、
`analytics:event-summary [days]`、`analytics:activity-log [limit]` を使用できます。
生成元は `analytics:activity-log:record <event-type> [meta-json]` を通じて、
許可リストにある組織イベントを記録できます。メタデータには秘密情報や
機微な個人情報を含めないでください。

## 外部配布

Analytics は `Cognis-Labs-HQ/cognis-module-analytics` へ切り出せる自己完結構成です。マニフェストは `requiresCapabilities` に `db:executor` を宣言し、Cognis がこのケイパビリティを提供するまでモジュールを起動してはいけません。ルートマニフェスト、パッケージ、ルート、ライセンス、アセット、CLI、API、UI、マイグレーション、翻訳文書、整合性ハッシュを一緒に配布します。
