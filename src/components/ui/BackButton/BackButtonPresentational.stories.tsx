import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { BackButtonPresentational } from './BackButtonPresentational';

const meta = {
  title: 'UI/BackButton',
  component: BackButtonPresentational,
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
  args: {
    href: '/',
  },
} satisfies Meta<typeof BackButtonPresentational>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 記事一覧へ戻るリンクのデフォルト表示。
 *
 * @summary 記事一覧ページへ戻るナビゲーションに使用する
 */
export const Default: Story = {};

/**
 * カスタム遷移先を設定した場合のリンク先確認。
 *
 * @summary カスタムURLへの遷移確認
 */
export const CustomPath: Story = {
  args: {
    href: '/custom-path',
  },
  play: async ({ canvas, step }) => {
    let link: HTMLElement;

    await step('Arrange: 戻るリンクを取得', async () => {
      link = canvas.getByRole('link', { name: '記事一覧に戻る' });
    });

    await step('Assert: リンク先が正しく設定されていることを確認', async () => {
      await expect(link).toHaveAttribute('href', '/custom-path');
    });
  },
};
