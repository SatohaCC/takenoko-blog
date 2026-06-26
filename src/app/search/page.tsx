import { Suspense } from 'react';

import type { Metadata } from 'next';

import { buildSearchUrl } from '@/features/posts/api/search';
import { SearchContainer } from '@/features/posts/components/Search/SearchContainer';
import { SearchSkeleton } from '@/features/posts/components/Search/SearchSkeleton';
import { absoluteUrl } from '@/lib/url';

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q, page } = await searchParams;
  const query = q || '';
  const currentPage = parseInt(page ?? '1', 10) || 1;

  const title = query ? `"${query}" の検索結果` : '検索';

  return {
    title,
    description: query ? `「${query}」に関する記事の検索結果` : '記事を検索できます',
    alternates: { canonical: absoluteUrl(buildSearchUrl(query, currentPage)) },
  };
}

const SearchPage = ({ searchParams }: SearchPageProps) => (
  <Suspense fallback={<SearchSkeleton />}>
    <SearchContainer searchParams={searchParams} />
  </Suspense>
);

export default SearchPage;
