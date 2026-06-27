/**
 * サーバーサイド instrumentation。
 * Next.js サーバーインスタンスの起動時に一度だけ `register` が呼ばれる。
 * @see https://nextjs.org/docs/app/guides/instrumentation
 */
/**
 * サーバー起動時に一度だけ実行される初期化フック。
 *
 * 本来の用途は、リクエスト処理が始まる前に監視・計測ツールを起動・初期化すること。
 * 例えば以下のような処理をここに書く:
 *   - OpenTelemetry の初期化（registerOTel('next-app') など）
 *   - Sentry / Datadog など APM・エラートラッキング SDK の初期化
 *   - ログ基盤やメトリクス収集クライアントのセットアップ
 *
 * Edge と Node.js の両ランタイムで呼ばれるため、ランタイム固有のコードは
 * `process.env.NEXT_RUNTIME` で分岐し、副作用は動的 import で読み込むのが定石。
 *
 * このリポジトリは学習用で外部監視ツールを使わないため、ここでは起動確認用の
 * ログ出力（開発時のみ）に留めている。
 */
export function register(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[起動] Next.js サーバーを初期化しました（runtime: ${process.env.NEXT_RUNTIME}）`);
  }
}
