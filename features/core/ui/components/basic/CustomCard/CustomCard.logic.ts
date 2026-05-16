import { match } from 'ts-pattern';

import { colors } from '@/features/core/ui/style/colors';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

import type { CustomCardStyle } from '@/features/core/ui/components/basic/CustomCard/CustomCard.style';
import { styles } from '@/features/core/ui/components/basic/CustomCard/CustomCard.style';

export const CardType = { Default: 'default', Secondary: 'secondary' } as const;
export type CardType = (typeof CardType)[keyof typeof CardType];

export type CustomCardLogicProps = {
  cardType?: CardType;
  selected?: boolean;
};

export const useCustomCardLogic = ({ selected = false, cardType = CardType.Default }: CustomCardLogicProps) => {
  const cardStyle: CustomCardStyle = match({ cardType, selected })
    .with({ selected: true }, () => ({
      backgroundColor: colors.primaryBlack,
      borderColor: colors.primaryBlack,
      borderWidth: spacing.Zero,
    }))
    .with({ cardType: CardType.Default }, () => ({
      backgroundColor: colors.primaryWhite,
      borderColor: colors.primaryWhite,
      borderWidth: spacing.Zero,
    }))
    .with({ cardType: CardType.Secondary }, () => ({
      backgroundColor: colors.primaryWhite,
      borderColor: colors.primaryBlack,
      borderWidth: spacing.ThreeQuarterMinimal,
    }))
    .exhaustive();

  const componentStyle = styles(cardStyle);

  return {
    componentStyle,
  };
};
