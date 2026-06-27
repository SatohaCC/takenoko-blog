import Link from 'next/link';

import { FormattedDate } from '@/components/ui/FormattedDate/FormattedDate';
import { TagLink, TagList } from '@/components/ui/Tag/Tag';
import type { Post } from '@/features/posts/types';
import type { Tag } from '@/features/tags/types';

import {
  postDateStyles,
  postItemStyles,
  postLinkStyles,
  postListStyles,
  sectionHeadingStyles,
  sidebarContainerStyles,
  tagContainerStyles,
} from './SidebarPresentational.styles';

type SidebarPresentationalProps = {
  allTags: Tag[];
  latestPosts: Post[];
};

export const SidebarPresentational = ({ allTags, latestPosts }: SidebarPresentationalProps) => {
  return (
    <div className={sidebarContainerStyles}>
      {/* Recent Posts Section */}
      <section aria-labelledby="sidebar-latest-posts">
        <h2 id="sidebar-latest-posts" className={sectionHeadingStyles}>
          最新の記事
        </h2>
        <ul className={postListStyles}>
          {latestPosts.map((post) => (
            <li key={post.slug} className={postItemStyles}>
              <Link href={`/posts/${post.slug}`} className={postLinkStyles}>
                {post.frontmatter.title}
              </Link>
              <FormattedDate date={post.frontmatter.date} className={postDateStyles} />
            </li>
          ))}
        </ul>
      </section>

      {/* Tags Section */}
      <section aria-labelledby="sidebar-tags">
        <h2 id="sidebar-tags" className={sectionHeadingStyles}>
          タグ一覧
        </h2>
        <div className={tagContainerStyles}>
          <TagList>
            {allTags.map((tag) => (
              <TagLink key={tag.name} tag={tag.name}>
                {tag.name} ({tag.count})
              </TagLink>
            ))}
          </TagList>
        </div>
      </section>
    </div>
  );
};
