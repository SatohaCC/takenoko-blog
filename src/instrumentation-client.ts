/**
 * クライアントサイド instrumentation。
 * React のハイドレーション前に実行され、ルーター遷移の開始を監視する。
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */
import { startNavigation } from '@/lib/nav-timing';

/**
 * ルーター遷移が開始されたときに呼ばれるフック。
 * 遷移の開始時刻を記録し、完了は `NavigationTimingLogger` 側で計測する。
 */
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
): void {
  try {
    startNavigation(url, navigationType);
  } catch {
    // 計測の失敗がアプリ本体に影響しないよう握りつぶす
  }
}
