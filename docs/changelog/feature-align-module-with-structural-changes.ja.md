# Analytics を現在の外部モジュール構造に対応

**機能ブランチ:** feature-align-module-with-structural-changes

## Bootstrap のみによる読み込み

廃止された API マニフェストエントリーポイントを削除し、有効な Analytics モジュールを Cognis が `entrypoints.bootstrap` と `bootstrapModule(ctx)` のみから読み込むようにしました。無効状態専用のエントリーポイントは、モジュールのライフサイクル用として維持されます。

## より安全な障害記録

Analytics は、汎用的な API エラーを返す前に、アクティビティ書き込みの失敗を安全なコンポーネントおよび操作メタデータとともにホストロガーへ記録するようになりました。

## 契約検証と文書

構造契約テストと、ローカライズされたすべての標準文書を更新しました。バージョン 2.1.5 では、パッケージ整合性ハッシュも再生成されています。

## コミット

- [f111f3c](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/f111f3c2c724f56b6bb7035bed174f9130a8b2db)
