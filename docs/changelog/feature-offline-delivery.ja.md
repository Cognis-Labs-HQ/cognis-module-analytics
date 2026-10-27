# 送信待ちと同意

**機能ブランチ:** feature-offline-delivery

## アカウント活動の削除

ライフサイクルに紐付く `analytics:deleteAccountActivity` フックは、`deprovision-user` の `cleanup-dependencies` を拡張します。アカウントの削除が永続化された後、スキーマの準備を待ち、削除された識別情報のダイジェストに一致するイベントのみを削除します。認証済み活動の記録と同じ SHA-256 導出を使用します。他のアカウントと匿名の管理者イベントは保持されます。無効化、アーカイブ、拒否された削除要求では活動を保持します。失敗は記録して呼び出し元に伝え、再有効化の前にホストがモジュールの終了処理でフックを解除します。

## 送信待ちと同意

Analytics は `POST /api/v1/modules/analytics/activity` とブラウザーフロー `analytics:recordActivity` で認証済みの活動を記録します。アカウント別の冪等キーで重複を防ぎ、元の発生時刻を維持します。移動と Study 操作には安全なスカラーメタデータ（`component`、`action`、`result`、`count`、`durationMs`）のみを含め、その他のデータは保存前に拒否します。レポートのアカウントはハッシュ化されます。無効化すると送信処理とリスナーを解除します。

ホストは ctx 経由で `offline:outbox`、`offline:state`、`offline:accessPolicy` を提供します。各コンポーネントはプロバイダーの有効期間中に送信処理を登録し、安定した操作 ID を `offline:enqueue` に渡します。`offline:flush` が認可と送信を行います。永続キューはアカウント別で最大 1,000 件・1 MB・7 日間、トークンは保存しません。元の ID と時刻を維持し、一時的な失敗を再試行し、確認済みまたは恒久的に拒否された項目を削除します。拒否は翻訳済みの警告で通知します。ログアウトで当該アカウントのキューを消去し、他のアカウントのデータは送信しません。オフラインモードを無効にすると新規保存を停止します。既存の項目はオンラインで送信できます。

## バックグラウンド送信と警告

Analytics はホストの送信キューに `protectOnClose: false` を指定して登録します。ナビゲーションと活動のデータは永続キューに維持し、手動の接続確認を含む認可済み復旧後に送信しますが、ブラウザーの終了警告は発生させません。ユーザー編集には引き続きホストの既定の保護を適用します。更新されたホストの終了警告分類契約が必要です。

## コミット

- [16f40d7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/16f40d7bbb2a045da8b745f656150bcdc31c3489)
- [c6b5760](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6b57608b93128f46fe849c7a385805ab8ab0e55)
- [956bf8d](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/956bf8de31d3c13e885cbd6a28611ba0b78c5175)
