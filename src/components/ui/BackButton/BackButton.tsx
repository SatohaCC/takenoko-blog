import { ArrowLeft } from 'lucide-react';

import { AppLink } from '@/components/ui/AppLink/AppLink';
import { buttonRecipe } from '@/components/ui/Button/styles';

type BackButtonProps = {
  /** 遷移先URL。デフォルトは記事一覧（トップページ） */
  href?: string;
  /** リンクのラベル文言 */
  label?: string;
};

/**
 * 一覧ページなどへ戻るためのリンクコンポーネント。
 * クロール可能な AppLink を使用し、デザインはボタン風（ゴーストバリアント）に仕上げます。
 *
 * @summary 記事一覧やタグ一覧への戻るリンクに使用する
 */
export const BackButton = ({ href = '/', label = '記事一覧に戻る' }: BackButtonProps) => {
  return (
    <AppLink href={href} className={buttonRecipe({ variant: 'ghost', size: 'md' })}>
      <ArrowLeft size={18} />
      {label}
    </AppLink>
  );
};
