import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/features/posts/api/posts';
import { getAllTags } from '@/features/tags/api/tags';
import { slugifyTag } from '@/lib/tag-slug';
import { absoluteUrl } from '@/lib/url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: absoluteUrl(`/tags/${slugifyTag(tag.name)}`),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [
    {
      url: absoluteUrl(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/about'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
