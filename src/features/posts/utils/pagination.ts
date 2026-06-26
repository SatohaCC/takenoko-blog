import { siteConfig } from '@/content/site';

/**
 * 総件数とページあたりの件数から総ページ数を算出します。
 *
 * @example calcTotalPages(13) // => 3 (postsPerPage = 6)
 */
export const calcTotalPages = (totalCount: number, perPage = siteConfig.postsPerPage): number =>
  Math.ceil(totalCount / perPage);

/**
 * ルートパラメータのページ番号文字列を検証して数値に変換します。
 * 数値でない、または1未満の場合は無効として `null` を返します。
 *
 * @example parsePageParam('2') // => 2
 * @example parsePageParam('abc') // => null
 */
export const parsePageParam = (value: string): number | null => {
  const page = parseInt(value, 10);
  if (isNaN(page) || page < 1) {
    return null;
  }
  return page;
};

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
