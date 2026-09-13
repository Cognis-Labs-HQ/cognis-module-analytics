# Marketplace の PNG バナーを使用

**機能ブランチ:** work

## アイコンとバナーの参照を修正

モジュールマニフェストが同梱された PNG バナーを参照し、テーマ対応の SVG アイコンは引き続き使用するため、Cognis は正確なファイル名の大文字と小文字で各 Marketplace アセットを読み込めます。

## 宣言済みアートワークを検証

構造テストで、宣言された両方の Marketplace アセットが安全なリポジトリ相対ファイルであり、マニフェストのパッケージ一覧に含まれることを検証するようになりました。

## コミット

- [0254f55](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/0254f558b42b406c1532c1474e12fe2b46362805)
