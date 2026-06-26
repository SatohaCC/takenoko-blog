import type { Metadata } from 'next';

import { TagPageContainer as TagPage } from '@/features/posts/components/TagPage/TagPageContainer';
import { getAllTags } from '@/features/tags/api/tags';
import { slugifyTag } from '@/lib/tag-slug';
import { absoluteUrl } from '@/lib/url';

export const generateStaticParams = async () => {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: slugifyTag(tag.name),
  }));
};

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `「${tag}」タグの記事一覧`,
    alternates: { canonical: absoluteUrl(`/tags/${tag}`) },
  };
}

const TagPageWrapper = async ({ params }: TagPageProps) => {
  const { tag } = await params;

  return <TagPage tag={tag} currentPage={1} />;
};

export default TagPageWrapper;
