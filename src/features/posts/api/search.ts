import { cacheLife } from 'next/cache';

import { getAllPosts } from '@/features/posts/api/posts';
import type { Post } from '@/features/posts/types';
import { getPageItems, getTotalPages } from '@/features/posts/utils/pagination';

export const searchPosts = async (query: string): Promise<Post[]> => {
  'use cache';
  cacheLife('minutes');

  const normalizedQuery = query.slice(0, 100);
  if (!normalizedQuery.trim()) {
    return [];
  }

  const allPosts = await getAllPosts();
  const lowerQuery = normalizedQuery.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.frontmatter.title.toLowerCase().includes(lowerQuery) ||
      post.frontmatter.excerpt.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery)
  );
};

export const getSearchTotalCount = async (query: string): Promise<number> => {
  const posts = await searchPosts(query);
  return posts.length;
};

export const getSearchTotalPages = async (query: string): Promise<number> => {
  const posts = await searchPosts(query);
  // 検索結果は最低でも1ページ（空でも「検索結果なし」を表示する）を保証する
  return Math.max(1, getTotalPages(posts.length));
};

export const getPaginatedSearchPosts = async (query: string, page: number): Promise<Post[]> => {
  const posts = await searchPosts(query);
  return getPageItems(posts, page);
};

/**
 * 検索結果ページへのルート相対URLを組み立てます。
 * クエリが空、またはページが1の場合は対応するパラメータを省略します。
 *
 * @example buildSearchUrl('react', 2) // => '/search?q=react&page=2'
 */
export const buildSearchUrl = (query: string, page: number): string => {
  const params = new URLSearchParams();
  if (query) {
    params.set('q', query);
  }
  if (page > 1) {
    params.set('page', String(page));
  }
  const queryString = params.toString();
  return `/search${queryString ? `?${queryString}` : ''}`;
};
