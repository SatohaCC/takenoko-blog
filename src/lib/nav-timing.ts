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

const isDev = process.env.NODE_ENV === 'development';

/** メトリクス送信先のエンドポイント。 */
const METRICS_ENDPOINT = '/api/metrics/navigation';

/**
 * 送信のサンプリング率（0〜1、1 = 全件送信）。
 * 本番でトラフィックが多い場合はここを下げて送信量・サーバー負荷を抑える。
 */
const SAMPLE_RATE = 1;

/**
 * 画面遷移の開始を記録する。`instrumentation-client.ts` の `onRouterTransitionStart` から呼ぶ。
 */
export function startNavigation(url: string, navigationType: string): void {
  globalThis.__pendingNavigation = {
    url,
    label: NAVIGATION_TYPE_LABELS[navigationType] ?? navigationType,
    startTime: performance.now(),
  };
}

/**
 * 直近に開始した画面遷移の所要時間を計測し、サーバーへ送信して集計させる。
 * 開発時は手元での確認用にコンソールへも日本語で出力する。
 * 遷移が完了（遷移先がレンダー）した時点で呼ぶ。開始記録が無い場合は何もしない。
 */
export function logNavigationComplete(destinationUrl: string): void {
  const pending = globalThis.__pendingNavigation;
  if (!pending) return;
  globalThis.__pendingNavigation = undefined;

  const duration = Math.round(performance.now() - pending.startTime);

  // 開発時は手元ですぐ確認できるよう、色付きでコンソールにも出す。
  if (isDev) {
    console.log(
      `%c[画面遷移]%c ${pending.label}: %c${duration}ms%c → ${destinationUrl}`,
      'color: #6b4f3a; font-weight: bold;', // チョコレートブラウン
      'color: inherit;',
      'color: #4a7c3a; font-weight: bold;', // バンブーグリーン
      'color: #888;'
    );
  }

  // サーバーへ送信して集計させる（本番でも動く）。
  reportNavigation({ url: destinationUrl, type: pending.label, duration });
}

/** 計測値をサーバーのメトリクスエンドポイントへ送信する。 */
function reportNavigation(payload: { url: string; type: string; duration: number }): void {
  // サンプリング: 確率的に間引いて送信量を抑える。
  if (Math.random() >= SAMPLE_RATE) return;

  try {
    const body = JSON.stringify(payload);

    // sendBeacon はページ離脱中でも送信されやすく、メインスレッドをブロックしない。
    // application/json で送るため Blob にラップする。
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(METRICS_ENDPOINT, blob);
    } else {
      // 非対応環境向けフォールバック。keepalive で離脱中の送信を保証する。
      void fetch(METRICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      });
    }
  } catch {
    // 送信失敗はアプリ本体に影響させない。
  }
}
