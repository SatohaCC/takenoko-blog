import { Suspense } from 'react';

import Link from 'next/link';

import { CopyrightYear } from '@/components/ui/CopyrightYear/CopyrightYear';
import { siteConfig } from '@/content/site';

import {
  footerContainerStyles,
  footerInnerStyles,
  footerLinkStyles,
  footerNavStyles,
} from './FooterPresentational.styles';

export const FooterPresentational = () => {
  return (
    <footer className={footerContainerStyles}>
      <div className={footerInnerStyles}>
        <nav className={footerNavStyles} aria-label="フッターナビゲーション">
          <Link href="/" className={footerLinkStyles}>
            ホーム
          </Link>
          <Link href={siteConfig.links.about} className={footerLinkStyles}>
            About
          </Link>
        </nav>
        <small>
          &copy;{' '}
          <Suspense fallback={null}>
            <CopyrightYear />
          </Suspense>{' '}
          {siteConfig.title}. All rights reserved.
        </small>
      </div>
    </footer>
  );
};
