# ドキュメント

このブログプロジェクトのドキュメント一覧です。恒常的に参照するリファレンスと、特定作業の成果物（アーカイブ）を分けて管理しています。

プロジェクト全体のセットアップ・コマンド・アーキテクチャ概要は、リポジトリ直下の [`CLAUDE.md`](../CLAUDE.md) を参照してください。

## reference/ — リファレンス

開発時に随時参照する、恒常的なドキュメントです。

| ドキュメント | 内容 |
| :--- | :--- |
| [reference/design.md](./reference/design.md) | デザインシステム（Takenoko テーマ、Panda CSS、コンポーネント設計、MDX）。 |
| [reference/animations.md](./reference/animations.md) | View Transitions API を用いたページ遷移アニメーションの仕様。 |
| [reference/testing.md](./reference/testing.md) | テスト戦略（Vitest / Storybook / Playwright の使い分けと実装パターン）。 |
| [reference/panda-config-troubleshooting.md](./reference/panda-config-troubleshooting.md) | `panda.config.ts` 変更後にビルドエラーが解消しない場合のクリーンアップ手順。 |

## archive/ — 作業アーカイブ

特定の Issue・タスクに紐づく、完了済みの設計仕様や作業記録です。当時のスナップショットとして残しており、現状のコードと差異が生じる場合があります。

| ドキュメント | 内容 |
| :--- | :--- |
| [archive/issue-48-vercel-optimization/](./archive/issue-48-vercel-optimization/) | Issue #48: Vercel ベストプラクティスに基づくシリアライズ／インポート最適化の[設計仕様](./archive/issue-48-vercel-optimization/technical-specification.md)と[作業記録](./archive/issue-48-vercel-optimization/walkthrough.md)。 |
