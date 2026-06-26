import { getPaginatedPosts, getTotalPages } from '@/features/posts/api/posts';
import { toPostSummaries } from '@/features/posts/utils/to-post-summary';

import { PostListPresentational } from './PostListPresentational';

type PostListContainerProps = {
  currentPage: number;
  title?: string;
  subtitle?: string;
};

export const PostListContainer = async ({
  currentPage,
  title,
  subtitle,
}: PostListContainerProps) => {
  const [posts, totalPages] = await Promise.all([getPaginatedPosts(currentPage), getTotalPages()]);

  const sanitizedPosts = toPostSummaries(posts);

  return (
    <PostListPresentational
      posts={sanitizedPosts}
      totalPages={totalPages}
      currentPage={currentPage}
      title={title}
      subtitle={subtitle}
    />
  );
};
