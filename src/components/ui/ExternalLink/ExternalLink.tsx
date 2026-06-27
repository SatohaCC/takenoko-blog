import { type ComponentPropsWithoutRef } from 'react';

/**
 * `http://` または `https://` で始まる文字列のみを許可する型。
 * `target="_blank"` で開く前提のため、ブラウザで開けるスキーム以外（`mailto:` 等）は型レベルで排除する。
 */
export type UrlString = `http://${string}` | `https://${string}`;

export type ExternalLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  /** リンク先URL。サイト外のURLに使用する */
  href: UrlString;
};

/**
 * サイト外リンク用のコンポーネント。
 * `target="_blank"` と `rel="noopener noreferrer"` が自動付与される。
 * リンクの基本スタイル（下線なし・hover色・フォーカスリング）は panda.config.ts の globalCss で `a` タグに一括適用される。
 *
 * @summary 外部サイトへのリンクに使用する
 */
export const ExternalLink = ({ href, children, className, ...props }: ExternalLinkProps) => {
  // 型チェックは記事本文(MDX)など実行時に決まる href までは検証できないため、実行時にも検証する。
  // `new URL()` は `javascript:` 等の危険なスキームも構文的に正しいURLとして解釈してしまうため、
  // protocol が http/https であることまで確認する（XSS・不正スキーム対策）。
  // 不正な値はレンダリング時に例外として表面化し、ビルド時に検出できる。
  let protocol: string;
  try {
    protocol = new URL(href).protocol;
  } catch {
    throw new Error(`ExternalLink: href が有効なURLではありません: "${href}"`);
  }
  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new Error(`ExternalLink: href に許可されていないスキームが指定されました: "${href}"`);
  }

  return (
    <a href={href} className={className} {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};
