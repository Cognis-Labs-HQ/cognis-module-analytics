# Analytics モジュールの有効化を復旧

**機能ブランチ:** work

## ライフサイクル境界への準拠

別モジュールの名前空間を参照し、Cognis のランタイムソース境界検証によって有効化時に Analytics が拒否される原因となっていた、同梱済みの無効なルート用フィクスチャを削除しました。Analytics のランタイムソースは、モジュール所有の API 名前空間内に収まるようになりました。

## 回帰テストとリリースメタデータ

ランタイム API URL の境界回帰テストを追加し、検証済みのライフサイクル契約を対応する全言語で文書化して、リリースバージョンを 2.1.3 に同期しました。

## 分離された無効時ライフサイクル

Analytics は、他の外部モジュールで使用されるライフサイクル構造に合わせ、無効時専用の API エントリーポイントを宣言するようになりました。Analytics には有効化前の設定がないため、このエントリーポイントはルートや Capability を登録せず、ランタイム処理も意図的に実行しません。自動テストでこの非動作契約を検証します。

## コミット

- [c651362](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c6513623d385236dfac25f3d11fdf881eee73237)

- [8da06b8](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/8da06b87b83b2335c17cdcd5c351f95d564dd6e0)
