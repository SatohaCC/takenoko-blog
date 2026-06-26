/**
 * タグ名を URL スラグ（`/tags/xxx`）に正規化します。
 * 小文字化し、連続する空白をハイフンに置換します。
 *
 * @example slugifyTag('Machine Learning') // => 'machine-learning'
 */
export const slugifyTag = (name: string): string => name.toLowerCase().replace(/\s+/g, '-');

/**
 * タグ名が指定の URL スラグに一致するか判定します。
 * タグ名を正規化したスラグと、（小文字化した）スラグを比較します。
 * これにより空白を含むタグ名でも正しく照合できます。
 */
export const matchesTagSlug = (name: string, slug: string): boolean =>
  slugifyTag(name) === slug.toLowerCase();

/**
 * 2つのタグ名が（大文字小文字を無視して）同一か判定します。
 * どちらも生のタグ名（スラグ化前）を比較する用途に使用します。
 */
export const isSameTagName = (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase();
