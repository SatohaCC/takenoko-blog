import type { Route } from 'next';
import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { buttonRecipe } from '@/components/ui/Button/styles';

type BackButtonProps<T extends string> = {
  /** 遷移先URL。デフォルトは記事一覧（トップページ） */
  href?: Route<T>;
  /** リンクのラベル文言 */
  label?: string;
};

/**
 * 一覧ページなどへ戻るためのリンクコンポーネント。
 * クロール可能な Link を使用し、デザインはボタン風（ゴーストバリアント）に仕上げます。
 *
 * @summary 記事一覧やタグ一覧への戻るリンクに使用する
 */
export const BackButton = <T extends string>({
  href = '/' as Route<T>,
  label = '記事一覧に戻る',
}: BackButtonProps<T>) => {
  return (
    <Link href={href} className={buttonRecipe({ variant: 'ghost', size: 'md' })}>
      <ArrowLeft size={18} />
      {label}
    </Link>
  );
};
