/**
 * 画面遷移メトリクスの集計ストア（学習用の最小実装）。
 *
 * ⚠️ これはプロセスメモリ上に貯めるだけの簡易版で、実運用には向かない:
 *   - サーバーを再起動すると消える
 *   - 複数インスタンス / サーバーレス環境では各プロセスがバラバラに保持し、共有されない
 *   - 無制限に貯めるとメモリを圧迫する（ここでは URL ごとに上限を設ける）
 *
 * 本番では「生データを DB（ClickHouse / BigQuery 等）や監視サービスへ送り、
 * クエリ側でパーセンタイルを計算する」のが定石。ここでは集計の考え方
 * （平均ではなくパーセンタイルで見る）を体感するためのデモとして実装している。
 */

/** URL ごとに保持するサンプル数の上限（古いものから捨てる）。 */
const MAX_SAMPLES_PER_URL = 1000;

/** URL → 所要時間（ミリ秒）の生サンプル列。 */
const samplesByUrl = new Map<string, number[]>();

export type NavigationAggregate = {
  url: string;
  /** サンプル数 */
  count: number;
  /** 中央値（普通のユーザー体験） */
  p50: number;
  /** 95 パーセンタイル（遅い側のユーザー体験） */
  p95: number;
  /** 最大値 */
  max: number;
};

/** 1 件の計測値を記録する。 */
export function recordSample(url: string, duration: number): void {
  const samples = samplesByUrl.get(url) ?? [];
  samples.push(duration);
  // 上限を超えたら古いサンプルを捨てる（メモリ保護）。
  if (samples.length > MAX_SAMPLES_PER_URL) {
    samples.shift();
  }
  samplesByUrl.set(url, samples);
}

/**
 * ソート済み配列から指定パーセンタイル値を取り出す（nearest-rank 法）。
 * レイテンシは外れ値に弱いため、平均ではなくパーセンタイルで集計する。
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[index];
}

/** 特定 URL の集計結果を返す。サンプルが無ければ undefined。 */
export function getAggregate(url: string): NavigationAggregate | undefined {
  const samples = samplesByUrl.get(url);
  if (!samples || samples.length === 0) return undefined;

  const sorted = [...samples].sort((a, b) => a - b);
  return {
    url,
    count: sorted.length,
    p50: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    max: sorted[sorted.length - 1],
  };
}

/** 全 URL の集計結果を、サンプル数の多い順に返す。 */
export function getAllAggregates(): NavigationAggregate[] {
  return [...samplesByUrl.keys()]
    .map((url) => getAggregate(url))
    .filter((aggregate): aggregate is NavigationAggregate => aggregate !== undefined)
    .sort((a, b) => b.count - a.count);
}
