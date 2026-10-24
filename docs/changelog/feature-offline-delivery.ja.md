# 送信待ちと同意

**機能ブランチ:** feature-offline-delivery

## 送信待ちと同意

Analytics は `POST /api/v1/modules/analytics/activity` とブラウザーフロー `analytics:recordActivity` で認証済みの活動を記録します。アカウント別の冪等キーで重複を防ぎ、元の発生時刻を維持します。移動と Study 操作には安全なスカラーメタデータ（`component`、`action`、`result`、`count`、`durationMs`）のみを含め、その他のデータは保存前に拒否します。レポートのアカウントはハッシュ化されます。無効化すると送信処理とリスナーを解除します。

ホストは ctx 経由で `offline:outbox`、`offline:state`、`offline:accessPolicy` を提供します。各コンポーネントはプロバイダーの有効期間中に送信処理を登録し、安定した操作 ID を `offline:enqueue` に渡します。`offline:flush` が認可と送信を行います。永続キューはアカウント別で最大 1,000 件・1 MB・7 日間、トークンは保存しません。元の ID と時刻を維持し、一時的な失敗を再試行し、確認済みまたは恒久的に拒否された項目を削除します。拒否は翻訳済みの警告で通知します。ログアウトで当該アカウントのキューを消去し、他のアカウントのデータは送信しません。オフラインモードを無効にすると新規保存を停止します。既存の項目はオンラインで送信できます。

## コミット

- [16f40d7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/16f40d7bbb2a045da8b745f656150bcdc31c3489)
