# 文書構成とホストの契約

**機能ブランチ:** feature-documentation-core-alignment

## 構造化した文書

Info、使用例、技術情報を、マニフェストで宣言する完全な多言語の文書一式にします。利用者向けの紹介、具体的な手順、現在の API と設定の契約を分けて説明します。構成、参照先、ファイル名の厳密な検証を独立したテストと CI で実行します。ソースファイルへのリンクは既定ブランチを参照し、変更履歴のコミットラベルは短い形式を使います。

## ゲートウェイの診断

実行時の診断はホストのログゲートウェイと出力方針に従います。コマンドの報告は端末出力を使い、モジュールの JavaScript では別名や動的な参照も含めてネイティブコンソールへのアクセスを検証します。プロバイダーの所有範囲、権限確認、ガイド完了の識別子を維持します。

## コンパクトな画面で読めるレポート

レポートの行は Composer のコンパクト表示を使い、イベントの棒を名前と件数の下に置きます。集計とフィルターは折り返し、列比率を固定したイベント表は狭い画面で日時を折り返して、ホストの文字とテーマの設定に従います。

## 役割が分かるバインディング名

構文木による名前検証は、既存違反やファイル別の除外を設けず、JavaScript と TypeScript のソース、ツール、テスト、フィクスチャを走査します。実行時バインディング、シグネチャの引数名、非公開メンバー、所有する複合型名とメソッド名を検証します。`db`、`this.db`、`args`、LDAP の `dn` など、一般的な短縮形は独立した名前に使用できます。上流から引き継いだ名前も含め、複合名の測定単位以外の省略語は `DatabaseExecutor`、`KeyringDatabaseExecutor`、`createDatabaseExecutor`、`baseDistinguishedName`、`registerStaticDirectory` のように展開します。不明瞭な省略名、番号付きの仮名、無視するバインディングの値の使用は検証に失敗します。未使用かつ非公開の `_`、`id`、算術カウンター `i`・`j`・`k` は定義された役割を維持します。ジェネリック型パラメーター、依存ライブラリーやプラットフォームの正規名、公開ペイロードのキーは契約を維持します。所有する API の宣言、インポート、エクスポート、呼び出し元は同じ名前を使用し、型を含めて名前を変えるだけの別名は検証に失敗します。回帰フィクスチャで独立名と複合名の区別、およびプラットフォーム API の正規名を保護します。各言語の技術文書、貢献指針、モジュールのバージョン、ロックファイル、パッケージのハッシュを同期します。`ms`、`sec`、`px`、`rad`、`deg` などの測定単位は複合名でも短縮形を維持し、時間とピクセルの名前を `INVITE_EXPIRY_MS`、`timeoutMs`、`widthPx` などの形式に戻します。回帰フィクスチャで単位の例外を検証し、隣接する不明瞭な省略語は引き続き拒否します。

## コミット

- [3e91917](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/3e9191776d8df2cb1a3e0f57b18efd76a124b894)
- [5cf0109](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/5cf0109d1f912d473d87a82758ac2aca033a8ddf)
- [278e8c9](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/278e8c9371ad3dd631671314d29ef1fce8b541c3)
- [9ae1d59](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/9ae1d590121911358a6a7aa6666d1b8e5f3299b7)
- [c0cf61b](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/c0cf61b731fc0a709e187fef06067d98b9375aee)
- [d6f2060](https://github.com/Cognis-Labs-HQ/cognis-module-analytics/commit/d6f2060e9b2c06821febc6bc94fc4798b5f4cae2)
