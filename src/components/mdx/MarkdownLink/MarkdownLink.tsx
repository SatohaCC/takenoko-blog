import { type ComponentPropsWithoutRef } from 'react';

import type { Route } from 'next';
import Link from 'next/link';

import { ExternalLink, type UrlString } from '@/components/ui/ExternalLink/ExternalLink';

export type MarkdownLinkProps = ComponentPropsWithoutRef<'a'>;

/**
 * 記事本文（MDX）内の `a` タグ用コンポーネント。
 * `/` 始まりは内部リンク（Next.js Link）、`#` 始まりはページ内アンカー（plain `<a>`）、
 * それ以外は外部リンク（ExternalLink）としてレンダリングを振り分ける。
 *
 * @summary 記事本文内のリンクのレンダリングに使用する
 */
export const MarkdownLink = ({ href, children, ...props }: MarkdownLinkProps) => {
  if (!href) {
    return <a {...props}>{children}</a>;
  }

  if (href.startsWith('/')) {
    return (
      <Link href={href as Route} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <ExternalLink href={href as UrlString} {...props}>
      {children}
    </ExternalLink>
  );
};
