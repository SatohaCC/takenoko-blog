/**
 * 画面遷移メトリクスの受け口（Route Handler）。
 *
 * - POST: クライアントの `sendBeacon` から計測値を受け取り、集計ストアへ記録する。
 * - GET : 現在の集計結果（URL 別 p50 / p95）を JSON で返す。動作確認・可視化用。
 *
 * この「受け口」自体はホスティング非依存で、Next.js がサーバーとして動く環境なら
 * どこへデプロイしても同じコードで動く。保存先（ここではプロセスメモリ）だけが
 * 環境ごとに用意するパーツ。
 */
import { getAllAggregates, recordSample } from '@/lib/metrics/navigation-store';

type NavigationMetric = {
  url: string;
  type: string;
  duration: number;
};

function isValidMetric(value: unknown): value is NavigationMetric {
  if (typeof value !== 'object' || value === null) return false;
  const metric = value as Record<string, unknown>;
  return (
    typeof metric.url === 'string' &&
    typeof metric.duration === 'number' &&
    Number.isFinite(metric.duration) &&
    metric.duration >= 0
  );
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!isValidMetric(payload)) {
    return new Response('Invalid payload', { status: 400 });
  }

  recordSample(payload.url, payload.duration);

  // サーバー側ログ＝ここが「集計の場」。受信のたびに URL 別の最新集計を出す。
  const aggregate = getAllAggregates().find((item) => item.url === payload.url);
  console.log(
    `[メトリクス受信] ${payload.url} ${Math.round(payload.duration)}ms ` +
      `| 件数:${aggregate?.count} p50:${aggregate?.p50}ms p95:${aggregate?.p95}ms`
  );

  // 計測値の受信応答は本文不要。204 で軽量に返す。
  return new Response(null, { status: 204 });
}

export function GET(): Response {
  return Response.json(getAllAggregates());
}
