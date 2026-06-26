import { siteConfig } from '@/content/site';

/**
 * 総件数とページあたりの件数から総ページ数を算出します。
 *
 * @example getTotalPages(13) // => 3 (postsPerPage = 6)
 */
export const getTotalPages = (totalCount: number, perPage = siteConfig.postsPerPage): number =>
  Math.ceil(totalCount / perPage);

/**
 * 配列から指定ページ（1始まり）に対応するアイテムだけを切り出します。
 */
export const getPageItems = <T>(
  items: T[],
  page: number,
  perPage = siteConfig.postsPerPage
): T[] => {
  const startIndex = (page - 1) * perPage;
  return items.slice(startIndex, startIndex + perPage);
};
