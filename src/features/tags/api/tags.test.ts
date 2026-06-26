import fs from 'fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { readMarkdownFile } from '@/lib/mdx-parser';

import { getAllTags } from './tags';

const { mockReaddir } = vi.hoisted(() => ({
  mockReaddir: vi.fn<() => Promise<string[]>>(),
}));

vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock('fs', () => ({
  default: {
    promises: {
      access: vi.fn(),
      readdir: mockReaddir,
    },
  },
}));
vi.mock('@/lib/mdx-parser');

function setupPostsWithTags(
  posts: (string[] | { tags?: string[]; draft?: boolean } | undefined)[]
) {
  const fileNames = posts.map((_, i) => `post-${i}.mdx`);
  vi.mocked(fs.promises.access).mockResolvedValue(undefined);
  mockReaddir.mockResolvedValue(fileNames);
  vi.mocked(readMarkdownFile).mockImplementation(async (relativePath: string) => {
    const match = relativePath.match(/post-(\d+)\.mdx?$/);
    if (!match) return undefined;
    const index = parseInt(match[1], 10);
    const item = posts[index];
    if (Array.isArray(item)) {
      return { data: { tags: item }, content: '' };
    } else if (item && typeof item === 'object') {
      return { data: { tags: item.tags, draft: item.draft }, content: '' };
    }
    return { data: { tags: undefined }, content: '' };
  });
}

describe('tags API - getAllTags', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('ディレクトリが存在しない場合、空配列を返す', async () => {
    vi.mocked(fs.promises.access).mockRejectedValue(new Error('ENOENT'));
    expect(await getAllTags()).toEqual([]);
  });

  it('タグをカウントして件数の多い順にソートして返す', async () => {
    setupPostsWithTags([['react', 'typescript'], ['react', 'nextjs'], ['react']]);

    const result = await getAllTags();
    expect(result).toEqual([
      { name: 'react', count: 3 },
      { name: 'typescript', count: 1 },
      { name: 'nextjs', count: 1 },
    ]);
  });

  it('tags が undefined の投稿があってもクラッシュしない', async () => {
    setupPostsWithTags([undefined, ['react']]);

    const result = await getAllTags();
    expect(result).toEqual([{ name: 'react', count: 1 }]);
  });

  it('本番環境（NODE_ENV=production）ではドラフト記事のタグを除外する', async () => {
    const originalEnv = process.env.NODE_ENV;
    // @ts-expect-error - NODE_ENV is read-only in Node/Jest/Vitest typing, but configurable in practice
    process.env.NODE_ENV = 'production';

    try {
      setupPostsWithTags([
        { tags: ['react', 'nextjs'], draft: false },
        { tags: ['typescript', 'react'], draft: true },
      ]);

      const result = await getAllTags();
      expect(result).toEqual([
        { name: 'react', count: 1 },
        { name: 'nextjs', count: 1 },
      ]);
    } finally {
      // @ts-expect-error - NODE_ENV is read-only
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('開発環境など本番環境以外ではドラフト記事のタグも含めてカウントする', async () => {
    const originalEnv = process.env.NODE_ENV;
    // @ts-expect-error - NODE_ENV is read-only
    process.env.NODE_ENV = 'development';

    try {
      setupPostsWithTags([
        { tags: ['react', 'nextjs'], draft: false },
        { tags: ['typescript', 'react'], draft: true },
      ]);

      const result = await getAllTags();
      expect(result).toEqual([
        { name: 'react', count: 2 },
        { name: 'nextjs', count: 1 },
        { name: 'typescript', count: 1 },
      ]);
    } finally {
      // @ts-expect-error - NODE_ENV is read-only
      process.env.NODE_ENV = originalEnv;
    }
  });
});
