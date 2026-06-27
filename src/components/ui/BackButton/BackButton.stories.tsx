import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { BackButton } from './BackButton';

const meta = {
  title: 'UI/BackButton',
  component: BackButton,
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
  args: {
    href: '/',
  },
} satisfies Meta<typeof BackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 記事一覧へ戻るリンクのデフォルト表示。
 *
 * @summary 記事一覧ページへ戻るナビゲーションに使用する
 */
export const Default: Story = {};

/**
 * カスタム遷移先・ラベルを設定した場合の表示とリンク先確認。
 *
 * @summary 任意の一覧ページへの戻るリンクとして利用する
 */
export const CustomPath: Story = {
  args: {
    href: '/about',
    label: 'すべての記事に戻る',
  },
  play: async ({ canvas, step }) => {
    let link: HTMLElement;

    await step('Arrange: 戻るリンクを取得', async () => {
      link = canvas.getByRole('link', { name: 'すべての記事に戻る' });
    });

    await step('Assert: リンク先が正しく設定されていることを確認', async () => {
      await expect(link).toHaveAttribute('href', '/about');
    });
  },
};
