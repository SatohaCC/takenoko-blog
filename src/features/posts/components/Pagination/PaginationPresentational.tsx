import type { Route } from 'next';
import Link from 'next/link';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import {
  disabledStyles,
  ellipsisStyles,
  mobileIndicatorStyles,
  pageNumberRecipe,
  pageNumbersStyles,
  paginationLinkStyles,
  paginationNavStyles,
} from './PaginationPresentational.styles';

type PaginationPresentationalProps = {
  currentPage: number;
  totalPages: number;
  pages: (number | 'ellipsis')[];
  getPageUrl: (page: number) => string;
};

export const PaginationPresentational = ({
  currentPage,
  totalPages,
  pages,
  getPageUrl,
}: PaginationPresentationalProps) => {
  return (
    <nav aria-label="ページネーション" className={paginationNavStyles}>
      {/* getPageUrl は動的に組み立てた string を返すため、リテラル型推論が効かず Route へのキャストが必要 */}
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1) as Route}
          className={paginationLinkStyles}
          aria-label="前のページ"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <a
          className={disabledStyles}
          role="link"
          aria-disabled="true"
          aria-label="前のページ（現在最初のページです）"
        >
          <ChevronLeft size={20} />
        </a>
      )}

      {/* Page Numbers */}
      <div className={pageNumbersStyles}>
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className={ellipsisStyles} role="img" aria-label="省略">
              <MoreHorizontal size={16} aria-hidden="true" />
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page) as Route}
              className={pageNumberRecipe({ active: currentPage === page })}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`ページ ${page}`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Mobile Page Indicator */}
      <div className={mobileIndicatorStyles}>
        {currentPage} / {totalPages}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1) as Route}
          className={paginationLinkStyles}
          aria-label="次のページ"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <a
          className={disabledStyles}
          role="link"
          aria-disabled="true"
          aria-label="次のページ（現在最後のページです）"
        >
          <ChevronRight size={20} />
        </a>
      )}
    </nav>
  );
};
