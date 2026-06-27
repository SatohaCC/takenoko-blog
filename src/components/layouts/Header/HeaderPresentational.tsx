import React from 'react';

import Link from 'next/link';

import { ExternalLink } from '@/components/ui/ExternalLink/ExternalLink';
import { GithubIcon } from '@/components/ui/GithubIcon/GithubIcon';
import { ThemeToggleContainer as ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggleContainer';
import { siteConfig } from '@/content/site';
import { SearchBoxContainer as SearchBox } from '@/features/posts/components/SearchBox/SearchBoxContainer';

import {
  headerContainerStyles,
  headerInnerStyles,
  iconButtonStyles,
  logoStyles,
  navContainerStyles,
  navLinkStyles,
} from './HeaderPresentational.styles';

export const HeaderPresentational = () => {
  return (
    <header
      className={headerContainerStyles}
      style={{ viewTransitionName: 'page-header' } as React.CSSProperties}
    >
      <div className={headerInnerStyles}>
        <Link href="/" className={logoStyles}>
          {siteConfig.title}
        </Link>

        <nav className={navContainerStyles} aria-label="グローバルナビゲーション">
          <SearchBox />
          <Link href={siteConfig.links.about} className={navLinkStyles}>
            About
          </Link>
          <ExternalLink
            href={siteConfig.links.github}
            className={iconButtonStyles}
            aria-label="GitHub"
          >
            <GithubIcon />
          </ExternalLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
