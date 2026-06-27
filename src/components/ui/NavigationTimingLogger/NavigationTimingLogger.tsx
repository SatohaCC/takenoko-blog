'use client';

import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { logNavigationComplete } from '@/lib/nav-timing';

/**
 * 画面遷移の完了を検知して所要時間をログ出力するコンポーネント。
 *
 * 遷移先のルートがレンダーされると pathname / searchParams が更新され、`useEffect` が発火する。
 * このタイミングを遷移完了とみなし、`instrumentation-client.ts` が記録した開始時刻から
 * 所要時間を算出する。UI は描画しない（`null` を返す）。
 *
 * `useSearchParams` を使うため、呼び出し側で `<Suspense>` で囲む必要がある。
 */
export function NavigationTimingLogger(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    logNavigationComplete(url);
  }, [pathname, searchParams]);

  return null;
}
