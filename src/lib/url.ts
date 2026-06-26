import { siteConfig } from '@/content/site';

/** siteConfig.url の末尾スラッシュを除去した正規化済みオリジン */
const siteOrigin = siteConfig.url.replace(/\/+$/, '');

/**
 * サイト内パスから絶対URLを生成します。
 * オリジンとパスの双方を正規化することで、二重スラッシュ（例: `https://example.com//posts`）を防ぎます。
 *
 * @example absoluteUrl('/posts/hello') // => 'https://satoha.net/posts/hello'
 * @example absoluteUrl() // => 'https://satoha.net'
 */
export const absoluteUrl = (path = ''): string => {
  if (!path) {
    return siteOrigin;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteOrigin}${normalizedPath}`;
};
