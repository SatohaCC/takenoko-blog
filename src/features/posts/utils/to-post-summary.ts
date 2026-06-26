import type { Post, PostSummary } from '../types';

/**
 * クライアントコンポーネントへ渡す前に、シリアライズ負荷の大きい `content` を除いた
 * `PostSummary[]` に変換します。
 */
export const toPostSummaries = (posts: Post[]): PostSummary[] =>
  posts.map(({ slug, frontmatter }) => ({ slug, frontmatter }));
