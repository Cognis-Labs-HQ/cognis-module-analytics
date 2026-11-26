# 使用例

外部の解析サービスを使わず、アカウントの利用状況とモジュールのイベント集計を確認できます。

## 前提条件

モジュールの有効化後に管理者としてログインします。完全なレポートにはデータベースとアカウントサービスが必要です。

## 使用例

Administration の Analytics を開き、集計期間を選んでから更新し、期間に応じたグラフを確認します。

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

管理画面の分析フィルターとグラフを紹介します。管理者セッションとサーバー接続が必要です。

## 期待される結果

選択した期間の許可されたアカウント情報とモジュールのイベントが表示されます。イベント送信によって外部解析事業者へテレメトリーを送りません。

## 問題の解決

古いグラフは更新し、管理者権限とサービスの状態を確認します。イベントのメタデータに秘密情報や私的なメッセージを含めないでください。
