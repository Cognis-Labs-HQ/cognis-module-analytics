# 送信応答の検証

**機能ブランチ:** fix-analytics-delivery-responses

## 送信応答の検証

Analytics は、保存済みイベントの ID を含む、リダイレクトのない正常な JSON 応答を受け取った場合のみ、キュー内の活動を送信済みとします。HTML、空または不正な本文、ID の欠落は再試行可能な 502 相当の送信エラーとなり、次の試行でも元のイベント識別情報を保持します。不正な JSON は安全なステータス情報とともに記録し、応答本文は記録しません。

## コミット

- [221efac](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/221efac097286f2fe90809303620d35bfa873fef)
- [84316b7](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/84316b71a2250f56b4c189ff612ccc83e6b9eec7)
