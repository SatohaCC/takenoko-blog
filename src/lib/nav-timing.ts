/**
 * クライアントサイドの画面遷移（ソフトナビゲーション）の所要時間を計測するための共有ロジック。
 *
 * Next.js には遷移「開始」のフック（`onRouterTransitionStart`）はあるが、遷移「完了」のフックは
 * 存在しない。そのため、開始時刻を記録しておき、遷移先がレンダーされた時点
 * （`NavigationTimingLogger` の `useEffect`）で所要時間を算出してログ出力する。
 *
 * `instrumentation-client.ts` と React コンポーネントは別エントリのため、計測状態は
 * `globalThis` 上で共有する。
 */

/** Next.js のナビゲーション種別を日本語ラベルへ対応付ける。 */
const NAVIGATION_TYPE_LABELS: Record<string, string> = {
  push: '画面遷移',
  replace: '置き換え',
  traverse: '履歴移動',
};

type PendingNavigation = {
  /** 遷移先 URL */
  url: string;
  /** 日本語のナビゲーション種別ラベル */
  label: string;
  /** `performance.now()` による開始時刻（ミリ秒） */
  startTime: number;
};

declare global {
  var __pendingNavigation: PendingNavigation | undefined;
}

/** ログ出力は開発時のみ有効にする（本番ビルドではコンソールを汚さない）。 */
const isEnabled = process.env.NODE_ENV === 'development';

/**
 * 画面遷移の開始を記録する。`instrumentation-client.ts` の `onRouterTransitionStart` から呼ぶ。
 */
export function startNavigation(url: string, navigationType: string): void {
  if (!isEnabled) return;

  globalThis.__pendingNavigation = {
    url,
    label: NAVIGATION_TYPE_LABELS[navigationType] ?? navigationType,
    startTime: performance.now(),
  };
}

/**
 * 直近に開始した画面遷移の所要時間を計測し、日本語でコンソールへ出力する。
 * 遷移が完了（遷移先がレンダー）した時点で呼ぶ。開始記録が無い場合は何もしない。
 */
export function logNavigationComplete(destinationUrl: string): void {
  if (!isEnabled) return;

  const pending = globalThis.__pendingNavigation;
  if (!pending) return;
  globalThis.__pendingNavigation = undefined;

  const duration = Math.round(performance.now() - pending.startTime);

  console.log(
    `%c[画面遷移]%c ${pending.label}: %c${duration}ms%c → ${destinationUrl}`,
    'color: #6b4f3a; font-weight: bold;', // チョコレートブラウン
    'color: inherit;',
    'color: #4a7c3a; font-weight: bold;', // バンブーグリーン
    'color: #888;'
  );
}
