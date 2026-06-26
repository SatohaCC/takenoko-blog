import { ArrowLeft } from 'lucide-react';

import { AppLink } from '@/components/ui/AppLink/AppLink';
import { buttonRecipe } from '@/components/ui/Button/styles';

type BackButtonPresentationalProps = {
  /** 遷移先URL */
  href: string;
};

/**
 * 記事一覧ページに戻るためのリンクコンポーネント。
 * クロール可能な AppLink を使用し、デザインはボタン風（ゴーストバリアント）に仕上げます。
 *
 * @summary 記事一覧への戻るリンクに使用する
 */
export const BackButtonPresentational = ({ href }: BackButtonPresentationalProps) => {
  return (
    <AppLink href={href} className={buttonRecipe({ variant: 'ghost', size: 'md' })}>
      <ArrowLeft size={18} />
      記事一覧に戻る
    </AppLink>
  );
};
