import type { MetadataRoute } from 'next';

import { siteConfig } from '@/content/site';
import { getAllPosts } from '@/features/posts/api/posts';
import { getAllTags } from '@/features/tags/api/tags';
import { slugifyTag } from '@/lib/tag-slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteConfig.url}/tags/${slugifyTag(tag.name)}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
