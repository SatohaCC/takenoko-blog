import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { ExternalLink } from './ExternalLink';

const meta = {
  title: 'UI/ExternalLink',
  component: ExternalLink,
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExternalLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `https://` などサイト外URLへのリンク。`target="_blank"` と `rel="noopener noreferrer"` が自動付与される。
 *
 * @summary 外部サイトへのリンクに使用する
 */
export const Default: Story = {
  args: {
    href: 'https://example.com',
    children: '外部サイト',
  },
  play: async ({ canvas, step }) => {
    let link: HTMLElement;

    await step('Arrange: リンクを取得', async () => {
      link = canvas.getByRole('link', { name: '外部サイト' });
    });

    await step(
      'Assert: 外部リンクとして描画され、セキュリティ属性（target="_blank", rel="noopener noreferrer"）が自動付与されていることを確認',
      async () => {
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        await expect(link).toHaveAttribute('href', 'https://example.com');
      }
    );
  },
};

/**
 * `rel` prop を渡してもセキュリティ用の `rel="noopener noreferrer"` は上書きされないことを検証する。
 *
 * @summary セキュリティ属性が保護されていることの確認
 */
export const RelIsNotOverridden: Story = {
  args: {
    href: 'https://example.com',
    children: 'relを上書きしようとするリンク',
    rel: 'me',
  },
  play: async ({ canvas, step }) => {
    let link: HTMLElement;

    await step('Arrange: リンクを取得', async () => {
      link = canvas.getByRole('link', { name: 'relを上書きしようとするリンク' });
    });

    await step(
      'Assert: rel プロパティを指定しても、セキュリティ用の rel="noopener noreferrer" が優先されていることを確認',
      async () => {
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    );
  },
};
