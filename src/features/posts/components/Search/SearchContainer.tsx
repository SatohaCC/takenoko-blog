import {
  buildSearchUrl,
  getPaginatedSearchPosts,
  getSearchTotalCount,
  getSearchTotalPages,
} from '@/features/posts/api/search';
import { PostListPresentational } from '@/features/posts/components/PostList/PostListPresentational';
import { toPostSummaries } from '@/features/posts/utils/to-post-summary';

type SearchContainerProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export const SearchContainer = async ({ searchParams }: SearchContainerProps) => {
  const { q, page } = await searchParams;
  const query = q || '';
  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1);

  const [posts, totalPages, totalCount] = await Promise.all([
    getPaginatedSearchPosts(query, currentPage),
    getSearchTotalPages(query),
    getSearchTotalCount(query),
  ]);

  const sanitizedPosts = toPostSummaries(posts);

  return (
    <PostListPresentational
      posts={sanitizedPosts}
      totalPages={totalPages}
      totalCount={totalCount}
      currentPage={currentPage}
      title={query ? `"${query}" の検索結果` : '検索'}
      subtitle={query ? undefined : '検索キーワードを入力してください'}
      getPageUrl={(p) => buildSearchUrl(query, p)}
    />
  );
};
