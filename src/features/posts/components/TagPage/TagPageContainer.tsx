import { notFound } from 'next/navigation';

import { getPostsByTag } from '@/features/posts/api/posts';
import { getPageItems, getTotalPages } from '@/features/posts/utils/pagination';
import { toPostSummaries } from '@/features/posts/utils/to-post-summary';
import { matchesTagSlug } from '@/lib/tag-slug';

import { TagPagePresentational } from './TagPagePresentational';

type TagPageContainerProps = {
  tag: string;
  currentPage?: number;
};

export const TagPageContainer = async ({ tag, currentPage = 1 }: TagPageContainerProps) => {
  const allPosts = await getPostsByTag(tag);

  if (allPosts.length === 0) {
    notFound();
  }

  const totalPages = getTotalPages(allPosts.length);
  const paginatedPosts = getPageItems(allPosts, currentPage);

  const sanitizedPosts = toPostSummaries(paginatedPosts);

  const displayTag = allPosts[0]?.frontmatter.tags?.find((t) => matchesTagSlug(t, tag)) || tag;

  return (
    <TagPagePresentational
      posts={sanitizedPosts}
      displayTag={displayTag}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={allPosts.length}
      tag={tag}
    />
  );
};
